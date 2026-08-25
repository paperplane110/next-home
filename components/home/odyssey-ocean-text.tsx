"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  VERT_SRC,
  SPLAT_FRAG,
  WAVE_FRAG,
  NORMAL_FRAG,
  COMPOSITE_FRAG,
  createProgram,
  createFbo,
  deleteFbo,
} from "./odyssey-ocean-shaders";

type OdysseyOceanTextProps = {
  children: React.ReactNode;
  /** 作用于外层容器；字体、字号、字重通过它传给内部 span 与 SVG 遮罩文字 */
  className?: string;
};

/**
 * 用 WebGL 海洋动画填充文字字形。
 *
 * 实现：canvas 全幅渲染不透明海洋，由内联 SVG <text> 构成的 CSS mask
 * 在合成器层面裁成字形。SVG 文字走浏览器的原生文字栅格化（子像素抗锯齿
 * 与 hinting），边缘锐度与普通 DOM 文字一致；HTML 文字层保留在顶层
 * （color: transparent）以维持布局、文本选择与无障碍。
 *
 * 字体、字号、字重、letter-spacing 全部从父级（如 h1）继承，SVG 遮罩
 * 与 DOM 文字天然同款；基线通过测量 span 字形确定。
 *
 * WebGL 不可用或用户偏好减少动态时，退回静态渐变文字
 * （.odyssey-ocean-text-fallback）。
 */
