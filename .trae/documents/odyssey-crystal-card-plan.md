# Odyssey Crystal Globe Card（方案 C）技术实现方案 — 水晶球里的动态海面

> 需求来源：用户在上一轮询问「水晶球般效果是怎么实现的」后，明确要求 `/plan 另起一个组件，实现方案 C`，即「终极版：在一个透明玻璃球里装着之前的起伏海面，球面四周带彩虹色散 + 顶光高光」。

---

## §1 Reuse Strategy：复用 75%，不重复造轮子

| 资源 | 是否复用 | 复用比例 | 复用的内容 |
|---|---|---|---|
| `odyssey-fluid-card.tsx` 的 WaveEq 管线 | ✅ | **100%** | splat/wave/normal 4 个 shader（SPLAT_FRAG/WAVE_FRAG/NORMAL_FRAG）+ 投石策略（dropLinePulse/ambient 四角投石/pointer 画线源）+ 每帧 stepWaveOnce×3 + buildNormal + Gerstner 波混合（不删掉） |
| `odyssey-fluid-card.tsx` 的 **原 COMPOSITE_FRAG** | ✅ 抽离复用 | **95%** | 原 composite shader 的所有输出（sky/lambert/spec3/fresnel/caustic/vignette）→ **不再直接画屏幕，改为先渲染到一张 2D equirect 全景 FBO**（记为 `FBO_EQUIRECT`）|
| 新 Crystal Globe 层 | ❌ 全新 | — | 新增一个 `CRYSTAL_FRAG` 做：球面裁剪 + Snell 定律 2 面折射 + RGB 色散 IOR(1.505/1.520/1.538) + equirect 全景采样 + Fresnel Schlick 混合 + 顶光+底光+环境光 3 道 specular + 球面 Vignette + 屏幕空间 Chromatic Aberration |
| 卡片外层 `<Link>` 包装 + 文案层 + fallback CSS + aria/sr-only | ✅ | **95%** | 完全和 odyssey-fluid-card 同构（文案一致、跳转一致、字体一致、尺寸一致 aspect-video sm:aspect-21/9），保证 Wiki 卡视觉统一 |

### 结论：

> **不需要新建第二个独立 WebGL2 程序，只要在原有 OdysseyFluidCard 的渲染链末端加一步 → 先画全景到 FBO_EQUIRECT → 再画水晶球到屏幕**。
>
> 为满足用户"另起一个组件"的要求，我们把最终 JSX 放在新建的文件 `components/home/odyssey-crystal-card.tsx` 里，并在原 odyssey-fluid-card 的基础上导出 **内部管线 helper（作为 shareable internal module）**，避免 ~400 行 WaveEq 管线完全复制。

---

## §2 要改的文件（共 3 个，新建 1 个）

| 文件 | 变更类型 | 作用 |
|---|---|---|
| **`components/home/odyssey-fluid-card.tsx`（已有）** | **改造（最小侵入）** | 1. 把原 COMPOSITE_FRAG 改名抽成 `SEA_EQUIRECT_FRAG`（shader 内容 95% 不变，只把原来的 `v_uv` 改为从 **传入 equirect 的经纬度坐标 `[0,1]×[0,1]` 生成**，不再用 screen-space v_uv；增加一个 sampler `u_equiNormal` 接收经过放大后的法线贴图）； 2. 抽取 4 个 shader 源码字符串 + `createProgram/createFbo/deleteFbo/scoreSubstring` 等纯函数为 **命名 export**（文件末尾追加 `export const OceanInternal = { ... }`）供二组件共享； 3. 原组件行为保持 100% 不变（不改外部 API，不影响已在 page.tsx 里用的旧卡，不引入破坏性变更） |
| **🆕 `components/home/odyssey-crystal-card.tsx`（新建，导出 `OdysseyCrystalCard`）** | **新建** | 新组件，API 和旧卡完全对齐 `{ className?: string }`；内部调用 `OceanInternal` 共享的 shader 模板字符串跑**完全相同的 WaveEq 管线**，最后一帧分两步：`Step A (off-screen):` 渲染全景海面到 FBO_EQUIRECT（RGBA8 256×512 2:1）；`Step B (screen):` 绑定 `CRYSTAL_FRAG` 采样 FBO_EQUIRECT 做水晶球全屏渲染到屏幕；文案、跳转、尺寸、aria、fallback 渐变、hover CSS 全部复用旧卡（保证 Wiki 卡片组视觉统一） |
| **`app/(main)/page.tsx`（已有）** | **1~2 行切换开关** | 新增 `import { OdysseyCrystalCard }`，在原来的 `<OdysseyFluidCard />` 位置换成 `<OdysseyCrystalCard />`（一键切换，或并列两个卡片做 A/B 预览）；**如果用户要 A/B 对比**，保留两张并列各占 50%；如果只要水晶球版，就替换。默认选择是「替换单张」（保持 UI 整洁） |

