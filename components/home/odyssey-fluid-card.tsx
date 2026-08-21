"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { getOdysseyHomeHref } from "@/lib/odyssey-i18n";

const VERT_SRC = `#version 300 es
precision highp float;
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const SPLAT_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 v_uv;
out vec4 outColor;
uniform sampler2D u_cur;
uniform vec2 u_center;
uniform float u_radius;
uniform float u_amp;
void main() {
  vec2 d = (v_uv - u_center) / u_radius;
  float r2 = dot(d, d);
  float pulse = r2 < 1.0 ? u_amp * (1.0 - r2) * (1.0 - r2) : 0.0;
  float prev = texture(u_cur, v_uv).x;
  outColor = vec4(prev + pulse, 0.0, 0.0, 1.0);
}`;

const WAVE_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 v_uv;
out vec4 outColor;
uniform sampler2D u_cur;
uniform sampler2D u_prev;
uniform vec2 u_texel;
uniform float u_c2;
uniform float u_damp;
void main() {
  float l = texture(u_cur, v_uv + vec2(-u_texel.x, 0.0)).x;
  float r = texture(u_cur, v_uv + vec2(+u_texel.x, 0.0)).x;
  float t = texture(u_cur, v_uv + vec2(0.0, -u_texel.y)).x;
  float b = texture(u_cur, v_uv + vec2(0.0, +u_texel.y)).x;
  float c = texture(u_cur, v_uv).x;
  float p = texture(u_prev, v_uv).x;
  float lap = l + r + t + b - 4.0 * c;
  float nxt = 2.0 * c - p + u_c2 * lap;
  nxt *= u_damp;
  vec2 clamped = clamp(v_uv, u_texel, 1.0 - u_texel);
  if (v_uv != clamped) nxt = 0.0;
  outColor = vec4(nxt, 0.0, 0.0, 1.0);
}`;

const NORMAL_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 v_uv;
out vec4 outColor;
uniform sampler2D u_u;
uniform vec2 u_texel;
uniform float u_strength;
void main() {
  float l = texture(u_u, v_uv + vec2(-u_texel.x, 0.0)).x;
  float r = texture(u_u, v_uv + vec2(+u_texel.x, 0.0)).x;
  float t = texture(u_u, v_uv + vec2(0.0, -u_texel.y)).x;
  float b = texture(u_u, v_uv + vec2(0.0, +u_texel.y)).x;
  float nx = (l - r) * u_strength;
  float ny = (t - b) * u_strength;
  outColor = vec4(nx, ny, 0.0, 1.0);
}`;

const COMPOSITE_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_normal;
uniform vec2 u_res;
uniform float u_time;

vec3 oceanColor(vec2 uv) {
  float depth = smoothstep(0.04, 0.96, uv.y);

  vec3 farColor  = vec3(0.040, 0.105, 0.190); // #0A1B30
  vec3 midColor  = vec3(0.140, 0.335, 0.540); // #1C4979  +25% 提亮
  vec3 nearColor = vec3(0.055, 0.175, 0.315); // #133962  +22% 提亮

  vec3 col = mix(farColor, midColor, smoothstep(0.0, 0.62, depth));
  col = mix(col, nearColor, smoothstep(0.52, 1.0, depth) * 0.72);

  float horizon = 1.0 - smoothstep(0.0, 0.34, uv.y);
  col += vec3(0.025, 0.055, 0.085) * horizon * 0.32;

  float skyLift = smoothstep(0.2, 1.0, uv.x) * horizon;
  col += vec3(0.018, 0.038, 0.065) * skyLift;

  return col;
}

float waterTexture(vec2 uv, float t) {
  vec2 flow = normalize(vec2(0.92, -0.38));

  flow.x += sin(uv.y * 5.0 + t * 0.15) * 0.08;
  flow.y += sin(uv.x * 4.0 - t * 0.12) * 0.05;
  flow = normalize(flow);

  vec2 p = uv - flow * t * 0.18;

  float a = sin(
    p.x * 18.0 +
    sin(p.y * 7.0 + t * 0.16) * 1.6
  );

  float b = sin(
    p.y * 13.0 +
    cos(p.x * 8.0 - t * 0.20) * 1.1
  );

  return a * b * 0.5 + 0.5;
}