export function OdysseyOceanText({
  children,
  className,
}: OdysseyOceanTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskTextRef = useRef<SVGTextElement | null>(null);
  const [fallback, setFallback] = useState(false);

  // 每个实例独立的遮罩 id，避免同页多实例互相干扰
  const rawId = useId();
  const maskId = `odyssey-ocean-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // 同步 SVG 遮罩文字：内容、基线（相对容器顶部）都与 DOM span 对齐
  const syncMask = useCallback(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const maskText = maskTextRef.current;
    if (!container || !text || !maskText) return;

    const cs = getComputedStyle(text);
    const measure = document.createElement("canvas").getContext("2d");
    if (!measure) return;
    measure.font = [
      cs.fontStyle,
      cs.fontVariant,
      cs.fontWeight,
      cs.fontSize,
      cs.fontFamily,
    ].join(" ");
    const m = measure.measureText(text.textContent ?? "");
    const fontSize = parseFloat(cs.fontSize);
    const ascent =
      m.actualBoundingBoxAscent ?? fontSize * 0.8;

    const textRect = text.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    // DOM 基线 = 行盒顶部 + half-leading + ascent
    // （line-height: normal 时内容区在行盒内垂直居中）
    const halfLeading = Math.max(0, (textRect.height - fontSize) / 2);
    const baselineY =
      textRect.top - containerRect.top + halfLeading + ascent;

    maskText.textContent = text.textContent ?? "";
    maskText.setAttribute("y", String(baselineY));
  }, []);

  useEffect(() => {
    syncMask();
    const container = containerRef.current;
    const ro = new ResizeObserver(syncMask);
    if (container) ro.observe(container);
    window.addEventListener("resize", syncMask);
    // 针对当前字体做定向加载等待，避免 fallback 字体的 metrics 造成错位；
    // fonts.ready 作为兜底再同步一次
    const text = textRef.current;
    if (text) {
      const cs = getComputedStyle(text);
      const fontSpec = [
        cs.fontStyle,
        cs.fontVariant,
        cs.fontWeight,
        cs.fontSize,
        cs.fontFamily,
      ].join(" ");
      document.fonts?.load(fontSpec).then(syncMask).catch(() => {});
    }
    document.fonts?.ready.then(syncMask).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncMask);
    };
  }, [children, syncMask]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || typeof window === "undefined") return;

    // 减少动态偏好：退回静态渐变文字
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setFallback(true);
      return;
    }

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    }) as WebGL2RenderingContext | null;
    if (!gl) {
      setFallback(true);
      return;
    }
    if (!gl.getExtension("EXT_color_buffer_float")) {
      setFallback(true);
      return;
    }

    let disposed = false;
    let rafId = 0;
    let paused = false;

    const progSplat = createProgram(gl, VERT_SRC, SPLAT_FRAG);
    const progWave = createProgram(gl, VERT_SRC, WAVE_FRAG);
    const progNorm = createProgram(gl, VERT_SRC, NORMAL_FRAG);
    const progComp = createProgram(gl, VERT_SRC, COMPOSITE_FRAG);

    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const bindAttrib = (prog: WebGLProgram) => {
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    const SIM_W = 320;
    const SIM_H = 120;
    let fA = createFbo(gl, SIM_W, SIM_H);
    let fB = createFbo(gl, SIM_W, SIM_H);
    const fN = createFbo(gl, SIM_W, SIM_H, gl.RG16F, gl.RG);

    const uniforms: Record<string, Record<string, WebGLUniformLocation | null>> = {
      splat: {
        u_cur: gl.getUniformLocation(progSplat, "u_cur"),
        u_center: gl.getUniformLocation(progSplat, "u_center"),
        u_radius: gl.getUniformLocation(progSplat, "u_radius"),
        u_amp: gl.getUniformLocation(progSplat, "u_amp"),
      },
      wave: {
        u_cur: gl.getUniformLocation(progWave, "u_cur"),
        u_prev: gl.getUniformLocation(progWave, "u_prev"),
        u_texel: gl.getUniformLocation(progWave, "u_texel"),
        u_c2: gl.getUniformLocation(progWave, "u_c2"),
        u_damp: gl.getUniformLocation(progWave, "u_damp"),
      },
      norm: {
        u_u: gl.getUniformLocation(progNorm, "u_u"),
        u_texel: gl.getUniformLocation(progNorm, "u_texel"),
        u_strength: gl.getUniformLocation(progNorm, "u_strength"),
      },
      comp: {
        u_normal: gl.getUniformLocation(progComp, "u_normal"),
        u_res: gl.getUniformLocation(progComp, "u_res"),
        u_time: gl.getUniformLocation(progComp, "u_time"),
      },
    };

    const dropPulse = (cx: number, cy: number, r = 0.04, amp = 0.55) => {
      gl.useProgram(progSplat);
      bindAttrib(progSplat);
      gl.viewport(0, 0, SIM_W, SIM_H);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fA.fbo);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fA.tex);
      gl.uniform1i(uniforms.splat.u_cur, 0);
      gl.uniform2f(uniforms.splat.u_center, cx, cy);
      gl.uniform1f(uniforms.splat.u_radius, r);
      gl.uniform1f(uniforms.splat.u_amp, amp);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    const stepWaveOnce = () => {
      gl.useProgram(progWave);
      bindAttrib(progWave);
      gl.viewport(0, 0, SIM_W, SIM_H);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fB.fbo);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fA.tex);
      gl.uniform1i(uniforms.wave.u_cur, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, fB.tex);
      gl.uniform1i(uniforms.wave.u_prev, 1);
      gl.uniform2f(uniforms.wave.u_texel, 1 / SIM_W, 1 / SIM_H);
      gl.uniform1f(uniforms.wave.u_c2, 0.24);
      gl.uniform1f(uniforms.wave.u_damp, 0.9965);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const tmp = fA;
      fA = fB;
      fB = tmp;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    const buildNormal = () => {
      gl.useProgram(progNorm);
      bindAttrib(progNorm);
      gl.viewport(0, 0, SIM_W, SIM_H);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fN.fbo);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fA.tex);
      gl.uniform1i(uniforms.norm.u_u, 0);
      gl.uniform2f(uniforms.norm.u_texel, 1 / SIM_W, 1 / SIM_H);
      gl.uniform1f(uniforms.norm.u_strength, 36.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    let cw = 0;
    let ch = 0;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (w === cw && h === ch) return;
      cw = w;
      ch = h;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let lastDrop = 0;
    let initialDrops = 0;
    let startTs = 0;

    const step = (ts: number) => {
      if (disposed) return;
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;

      if (!paused) {
        if (initialDrops < 3 && elapsed > 500 + initialDrops * 700) {
          const cx = 0.22 + Math.random() * 0.56;
          const cy = 0.2 + Math.random() * 0.6;
          dropPulse(cx, cy, 0.026, 0.38);
          initialDrops++;
        }

        if (ts - lastDrop > 1700 + Math.random() * 1100) {
          lastDrop = ts;
          const cx = 0.12 + Math.random() * 0.76;
          const cy = 0.15 + Math.random() * 0.7;
          dropPulse(cx, cy, 0.02 + Math.random() * 0.012, 0.28 + Math.random() * 0.2);
        }

        for (let i = 0; i < 3; i++) stepWaveOnce();
        buildNormal();

        gl.useProgram(progComp);
        bindAttrib(progComp);
        gl.viewport(0, 0, cw, ch);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fN.tex);
        gl.uniform1i(uniforms.comp.u_normal, 0);
        gl.uniform2f(uniforms.comp.u_res, cw, ch);
        gl.uniform1f(uniforms.comp.u_time, elapsed / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        paused = !e.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const onLost = () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      canvas.style.display = "none";
      setFallback(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      deleteFbo(gl, fA);
      deleteFbo(gl, fB);
      deleteFbo(gl, fN);
      gl.deleteProgram(progSplat);
      gl.deleteProgram(progWave);
      gl.deleteProgram(progNorm);
      gl.deleteProgram(progComp);
      gl.deleteBuffer(quad);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <canvas
        ref={canvasRef}
        style={
          fallback
            ? undefined
            : {
                maskImage: `url(#${maskId})`,
                WebkitMaskImage: `url(#${maskId})`,
              }
        }
        className={cn(
          "absolute inset-0 z-0 h-full w-full block",
          fallback && "hidden"
        )}
        aria-hidden
      />
      {/* 遮罩源：与 DOM 文字同款字体（继承自父级），仅作裁剪用 */}
      <svg
        className="absolute inset-0 z-0 h-full w-full"
        aria-hidden
        focusable="false"
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <text ref={maskTextRef} x="0" y="0" fill="#fff" />
          </mask>
        </defs>
      </svg>
      <span
        ref={textRef}
        className={cn(
          "relative z-10",
          fallback ? "odyssey-ocean-text-fallback" : "text-transparent"
        )}
      >
        {children}
      </span>
    </div>
  );
}