---

## §3 渲染管线拆解（6 步走，CRYSTAL_FRAG 为核心）

### Step 1~4 = 原流体卡管线（100% 复用旧参数）
| Step | 作用 | FBO 大小 |
|---|---|---|
| 1 Splat 投石 & 四角微震 | 同前 | SIM_W=384 SIM_H=144 |
| 2 WaveEq × 3 substep | 波速 c²=0.30, damp=0.9945 | ping-pong fA/fB |
| 3 Normal build | strength=46 | fN 384×144 RG16F |
| 4 Gerstner 波混合 | L150 `n = nSim*0.60 + nGer*1.00` | —— |

### Step 5 【新增离屏】 Equirect 全景海面渲染到 FBO_EQUIRECT
- **新 Shader：SEA_EQUIRECT_FRAG**（从原 COMPOSITE_FRAG 改名 95% 复用）
  - 输入：uniform `u_normalTex`（法线贴图，经过放大）、`u_time`
  - 不接收屏幕 v_uv；**直接在 shader 里用 `gl_FragCoord/vec2(W,H)` 生成 equirect 的 (s,t) ∈ [0,1]×[0,1]**，s=longitude（经度 0~2π），t=latitude（纬度 0~π）
  - 内部的 `gerstnerNormal(uv,t)` 传 `(s, 1-t)` 作为 uv，保证经纬展开的 Gerstner 波不会在极地/赤道产生拉伸
  - 输出 RGBA8: 最终海面颜色 RGB，alpha=1
- **FBO 尺寸**：512×256（宽高 2:1 严格 equirect 标准；和 384×144 物理模拟同量级，性能无压力）

