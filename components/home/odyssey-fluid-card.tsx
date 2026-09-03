"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { getOdysseyHomeHref } from "@/lib/odyssey-i18n";

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

type Props = { className?: string };

export function OdysseyFluidCard({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const link = linkRef.current;
    if (!canvas || !link || typeof window === "undefined") return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      alpha: false,
      powerPreference: "low-power",
    }) as WebGL2RenderingContext | null;
    if (!gl) return;

    const extColorFloat = gl.getExtension("EXT_color_buffer_float");
    if (!extColorFloat) return;

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
      const rect = link.getBoundingClientRect();
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
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(resize)
      : null;
    ro?.observe(link);

    let lastDrop = 0;
    let initialDrops = 0;
    let lastPointer = 0;
    let startTs = 0;
    let lastPtrX = -1;
    let lastPtrY = -1;

    function dropLinePulse(
      ax: number, ay: number, bx: number, by: number,
      count = 5, r = 0.022, amp = 0.58
    ) {
      for (let i = 0; i < count; i++) {
        const t = count <= 1 ? 0.5 : i / (count - 1);
        const px = ax + (bx - ax) * t + (Math.random() - 0.5) * 0.006;
        const py = ay + (by - ay) * t + (Math.random() - 0.5) * 0.006;
        const jitterR = r * (0.80 + Math.random() * 0.45);
        const jitterA = amp * (0.68 + Math.random() * 0.72);
        dropPulse(px, py, jitterR, jitterA);
      }
    }

    const step = (ts: number) => {
      if (disposed) return;
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;

      if (!paused) {
        if (
          initialDrops < 3 &&
          elapsed > 500 + initialDrops * 700
        ) {
          const cx =
            0.22 + Math.random() * 0.56;

          const cy =
            0.20 + Math.random() * 0.60;

          dropPulse(
            cx,
            cy,
            0.026,
            0.38
          );

          initialDrops++;
        }

        if (
          ts - lastDrop >
          1700 + Math.random() * 1100
        ) {
          lastDrop = ts;

          const cx =
            0.12 + Math.random() * 0.76;

          const cy =
            0.15 + Math.random() * 0.70;

          dropPulse(
            cx,
            cy,
            0.020 + Math.random() * 0.012,
            0.28 + Math.random() * 0.20
          );
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
    io.observe(link);

    const onLost = () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro?.disconnect();
      canvas.style.display = "none";
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const handlePointer = (ev: PointerEvent) => {
      if (disposed) return;
      if (tsNow() - lastPointer < 45) return;
      lastPointer = tsNow();
      const rect = link.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width;
      const y = 1 - (ev.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        lastPtrX = -1;
        lastPtrY = -1;
        return;
      }
      if (lastPtrX >= 0) {
        const dx = x - lastPtrX;
        const dy = y - lastPtrY;
        const d = Math.min(0.14, Math.hypot(dx, dy));
        if (d > 0.002) {
          const pad = d * 0.45;
          const nx = -dy / Math.max(d, 1e-5);
          const ny = dx / Math.max(d, 1e-5);
          const ax = x - dx * pad + nx * 0.004;
          const ay = y - dy * pad + ny * 0.004;
          const bx = x + dx * pad - nx * 0.004;
          const by = y + dy * pad - ny * 0.004;
          const count = 3 + Math.min(3, Math.floor(d * 60));
          dropLinePulse(ax, ay, bx, by, count, 0.018, 0.38);
        } else {
          dropPulse(x, y, 0.022, 0.34);
        }
      } else {
        dropPulse(x, y, 0.026, 0.42);
      }
      lastPtrX = x;
      lastPtrY = y;
    };
    const tsNow = () => performance.now();
    link.addEventListener("pointermove", handlePointer);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro?.disconnect();
      link.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("resize", onResize);
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
    <Link
      ref={linkRef}
      href={getOdysseyHomeHref()}
      className={cn(
        "odyssey-fluid-card group relative block w-full overflow-hidden rounded-2xl",
        "bg-[linear-gradient(135deg,#0a1628_0%,#123459_50%,#030814_100%)]",
        "aspect-video sm:aspect-21/9",
        "ring-1 ring-white/10",
        "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[oklch(0.38_0.12_260)]",
        className
      )}
      aria-label="The Odyssey Walkthrough Wiki · 奥德赛阅读指南"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full block pointer-events-none"
        aria-hidden
      />
      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-6">
        <div>
          <h3
            className={cn(
              "mt-3 font-semibold soft-70 text-white leading-[1.05] text-3xl sm:text-5xl",
              fraunces.className
            )}
          >
            The Odyssey
          </h3>
          <h3
            className={cn(
              "font-light text-white leading-[1.08] mt-1 text-2xl sm:text-4xl",
              "font-serif"
            )}
          >
            伟大的返航
          </h3>
        </div>
        <div className="flex items-end justify-between w-full">
          <p className="font-sans font-medium text-sm sm:text-[15px] text-odyssey-300/40 group-hover:text-white transition-colors duration-200 flex items-center gap-1.5">
            《奥德赛》百科
            <ArrowRightIcon className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
          </p>
          <Waves className="size-7 sm:size-8 text-odyssey-300/40 transition-colors group-hover:text-odyssey-100" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
