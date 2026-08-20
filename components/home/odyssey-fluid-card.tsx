"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";

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

vec3 sky(vec2 uv) {
  vec3 deep = vec3(0.027, 0.055, 0.102);  // #070e1a
  vec3 mid  = vec3(0.100, 0.255, 0.435);  // ≈ #1a466f
  vec3 hi   = vec3(0.285, 0.500, 0.770);  // ≈ #4980c4
  float grad = smoothstep(-0.15, 1.15, uv.y * 0.85 + uv.x * 0.25);
  vec3 base = mix(mid, deep, grad);
  float haze = smoothstep(0.0, 1.0, uv.x * 0.6 + (1.0 - uv.y) * 0.5);
  base = mix(base, hi, haze * 0.15);
  // caustic 用法线扰动 uv 计算，不再有固定方向的椭圆飘移
  float c1 = sin((uv.x * 14.0 + sin(u_time * 0.22 + uv.y * 9.0) * 1.3 + u_time * 0.55)) * 0.5 + 0.5;
  float c2 = sin((uv.y * 20.0 + cos(u_time * 0.28 + uv.x * 7.0) * 0.9 + u_time * 0.42)) * 0.5 + 0.5;
  float caustic = c1 * c2;
  base += vec3(0.05, 0.10, 0.20) * pow(caustic, 2.6) * 0.70;
  return base;
}

// 4 组叠加的 Gerstner-like 平面波，提供永不平息的"微起伏"法线
vec2 gerstnerNormal(vec2 uv, float t) {
  float n = 0.0;
  float nx = 0.0;
  float ny = 0.0;

  // 方向 1：右上 → 左下（225°），短波浪
  vec2 d1 = normalize(vec2( 0.82, -0.57));
  float w1 = dot(d1, uv) * 32.0 + t * 1.35;
  float a1 = 0.26;
  n  += sin(w1) * a1;
  nx += cos(w1) * d1.x * a1 * 32.0;
  ny += cos(w1) * d1.y * a1 * 32.0;

  // 方向 2：右下 → 左上（135°），中等波浪
  vec2 d2 = normalize(vec2(-0.70, -0.71));
  float w2 = dot(d2, uv) * 21.0 + t * 0.92;
  float a2 = 0.40;
  n  += sin(w2) * a2;
  nx += cos(w2) * d2.x * a2 * 21.0;
  ny += cos(w2) * d2.y * a2 * 21.0;

  // 方向 3：横波（水平 0°），长波浪主起伏
  vec2 d3 = normalize(vec2( 1.00,  0.05));
  float w3 = dot(d3, uv) * 11.0 + t * 0.50;
  float a3 = 0.68;
  n  += sin(w3) * a3;
  nx += cos(w3) * d3.x * a3 * 11.0;
  ny += cos(w3) * d3.y * a3 * 11.0;

  // 方向 4：竖波（垂直 90°），缓起伏主起伏
  vec2 d4 = normalize(vec2(-0.08,  1.00));
  float w4 = dot(d4, uv) * 8.0 + t * 0.36;
  float a4 = 0.85;
  n  += sin(w4) * a4;
  nx += cos(w4) * d4.x * a4 * 8.0;
  ny += cos(w4) * d4.y * a4 * 8.0;

  return -vec2(nx, ny) * 0.0018;  // 换算成法线 xy 差值（越小 z 越大）
}