### Step 6 【新增主屏幕】 Crystal Sphere 渲染
- **新 Shader：CRYSTAL_FRAG**（~110 行，按上一轮给你的标准玻璃球写法）
  - **输入 sampler2D u_sea** = Step5 输出的 FBO_EQUIRECT；`u_res`、`u_time`
  - 6 个子步骤（对应上一轮解释的 6 层）：
    1. 🟢 **球形裁剪 & 软 AA**：`p = (v_uv-0.5)*2; r2 = dot(p,p)`；`alphaMask = 1 - smoothstep(0.997,1.003,r2)`；r2>1.01 直接 discard（米白底在最外层乘）
    2. 🟢 **构建 3D 表面**：`nz = sqrt(1 - min(r2,0.9999))`；`N = vec3(p.x,p.y,nz)`；`V = vec3(0,0,1)`；`NV = dot(N,V)`；`eta = 1.0/1.52`（空气→冕玻璃）
    3. 🟢 **球面背面第二折射（物理真实的"穿过球"，不是只进入一次）**⭐
       ```glsl
       // 第一次折射：空气→玻璃（球前表面）
       vec3 T1 = refract(-V, N, eta);
       // 追迹 T1 到球后表面，求交点求 N2（内法线指向球外）
       // 球公式简化：||T1*t + (N*1 - 0)||² = 1 → 解 t
       float b = 2.0*dot(T1, N);
       float c = 2.0*(dot(N,N) - 1.0);  // =2*(1-1)=0
       float t2 = max(0.0, -b - sqrt(max(b*b-4.0*c,0.0)))/2.0;
       vec3 P2 = N + T1 * t2;           // 球后表面出射点
       vec3 N2 = -P2;                   // 球内法线指向内部，refract 用它
       // 第二次折射：玻璃→空气
       float eta2 = 1.52;               // 从玻璃回空气 n2/n1 = 1.52
       vec3 T_out = refract(T1, normalize(N2), eta2);
       if (length(T_out) < 0.01) T_out = reflect(T1, normalize(N2));  // 全反射兜底
       ```
    4. 🟢 **色散（3 次采样，RGB 通道分开 IOR）**⭐⭐
       ```glsl
       vec3 sampleEquiRect(vec3 dir) {  // 等矩形映射采样，和 panorama 看星空完全一致
         float lon = atan(dir.z, dir.x) + 3.14159;  // 0~2π
         float lat = acos(clamp(dir.y, -1.0, 1.0)); // 0~π
         vec2 uve = vec2(lon * 0.15915, lat * 0.3183);  // 0.159≈1/2π, 0.318≈1/π
         return texture(u_sea, uve).rgb;
       }
       vec3 col = vec3(
         sampleEquiRect(T_out_R).r,  // IOR=1.505 (red 折得少)
         sampleEquiRect(T_out_G).g,  // IOR=1.520 (green 中位)
         sampleEquiRect(T_out_B).b   // IOR=1.538 (blue 折得多)
       );
       ```
       （实际上 `T_out_R/G/B` 是用 `refract(-V, N, [1/1.505, 1/1.520, 1/1.538])` 各算一次 T1 再按上面公式追迹背面折射）
    5. 🟢 **反射 + Fresnel Schlick 混合（f0=0.05 玻璃）** + 3 道高光
       ```glsl
       float fres = 0.05 + 0.95 * pow(1.0 - NV, 5.0);   // Schlick
       vec3 R_refl = reflect(-V, N);
       vec3 reflCol = sampleEnviron(R_refl);  // 用一张柔和的"室内窗光渐变"（纯色合成，不引入新贴图）
       // 3 道 spec：主顶光（日光灯锐高光 pow160 ×2.4）+ 次 45° 柔光 + 底部冷反光（像桌面倒映玻璃球）
       float s1 = pow(max(dot(N,H1),0.0), 160.0) * 2.40;
       float s2 = pow(max(dot(N,H2),0.0), 24.0) * 0.42;
       float s3 = pow(max(dot(N,H3),0.0), 38.0) * 0.28;
       vec3 specc = vec3(0.96,0.98,1.0)*s1 + vec3(0.85,0.92,1.0)*s2 + vec3(0.52,0.66,0.92)*s3;
       reflCol += specc;
       // 最终 base
       vec3 baseCol = mix(col * 1.08, reflCol, fres);  // 折射略提亮，和参考图的通透感匹配
       ```
    6. 🟢 **球面 Vignette + 外层屏幕空间 CA（边缘色差）+ 背景合成**
       - Vignette：`baseCol *= mix(0.32, 1.0, pow(nz, 1.3))` — 球越四周（nz→0）越暗（真实透镜 + 玻璃边缘总光量下降）
       - CA（屏幕空间 Chromatic Aberration，和参考图的最外圈绿边红边完全对应）：对最终 baseCol 再做一次 `R/G/B sample offset = ±normalize(p) * (0.0018 * (1 - nz)^2.3)`，R 偏球内，B 偏球外，G 不动
       - 背景：`bg = vec3(0.945, 0.942, 0.938)`（参考图米白）× 外层卡片自身的深蓝 fallback gradient（用 alphaMask 混合：`outColor = mix(bg, baseCol, alphaMask)`；然后再用卡片 `<Link>` 背景 fallback 透明显示出底下的「深海蓝 fallback」——米白底只在水晶球**外 10px 宽圆角边缘**露一圈，保证视觉和 Wiki 卡片深蓝主题一致，而不是像参考图那样整块米白色背景太跳脱。

---

## §4 组件对外 API 设计 & 旧卡兼容性

### 新组件 API（与旧卡完全对齐，可直接互换）
```tsx
// components/home/odyssey-crystal-card.tsx
export function OdysseyCrystalCard({ className }: { className?: string }) {
  // 内部：use client, useRef, useEffect（和旧卡完全同构），使用 OceanInternal 共享 shader 管线
  // 渲染：4 步 Wave → Equirect 离屏 → Crystal 屏幕
  // JSX 外层：Link /the-odyssey，文案完全和旧卡一致（Wiki · Study Notes · The Odyssey · 共赴星辰大海 · 进入指南）
}
```