vec2 gerstnerNormal(vec2 uv, float t) {
  vec2 flow = normalize(vec2(0.92, -0.38));

  flow.x += sin(uv.y * 5.0 + t * 0.15) * 0.08;
  flow.y += sin(uv.x * 4.0 - t * 0.12) * 0.05;
  flow = normalize(flow);

  float depth = smoothstep(0.05, 0.95, uv.y);

  vec2 farDir = normalize(vec2(0.96, 0.28));
  float farPhase = dot(farDir, uv - flow * t * 0.05);
  float farWave = cos(farPhase * 26.0);

  vec2 midDir = normalize(vec2(0.88, 0.48));
  float midPhase = dot(midDir, uv - flow * t * 0.13);
  float midWave = cos(midPhase * 15.0);

  vec2 nearDir = normalize(vec2(0.78, 0.63));
  float nearPhase = dot(nearDir, uv - flow * t * 0.24);
  float nearWave = cos(nearPhase * 7.0);

  vec2 detailDir = normalize(vec2(0.98, -0.18));
  float detailPhase = dot(detailDir, uv - flow * t * 0.38);
  float detailWave = cos(detailPhase * 34.0);

  vec2 n = vec2(0.0);
  n += farDir * farWave * 0.025;
  n += midDir * midWave * 0.085;
  n += nearDir * nearWave * mix(0.07, 0.19, depth);
  n += detailDir * detailWave * mix(0.008, 0.025, depth);

  n *= mix(0.55, 1.0, depth);

  return n;
}

void main() {
  vec2 nSim = texture(u_normal, v_uv).xy;
  vec2 nGer = gerstnerNormal(v_uv, u_time * 1.35);
  vec2 n = nSim * 0.82 + nGer * 0.34;

  float depth = smoothstep(0.05, 0.95, v_uv.y);
  float refractionStrength = mix(0.022, 0.055, depth);

  vec2 refUv = v_uv + n * refractionStrength;

  vec2 flow = normalize(vec2(0.92, -0.38));
  refUv += flow * 0.0035;
  refUv += vec2(
    sin(u_time * 0.32 + v_uv.y * 6.0) * 0.0015,
    0.0
  );

  vec3 col = oceanColor(refUv);

  float tex = waterTexture(refUv, u_time * 1.15);
  float texMask = mix(0.18, 1.0, depth);
  col += vec3(0.018, 0.035, 0.055) * pow(tex, 3.2) * texMask;

  float normalLen = dot(n, n);
  float nz = sqrt(max(0.0, 1.0 - min(normalLen, 0.92)));
  vec3 norm = normalize(vec3(-n.x, -n.y, nz));

  vec3 light = normalize(vec3(-0.55, -0.48, 0.68));
  vec3 view = vec3(0.0, 0.0, 1.0);
  vec3 halfVec = normalize(light + view);

  float spec = pow(max(dot(norm, halfVec), 0.0), 180.0);
  col += vec3(0.78, 0.90, 1.0) * spec * mix(0.35, 0.75, depth);

  vec3 softLight = normalize(vec3(0.55, -0.25, 0.80));
  vec3 softHalf = normalize(softLight + view);
  float softSpec = pow(max(dot(norm, softHalf), 0.0), 48.0);
  col += vec3(0.12, 0.25, 0.40) * softSpec * mix(0.03, 0.11, depth);

  float fresnel = pow(1.0 - max(dot(norm, view), 0.0), 4.0);
  col += vec3(0.08, 0.18, 0.30) * fresnel * mix(0.10, 0.28, depth);

  float caustic = waterTexture(v_uv * 0.85, u_time * 0.85);
  col += vec3(0.025, 0.055, 0.095) * pow(caustic, 4.0) * 0.13 * mix(0.35, 1.0, depth);

  col = mix(
    col * 0.82,
    col * 1.04,
    smoothstep(0.0, 1.0, depth)
  );

  float vig = smoothstep(1.15, 0.25, length(v_uv - 0.5));
  col *= mix(0.94, 1.0, vig);

  outColor = vec4(col, 1.0);
}
`;
function createProgram(gl: WebGL2RenderingContext, vsrc: string, fsrc: string) {
  const compile = (t: number, s: string) => {
    const sh = gl.createShader(t)!;
    gl.shaderSource(sh, s);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error("Shader compile: " + info);
    }
    return sh;
  };
  const vs = compile(gl.VERTEX_SHADER, vsrc);
  const fs = compile(gl.FRAGMENT_SHADER, fsrc);
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error("Program link: " + info);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return p;
}

type Fbo = {
  fbo: WebGLFramebuffer;
  tex: WebGLTexture;
  w: number;
  h: number;
};

function createFbo(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  internal: number = (gl as unknown as { R16F: number }).R16F ?? 0x822a,
  format: number = (gl as unknown as { RED: number }).RED ?? 0x1903,
  type: number = (gl as unknown as { HALF_FLOAT: number }).HALF_FLOAT ?? 0x140b
): Fbo {
  const internalGL = internal as GLenum;
  const formatGL = format as GLenum;
  const typeGL = type as GLenum;
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalGL, w, h, 0, formatGL, typeGL, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fbo, tex, w, h };
}

function deleteFbo(gl: WebGL2RenderingContext, f?: Fbo) {
  if (!f) return;
  gl.deleteFramebuffer(f.fbo);
  gl.deleteTexture(f.tex);
}

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
