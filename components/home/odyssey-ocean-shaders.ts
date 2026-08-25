// 共享的 WebGL 海洋渲染：shader 源与工具函数
// 由 odyssey-fluid-card 与 odyssey-ocean-text 共用

export const VERT_SRC = `#version 300 es
precision highp float;
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

export const SPLAT_FRAG = `#version 300 es
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

export const WAVE_FRAG = `#version 300 es
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

export const NORMAL_FRAG = `#version 300 es
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

export const COMPOSITE_FRAG = `#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 v_uv;

out vec4 outColor;

uniform sampler2D u_normal;
uniform vec2 u_res;
uniform float u_time;


// ============================================================
// Ocean base color
// ============================================================

vec3 oceanColor(vec2 uv) {

  float depth = smoothstep(
    0.04,
    0.96,
    1.0 - uv.y
  );

  vec3 farColor  = vec3(
    0.040,
    0.105,
    0.190
  );

  vec3 midColor  = vec3(
    0.140,
    0.335,
    0.540
  );

  vec3 nearColor = vec3(
    0.055,
    0.175,
    0.315
  );

  vec3 col = mix(
    farColor,
    midColor,
    smoothstep(
      0.0,
      0.62,
      depth
    )
  );

  col = mix(
    col,
    nearColor,
    smoothstep(
      0.52,
      1.0,
      depth
    ) * 0.72
  );

  float horizon =
    1.0 -
    smoothstep(
      0.0,
      0.34,
      uv.y
    );

  col += vec3(
    0.025,
    0.055,
    0.085
  ) * horizon * 0.32;

  float skyLift =
    smoothstep(
      0.2,
      1.0,
      uv.x
    ) * horizon;

  col += vec3(
    0.018,
    0.038,
    0.065
  ) * skyLift;

  return col;
}


// ============================================================
// Water texture
// ============================================================

float waterTexture(
  vec2 uv,
  float t
) {

  vec2 flow =
    normalize(
      vec2(
        0.92,
        -0.38
      )
    );

  flow.x +=
    sin(
      uv.y * 5.0 +
      t * 0.15
    ) * 0.08;

  flow.y +=
    sin(
      uv.x * 4.0 -
      t * 0.12
    ) * 0.05;

  flow =
    normalize(flow);

  vec2 p =
    uv -
    flow * t * 0.18;

  float a =
    sin(
      p.x * 18.0 +
      sin(
        p.y * 7.0 +
        t * 0.16
      ) * 1.6
    );

  float b =
    sin(
      p.y * 13.0 +
      cos(
        p.x * 8.0 -
        t * 0.20
      ) * 1.1
    );

  return a * b * 0.5 + 0.5;
}


// ============================================================
// Gerstner waves
// ============================================================

vec2 gerstnerNormal(
  vec2 uv,
  float t
) {

  vec2 flow =
    normalize(
      vec2(
        0.92,
        -0.38
      )
    );

  flow.x +=
    sin(
      uv.y * 5.0 +
      t * 0.15
    ) * 0.08;

  flow.y +=
    sin(
      uv.x * 4.0 -
      t * 0.12
    ) * 0.05;

  flow =
    normalize(flow);

  float depth =
    smoothstep(
      0.05,
      0.95,
      uv.y
    );


  // ----------------------------------------------------------
  // Far
  // ----------------------------------------------------------

  vec2 farDir = normalize(vec2(0.96, 0.28));
  float farPhase = dot(farDir, uv - flow * t * 0.05);
  float farWave = cos(farPhase * 14.0);

  vec2 midDir = normalize(vec2(0.88, 0.48));
  float midPhase = dot(midDir, uv - flow * t * 0.13);
  float midWave = cos(midPhase * 8.0);

  vec2 nearDir = normalize(vec2(0.78, 0.63));
  float nearPhase = dot(nearDir, uv - flow * t * 0.24);
  float nearWave = cos(nearPhase * 4.5);

  vec2 detailDir = normalize(vec2(0.98, -0.18));
  float detailPhase = dot(detailDir, uv - flow * t * 0.38);
  float detailWave = cos(detailPhase * 18.0);

  vec2 n =
    vec2(0.0);

  n +=
    farDir *
    farWave *
    0.025;

  n +=
    midDir *
    midWave *
    0.085;

  n +=
    nearDir *
    nearWave *
    mix(
      0.07,
      0.19,
      depth
    );

  n +=
    detailDir *
    detailWave *
    mix(
      0.008,
      0.025,
      depth
    );

  n *=
    mix(
      0.55,
      1.0,
      depth
    );

  return n;
}


// ============================================================
// Lightning envelope
//
// Produces:
// - long random-ish interval
// - short first flash
// - secondary flash
// - third tiny flash
//
// No JS changes required.
// ============================================================

float hash11(float p) {
  p = fract(
    p * 0.1031
  );

  p *=
    p + 33.33;

  p *=
    p + p;

  return fract(p);
}


float lightningEnvelope(
  float time
) {

  // One lightning "slot"
  float cycleLength =
    11.0;

  float cycle =
    floor(
      time /
      cycleLength
    );

  float localTime =
    mod(
      time,
      cycleLength
    );

  // Deterministic pseudo-random values per cycle
  float seed =
    hash11(cycle + 17.0);

  float secondSeed =
    hash11(cycle + 91.0);


  // Random event time:
  // roughly 5~10 seconds into the cycle
  float eventTime =
    4.5 +
    seed * 5.0;


  // Distance from lightning moment
  float d =
    localTime -
    eventTime;


  // Main flash
  float flash1 =
    exp(
      -pow(
        d * 22.0,
        2.0
      )
    );


  // Secondary flash
  float secondDelay =
    0.08 +
    secondSeed * 0.11;

  float flash2 =
    exp(
      -pow(
        (d - secondDelay) * 38.0,
        2.0
      )
    ) * 0.72;


  // Tiny tertiary flicker
  float thirdDelay =
    secondDelay +
    0.12 +
    hash11(
      cycle + 53.0
    ) * 0.12;

  float flash3 =
    exp(
      -pow(
        (d - thirdDelay) * 52.0,
        2.0
      )
    ) * 0.30;


  return
    flash1 +
    flash2 +
    flash3;
}


// ============================================================
// Lightning bolt
//
// The bolt is deliberately subtle.
// It should be perceived as illumination rather than
// a giant white cartoon line.
// ============================================================

float lightningBolt(
  vec2 uv,
  float t
) {
  float cycleLength = 11.0;

  float cycle = floor(t / cycleLength);

  float localTime = mod(t, cycleLength);

  float seed = hash11(cycle + 17.0);

  float eventTime = 4.5 + seed * 5.0;

  float d = localTime - eventTime;

  float visibility =
    exp(-pow(d * 34.0, 2.0));

  // 闪电主要出现在上半部分
  float verticalMask =
    smoothstep(0.05, 0.18, uv.y) *
    (1.0 - smoothstep(0.72, 0.92, uv.y));

  // 每次闪电使用不同的起始位置 / 方向
  float seedX = hash11(cycle + 31.0);
  float seedAngle = hash11(cycle + 71.0);

  float startX = 0.45 + seedX * 0.25;
  float startY = 0.78;

  // 整体轻微倾斜
  float tilt =
    (seedAngle - 0.5) * 0.32;

  // 把 Y 映射到一个“闪电进度”
  float p = clamp(
    (startY - uv.y) / 0.70,
    0.0,
    1.0
  );

  // 主方向
  float baseX =
    startX
    + p * tilt;

  // 分叉/折线扰动
  float zig =
    sin(p * 11.0 + seed * 8.0) * 0.055
    +
    sin(p * 24.0 + seed * 15.0) * 0.018;

  // 模拟闪电折线
  float boltX =
    baseX + zig;

  float distanceToBolt =
    abs(uv.x - boltX);

  float bolt =
    exp(
      -distanceToBolt * 360.0
    );

  return
    bolt *
    verticalMask *
    visibility;
}

// ============================================================
// Main
// ============================================================

void main() {

  // ----------------------------------------------------------
  // Water normal
  // ----------------------------------------------------------

  vec2 nSim =
    texture(
      u_normal,
      v_uv
    ).xy;

  vec2 nGer =
    gerstnerNormal(
      v_uv,
      u_time * 1.35
    );

  vec2 n =
    nSim * 0.82 +
    nGer * 0.34;


  // ----------------------------------------------------------
  // Depth
  // ----------------------------------------------------------

  float depth =
    smoothstep(
      0.05,
      0.95,
      1.0 - v_uv.y
    );


  // ----------------------------------------------------------
  // Refraction
  // ----------------------------------------------------------

  float refractionStrength =
    mix(
      0.022,
      0.055,
      depth
    );

  vec2 refUv =
    v_uv +
    n *
    refractionStrength;


  vec2 flow =
    normalize(
      vec2(
        0.92,
        -0.38
      )
    );

  refUv +=
    flow *
    0.0035;

  refUv +=
    vec2(
      sin(
        u_time * 0.32 +
        v_uv.y * 6.0
      ) * 0.0015,
      0.0
    );


  // ----------------------------------------------------------
  // Base color
  // ----------------------------------------------------------

  vec3 col =
    oceanColor(
      refUv
    );


  // ----------------------------------------------------------
  // Water texture
  // ----------------------------------------------------------

  float tex =
    waterTexture(
      refUv,
      u_time * 1.15
    );

  float texMask =
    mix(
      0.18,
      1.0,
      depth
    );

  col +=
    vec3(
      0.018,
      0.035,
      0.055
    )
    *
    pow(
      tex,
      3.2
    )
    *
    texMask;


  // ----------------------------------------------------------
  // Surface normal
  // ----------------------------------------------------------

  float normalLen =
    dot(
      n,
      n
    );

  float nz =
    sqrt(
      max(
        0.0,
        1.0 -
        min(
          normalLen,
          0.92
        )
      )
    );

  vec3 norm =
    normalize(
      vec3(
        -n.x,
        -n.y,
        nz
      )
    );


  vec3 view =
    vec3(
      0.0,
      0.0,
      1.0
    );


  // ==========================================================
  // LIGHTNING
  // ==========================================================

  float flash =
    lightningEnvelope(
      u_time
    );

  float bolt =
    lightningBolt(
      v_uv,
      u_time
    );


  // ----------------------------------------------------------
  // Lightning sky illumination
  //
  // Stronger near top / horizon.
  // ----------------------------------------------------------

  float skyFlashMask =
    smoothstep(
      0.05,
      0.85,
      v_uv.y
    );

  float horizonFlashMask =
    1.0 -
    smoothstep(
      0.45,
      1.0,
      v_uv.y
    );

  float skyFlash =
    mix(
      0.45,
      1.0,
      skyFlashMask
    );

  skyFlash +=
    horizonFlashMask *
    0.35;


  col +=
    vec3(
      0.28,
      0.42,
      0.62
    )
    *
    flash
    *
    skyFlash
    *
    0.55;


  // ----------------------------------------------------------
  // Actual lightning bolt
  // ----------------------------------------------------------

  col +=
    vec3(
      0.75,
      0.90,
      1.0
    )
    *
    bolt
    *
    1.6;


  // ----------------------------------------------------------
  // Main sunlight
  // ----------------------------------------------------------

  vec3 light =
    normalize(
      vec3(
        -0.55,
        -0.48,
        0.68
      )
    );

  vec3 halfVec =
    normalize(
      light +
      view
    );

  float spec =
    pow(
      max(
        dot(
          norm,
          halfVec
        ),
        0.0
      ),
      180.0
    );

  col +=
    vec3(
      0.78,
      0.90,
      1.0
    )
    *
    spec
    *
    mix(
      0.35,
      0.75,
      depth
    );


  // ----------------------------------------------------------
  // Lightning-enhanced water reflection
  // ----------------------------------------------------------

  float lightningSpec =
    pow(
      max(
        dot(
          norm,
          normalize(
            vec3(
              -0.20,
              -0.35,
              0.92
            )
          )
        ),
        0.0
      ),
      110.0
    );

  col +=
    vec3(
      0.70,
      0.86,
      1.0
    )
    *
    lightningSpec
    *
    flash
    *
    0.85
    *
    mix(
      0.25,
      1.0,
      depth
    );


  // ----------------------------------------------------------
  // Soft reflection
  // ----------------------------------------------------------

  vec3 softLight =
    normalize(
      vec3(
        0.55,
        -0.25,
        0.80
      )
    );

  vec3 softHalf =
    normalize(
      softLight +
      view
    );

  float softSpec =
    pow(
      max(
        dot(
          norm,
          softHalf
        ),
        0.0
      ),
      48.0
    );

  col +=
    vec3(
      0.12,
      0.25,
      0.40
    )
    *
    softSpec
    *
    mix(
      0.03,
      0.11,
      depth
    );


  // ----------------------------------------------------------
  // Fresnel
  // ----------------------------------------------------------

  float fresnel =
    pow(
      1.0 -
      max(
        dot(
          norm,
          view
        ),
        0.0
      ),
      4.0
    );

  col +=
    vec3(
      0.08,
      0.18,
      0.30
    )
    *
    fresnel
    *
    mix(
      0.10,
      0.28,
      depth
    );


  // ----------------------------------------------------------
  // Lightning Fresnel response
  // ----------------------------------------------------------

  col +=
    vec3(
      0.16,
      0.32,
      0.52
    )
    *
    fresnel
    *
    flash
    *
    0.55;


  // ----------------------------------------------------------
  // Caustic
  // ----------------------------------------------------------

  float caustic =
    waterTexture(
      v_uv * 0.85,
      u_time * 0.85
    );

  col +=
    vec3(
      0.025,
      0.055,
      0.095
    )
    *
    pow(
      caustic,
      4.0
    )
    *
    0.13
    *
    mix(
      0.35,
      1.0,
      depth
    );


  // ----------------------------------------------------------
  // Flash exposure
  //
  // A very short global lift makes the lightning feel powerful.
  // ----------------------------------------------------------

  col *=
    1.0 +
    flash * 0.18;


  // ----------------------------------------------------------
  // Overall depth / exposure
  // ----------------------------------------------------------

  col = mix(
    col * 0.82,
    col * 1.04,
    smoothstep(
      0.0,
      1.0,
      depth
    )
  );


  // ----------------------------------------------------------
  // Vignette
  // ----------------------------------------------------------

  float vig =
    smoothstep(
      1.15,
      0.25,
      length(
        v_uv - 0.5
      )
    );

  col *=
    mix(
      0.94,
      1.0,
      vig
    );


  outColor =
    vec4(
      col,
      1.0
    );
}
`;

export function createProgram(gl: WebGL2RenderingContext, vsrc: string, fsrc: string) {
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

export type Fbo = {
  fbo: WebGLFramebuffer;
  tex: WebGLTexture;
  w: number;
  h: number;
};

export function createFbo(
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

export function deleteFbo(gl: WebGL2RenderingContext, f?: Fbo) {
  if (!f) return;
  gl.deleteFramebuffer(f.fbo);
  gl.deleteTexture(f.tex);
}