### 旧卡改造 API（100% 向后兼容，不破坏 page.tsx 已用代码）
```tsx
// components/home/odyssey-fluid-card.tsx — 仅新增 export，不改外部行为
export const OceanInternal = {
  VERT_SRC,
  SPLAT_FRAG,
  WAVE_FRAG,
  NORMAL_FRAG,
  SEA_EQUIRECT_FRAG,    // 新增命名，原 COMPOSITE_FRAG 改名抽离
  SEA_SCREEN_FRAG,      // 原 screen composite（旧卡仍然用它直接画屏幕）
  createProgram,
  createFbo,
  deleteFbo,
};
// 对外 default / named 导出的 OdysseyFluidCard = 原来的组件，一字不改
```

### page.tsx 接入方式（1 行可切换）
```tsx
// 方案 C 生效：替换单卡
<OdysseyCrystalCard />

// 如需 A/B 对比（调试期）：两张并列（屏幕够宽时并排，窄屏上下堆叠）
// <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-200 w-full mx-auto">
//   <OdysseyFluidCard />
//   <OdysseyCrystalCard />
// </div>
```
默认实现：**替换单卡**，保持首页 Wiki section 的 UI 简洁一致。

---

## §5 性能预估 & 风险控制（4 个风险点 + 应对）

| 风险 | 概率 | 影响 | 应对方案（已内置到方案中，无需额外操作） |
|---|---|---|---|
| **R1：FBO 切换开销**（多了一张 512×256 离屏，从 FBO 绑 screen 再绑回 FBO…）| 中 | M1 系列完全无感知；4 年以上老笔记本（如 2019 mbp 13" i5 核显）GPU 时间从 ~0.18ms 涨到 ~0.30ms，仍远低于 16.6ms 预算 | ✅ 对策 1：离屏尺寸定 512×256（不是 1024，不是 2048）；对策 2：SIM_W/SIM_H 仍保持 384×144 原模拟分辨率；对策 3：WaveEq 仍每帧 ×3 substep，不增不减 |
| **R2：色散 3 次背面折射追踪（T1→T_out_RGB ×3）会不会 CPU/WebGL 编译期爆栈或指令超时？** | 低 | shader 编译 error 或运行期 shader compile fail | ✅ 对策：背面折射是**解析解**，不是 while loop raymarch，所以指令条数恒定 ~35 条算术 + 6 次 texture sample；完全在 WebGL2 的 shader instruction count budget 内（shader 总共 ~110 行，和 shadcn 常见 shadertoy 组件差不多） |
| **R3：equirect 的极地/赤道接缝（longitude 0 = 2π 处连续不？）** | 中 | 水晶球正对 0/2π 子午线时出现垂直黑线或错位 1px | ✅ 对策 1：`FBO_EQUIRECT` 采样时 `gl.TEXTURE_WRAP_S = REPEAT`（已在 createFbo 默认参数里，S 方向重复，0 和 2π 天然连续）；对策 2：createFbo 的 `TEXTURE_MIN/MAG_FILTER` 默认 `LINEAR`，不做 MIPMAP，不引入 seam |
| **R4：指针划线投石时会不会折射到球里的海面"对不上手指位置"（球面扭曲坐标）** | 中 | 用户在屏幕上划，球里的投石位置和手指视觉不匹配 | ✅ 对策：投石坐标**仍用屏幕空间 (x, y)** 喂到 WaveEq 物理模拟里，模拟结果本来就是 2D 高度场，然后 Step 5 的 equirect 渲染和物理模拟只是**从不同 uv 采样同一法线贴图**——投石位置在球里对应位置肯定一致（你在球左边缘投一石，球里的海面就会在左边对应位置起涟漪，不会空间错位），唯一的不同只是结果被水晶球的折射扭曲了再显示。用户对投石位置的直觉是准确的 |
| **R5：prefers-reduced-motion / EXT_color_buffer_float 降级** | 低 | WebGL 不启动或 fallback 成蓝板 | ✅ 完全复用旧卡 4 级降级逻辑（early return + IntersectionObserver 暂停 + webglcontextlost 隐藏 canvas + CSS fallback 渐变），不需要额外写 |

---

## §6 执行步骤（Todo List，approved 后按此做）

按顺序执行，不跳步骤：