void main() {
  // Wave Eq 模拟出来的法线（动态投石波列）
  vec2 nSim = texture(u_normal, v_uv).xy;
  // 4 组 Gerstner 波叠加的"永不停息微起伏"法线
  vec2 nGer = gerstnerNormal(v_uv, u_time);
  // 按 0.6:0.4 混合；投石波占主导，Gerstner 做基础呼吸
  vec2 n = nSim * 0.60 + nGer * 1.00;

  // 强折射：0.13（之前 0.06，×2.2）+ Gerstner 微起伏的额外二次扰动 uv
  vec2 refUv = v_uv + n * 0.13 + vec2(sin(u_time * 0.3 + v_uv.y * 4.0) * 0.004, 0.0);

  // 折射采样底色
  vec3 col = sky(refUv);

  // 光源：3 方向光（主光 + 次光 + fill 环境补光，fill 用水平方向更柔和）
  vec3 vlight1 = normalize(vec3(-0.62, -0.48, 0.72));
  vec3 vlight2 = normalize(vec3(+0.68, -0.28, 0.76));
  vec3 vlight3 = normalize(vec3( 0.08, +0.72, 0.64));
  vec3 view = vec3(0.0, 0.0, 1.0);

  // 构造 3D 法线（法线 z 方向用 n 长度算，起伏越大 z 越倾斜）
  float nz = sqrt(max(0.0, 1.0 - min(dot(n, n), 0.99)));
  vec3 norm = normalize(vec3(-n.x, -n.y, nz));

  vec3 half1 = normalize(vlight1 + view);
  vec3 half2 = normalize(vlight2 + view);
  vec3 half3 = normalize(vlight3 + view);

  // Blinn-Phong：主/次光 pow72/pow120（比之前 96/160 略宽一点，高光线更明显）
  float spec1 = pow(max(dot(norm, half1), 0.0), 72.0);
  float spec2 = pow(max(dot(norm, half2), 0.0), 120.0);
  float spec3 = pow(max(dot(norm, half3), 0.0), 36.0) * 0.35;   // fill 柔高光（非常宽）

  // Lambert 漫反射 3 光加权 → 给凹凸面"伪侧面着色"，产生明显的体积凹凸感
  float lam1 = max(dot(norm, vlight1), 0.0);
  float lam2 = max(dot(norm, vlight2), 0.0);
  float lam3 = max(dot(norm, vlight3), 0.0);
  vec3 lambertTint = vec3(0.13, 0.22, 0.36) * lam1 * 0.30
                   + vec3(0.10, 0.18, 0.30) * lam2 * 0.22
                   + vec3(0.08, 0.14, 0.22) * lam3 * 0.18;
  col += lambertTint;

  // Fresnel 边缘光
  float fres = pow(1.0 - max(dot(norm, view), 0.0), 3.0);

  // 3 路高光叠加：纯白主 + 淡蓝白次 + fill 浅蓝柔
  vec3 white = vec3(0.94, 0.97, 1.0);
  vec3 hiWhite = vec3(0.85, 0.93, 1.0);
  vec3 fillWhite = vec3(0.72, 0.84, 0.98);
  col += white * (spec1 * 1.10 + spec2 * 0.85);
  col += hiWhite * (spec1 * 1.45 + spec2 * 1.15);
  col += fillWhite * spec3;

  col += vec3(0.18, 0.32, 0.55) * fres * 0.32;

  // vignette 略微压暗四周
  float vig = smoothstep(1.25, 0.2, length(v_uv - 0.5));
  col *= mix(0.78, 1.0, vig);

  outColor = vec4(col, 1.0);
}`;

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

    const SIM_W = 384;
    const SIM_H = 144;
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
      gl.uniform1f(uniforms.wave.u_c2, 0.30);
      gl.uniform1f(uniforms.wave.u_damp, 0.9945);
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
      gl.uniform1f(uniforms.norm.u_strength, 46.0);
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
    let lastAmbient = 0;
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
        // 初始波列：8 条随机方向短线，间隔 110ms，力度 ×1.8
        if (initialDrops < 8 && elapsed > 160 + initialDrops * 110) {
          const cx = 0.20 + Math.random() * 0.60;
          const cy = 0.20 + Math.random() * 0.60;
          const dir = Math.random() * Math.PI * 2;
          const len = 0.06 + Math.random() * 0.08;
          const dx = Math.cos(dir) * len;
          const dy = Math.sin(dir) * len;
          dropLinePulse(
            cx - dx, cy - dy, cx + dx, cy + dy,
            6, 0.045 + Math.random() * 0.03, 0.90 + Math.random() * 0.85
          );
          initialDrops++;
        }

        // 自动投石：0.55~0.95s 投 2~3 条随机方向短线，波会互相叠加干涉
        if (ts - lastDrop > 550 + Math.random() * 400) {
          lastDrop = ts;
          const batches = 2 + (Math.random() < 0.55 ? 1 : 0);
          for (let b = 0; b < batches; b++) {
            const cx = 0.08 + Math.random() * 0.84;
            const cy = 0.12 + Math.random() * 0.76;
            const dir = Math.random() * Math.PI * 2;
            const len = 0.03 + Math.random() * 0.06;
            const dx = Math.cos(dir) * len;
            const dy = Math.sin(dir) * len;
            dropLinePulse(
              cx - dx, cy - dy, cx + dx, cy + dy,
              5, 0.018 + Math.random() * 0.02, 0.40 + Math.random() * 0.55
            );
          }
        }

        // 4 角环境微震动：每 130ms 轮流从 1 个角投一个 tiny 脉冲，保持永不平息的微涟漪
        if (ts - lastAmbient > 130) {
          lastAmbient = ts;
          const pick = Math.floor(Math.random() * 4.999);
          const corners = [
            [0.06, 0.94],   // 左上
            [0.94, 0.94],   // 右上
            [0.06, 0.06],   // 左下
            [0.94, 0.06],   // 右下
            [0.50, 0.50],   // 中心
          ];
          const c = corners[pick];
          const jitterX = (Math.random() - 0.5) * 0.05;
          const jitterY = (Math.random() - 0.5) * 0.05;
          dropPulse(c[0] + jitterX, c[1] + jitterY, 0.010, 0.13 + Math.random() * 0.12);
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
          dropLinePulse(ax, ay, bx, by, count, 0.022, 0.78);
        } else {
          dropPulse(x, y, 0.028, 0.70);
        }
      } else {
        dropPulse(x, y, 0.032, 0.82);
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
      href="/the-odyssey"
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
          <p className="font-sans font-medium text-sm sm:text-[15px] text-odyssey-200 group-hover:text-white transition-colors duration-200 flex items-center gap-1.5">
            《奥德赛》百科
            <ArrowRightIcon className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
          </p>
          <Waves className="h-7 w-7 sm:h-8 sm:w-8 text-odyssey-300" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