| # | 任务 | 文件 | 验证方式 |
|---|---|---|---|
| 1 | **抽离 OceanInternal 共享纯函数 + shader 字符串** | 改 `odyssey-fluid-card.tsx` 文件末尾追加命名 export `OceanInternal`；同时抽取 `SEA_SCREEN_FRAG = 原 COMPOSITE_FRAG`，让旧卡片继续用 `SEA_SCREEN_FRAG` 画屏幕，保证行为 100% 不变 | 旧卡 build 通过 + 首页旧卡视觉不发生任何变化（getSnapshotBefore 截图比对） |
| 2 | **抽出 `SEA_EQUIRECT_FRAG`（全景海面版 composite）** | 同文件，改原 shader 中 v_uv → 用 `gl_FragCoord / vec2(W,H)` 生成长宽坐标；Gerstner uv 用 `(s,1-t)`；其他（lambert/spec/fresnel/vignette/caustic）不变 | 离线 console 改 print 调试，或在 Step3 时直接把 FBO_EQUIRECT 临时画到屏幕右下角 1/4 做验证 |
| 3 | **新建 `odyssey-crystal-card.tsx`**：导入 OceanInternal + 跑 WaveEq 管线（和旧卡参数完全一致，投石策略 100% 复用 dropLinePulse/ambient/pointer） | 新文件 | 独立运行到「WaveEq 管线完全跑通」阶段：浏览器 GPU 面板能看到 fA/fB/fN 三 FBO ping-pong 正常刷新 |
| 4 | **Step5 离屏渲染到 FBO_EQUIRECT（512×256 RGBA8）** | 同文件 Step5：绑定 `SEA_EQUIRECT_FRAG` 绑定 fN 法线采样 → 输出 `FBO_EQUIRECT` | 临时把 `FBO_EQUIRECT` 用 blit 到屏幕左上角 256×128 验证：画面应该是一张 2:1 的全景展开海面，和原卡片直接画到屏幕的海面色调一致 |
| 5 | **Step6 屏幕水晶球 CRYSTAL_FRAG**：按 §3 的 6 子步骤写 glsl 代码（球形裁剪→两面折射→色散 RGB 三次采样→Schlick Fresnel+3 spec→Vignette+CA+背景合成） | 同文件 shader 字符串区加 `CRYSTAL_FRAG` | build 成功 + 肉眼看水晶球形状正确（圆形）、折射方向正确（中心不变、边缘像放大镜/缩小镜）、色散在左右边缘出现 |
| 6 | **补齐卡片 `<Link>` 外壳、文案层、fallback 渐变、CSS class**（复制旧卡 95% 的 JSX） | 同文件 JSX 区 | Tabbing 焦点环正确；整卡点击正确跳转 `/the-odyssey`；文案对齐旧卡 |
| 7 | **修改 `app/(main)/page.tsx` 替换 `OdysseyFluidCard → OdysseyCrystalCard`**（单卡版，或并列 A/B 供你选择） | 改 page.tsx import + 使用 | 首页渲染不报错（旧卡并列放的话不会互相干扰，因为两个组件独立的 GL context，独立的 canvas DOM，各自 ResizeObserver/IntersectionObserver 互不影响） |
| 8 | **Build + Diagnostics 验证**：npm run build exit 0；eslint 无 error；tailwind 无 unknown class warning | 无新增文件 | 最后一步校验通过才算 Done |

---

## §7 A/B 并列方案（风险前置 + 你可以立刻挑选）

考虑到「水晶球方案最终视觉是否真的比旧海面板更好」是主观判断，本方案**默认同时支持「切换单卡 + 并列双」两种接入方式**，不需要重写 page.tsx：

- **默认（推荐）**：替换单卡 — Wiki section 下就是一张水晶球卡片，UI 清爽
- **调试/选择期**：并列双卡片 — 屏幕够宽时（≥1280px）左右并排放两张流体卡，左边旧卡、右边水晶球新卡；窄屏自动上下堆叠；你直接肉眼对比，把满意的那一张留作最终效果

审批通过后，默认按「替换单卡」实现；如果实施完你想改成并列双卡，只要改 page.tsx 的 DOM 结构即可，不需要再改动两个组件内部的任何代码。

---

## §8 回滚策略（零成本）

任何时刻对水晶球效果不满意或觉得性能不够 → 只要把 `page.tsx` 的 `OdysseyCrystalCard` 换回 `OdysseyFluidCard` → 回滚完成（1 行代码），水晶球相关的 `odyssey-crystal-card.tsx` 文件可保留也可删除，完全不影响旧卡和其他 Odyssey 页面的运行。
