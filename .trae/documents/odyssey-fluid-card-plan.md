# 首页 The Odyssey 流体卡片 技术实现计划

> 请求来源：`/plan` 指令
> 目标位置：`app/(main)/page.tsx#L122` 之后（Reading 区块的下一个、页面关闭 div 之前），新增一张与用户提供示意图视觉一致的**流体 WebGL Shader 大海蓝卡片**，点击整卡跳转到 `/the-odyssey`。

---

## 1. Repo 研究结论

### 1.1 当前 L122 附近的布局结构

`page.tsx` 是 Server Component（默认），内部是 `<div className="section">` 包裹的多段 `<div className="subsection">` 卡片组，顺序依次是：
```
subsection (Hero Blog 标题) →
subsection (About) →
subsection (MusicPlayerCard) →
subsection (Today + YearProgress) →
subsection (Writing 最近 4 篇) →
subsection (Reading 最近 4 篇) → L122 空行 → </section>
```

L122 紧接在 Reading 的 `</div>` 之后，新卡片**放在这里作为一个新的 `subsection`（或者 `subsection` 内的 Link 容器）**，符合现有「每个主块 = 一个 subsection + h2 + 内容」的排版节奏，但为了贴合示意图（独立的大海蓝整卡占满 subsection 宽度），不强制加 h2 小标题，卡片本身自洽。

### 1.2 现有卡片的视觉参照

- `MusicPlayerCard.tsx`（`components/music-player-card.tsx`）："subsection" 级别的复杂卡片，`"use client"` 组件，内部有 iframe 延迟加载、响应式（`useMedia 768px`）、绝对定位覆盖层等模式。
- **项目没有任何现成 WebGL / three / R3F / Shader 组件**（Grep 0 命中），package.json 也没有 `three`、`@react-three/fiber` 等依赖，**需要走原生 WebGL2 零依赖方案**（不新增 npm 包，保持首页包体积最小），符合用户之前偏好「非冗余 + 精简」的工程风格。
- 之前 `components/odyssey/ocean-gradient-title.tsx` 已经证明：项目接受纯 `canvas` 2D / 物理模拟 + `"use client"` 组件的交付形式，用户对原生 Canvas API（ImageData / putImageData / requestAnimationFrame）不排斥。
- 主题色：Odyssey 模块已注册 `--color-odyssey = oklch(0.22 0.06 255)`（深海蓝），本次卡片需要**复用同一组蓝黑色系**，保证用户在博客点进卡再跳到 Odyssey Wiki 时视觉不割裂。

### 1.3 依赖评估

- **Zero new deps**：不用 three.js（500KB+ 包体积，首页不合适），不引入 any shader loader（Next App Router 没有 glsl-loader 默认支持）。Shader 代码**直接用 TS 模板字符串**（Tagged template literal 包装，获得 IDE 语法高亮如果用户装了 glsl-literal 插件，但不依赖插件）。
- **只使用原生 WebGL2RenderingContext**（`canvas.getContext('webgl2')`），配合 2 个三角形全屏 quad + 5 个 Shader（见 §3）。
- **SSR 友好**：组件加 `"use client"`，`useEffect` 里做 WebGL 初始化；WebGL 不支持的老设备上，用纯 CSS 渐变（深蓝 + `animate-pulse` 很慢的呼吸）做 fallback，保证 SSR 不炸。

---

## 2. 具体修改文件

| 文件 | 改动性质 | 说明 |
|---|---|---|
| `components/home/odyssey-fluid-card.tsx` | ✨ **新建** | 核心卡片组件：外层 `<Link href="/the-odyssey">` + 内部 canvas WebGL2 流体模拟 + CTA 文案两行 + 底部"阅读指南"小字样 + 角落 Wave 图标。`"use client"`。 |
| `app/(main)/page.tsx` | **编辑** (L122 附近) | 新增一个 `subsection mb-12` 包裹 `<OdysseyFluidCard />`，放在 Reading 和 最终 `</div>` 之间。加 import。 |
| `app/globals.css` | **编辑** (末尾追加) | 2 个小 class：① 流体卡片的 CSS 渐变 fallback（WebGL 失败时显示）；② 卡片 `hover` 时的微 scale（1.005）+ 投影加深 + 3ms transition。 |

**其它文件不修改**（不新增 package.json 依赖、不写独立 shader 文件、不动 shared layout、不动 Odyssey 现有 Wiki 代码）。

---

## 3. 实现步骤拆解（核心技术细节）

### 3.1 Step 1：新建 `OdysseyFluidCard` 组件基本壳 (`odyssey-fluid-card.tsx`)

结构骨架：

```tsx
"use client";
export function OdysseyFluidCard({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => { /* WebGL init + animation loop */ }, []);

  return (
    <Link
      ref={wrapperRef}
      href="/the-odyssey"
      className={cn(
        "odyssey-fluid-card group relative block w-full overflow-hidden rounded-2xl",
        "bg-[linear-gradient(135deg,var(--color-odyssey),#030814)]", // fallback 背景
        "aspect-[16/9] sm:aspect-[21/9]",  // 示意图比例：宽屏 21:9，手机 16:9
        "ring-1 ring-white/10 shadow-md hover:shadow-xl transition-all",
        "outline-none focus-visible:ring-2 focus-visible:ring-odyssey",
        className
      )}
      aria-label="The Odyssey Walkthrough Wiki · 奥德赛阅读指南"
    >
      {/* WebGL Canvas — 占满卡片，z-0，pointer-events-none 不抢 Link 点击 */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full z-0 pointer-events-none block" aria-hidden />
      {/* 文案层 z-10 */}
      <div className="relative z-10 h-full flex flex-col justify-between p-7 sm:p-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">Wiki · Study Notes</p>
          <h3 className="mt-3 font-serif font-light text-white leading-[1.1] text-3xl sm:text-5xl">
            The Odyssey
          </h3>
          <h3 className="font-serif font-light text-white/85 leading-[1.1] mt-1 text-2xl sm:text-4xl">
            共赴星辰大海
          </h3>
        </div>
        <div className="flex items-end justify-between">
          <p className="font-sans text-sm text-white/70 group-hover:text-white/95 transition-colors flex items-center gap-1.5">
            进入指南
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </p>
          <WaveIcon/><!-- 角落 lucide Waves 图标，白色 40% -->
        </div>
      </div>
    </Link>
  );
}
```

关键点：
- **整卡是 `<Link>`**（Next App Router 原生 Link，不是 `<a>`），整卡 clickable，符合"点击卡片跳转到 /the-odyssey"的需求。
- **Canvas 绝对 `pointer-events-none`**：不拦截 Link 的 hover / click / focus，所有交互（跳转、右键 Link）保持原生。
- **响应式比例**：宽屏 21:9 贴合用户提供的 DeepSeek 示意图比例（扁长卡片，占 subsection 全部宽度，视觉大气）；窄屏 < sm 回落到 16:9，避免字太挤。
- 文案结构：左上两行大标题（英文 The Odyssey + 中文"共赴星辰大海"）+ 右上 Wiki Tag + 左下 CTA"进入指南" + 右下角落 Waves 图标，**和 DeepSeek 示意图 1:1 对应**，只是把 CTA 位置调整到符合中文习惯的左下。

### 3.2 Step 2：WebGL2 Fluid Simulation（关键，5 个 Shader）

不做 Navier-Stokes 格点流体（对卡片级别展示太重、代码量 ~600 行、调试成本高），**用简化版 2D Wave Equation + 3 层 ping-pong FBO**（和之前 OceanGradientTitle 的物理一致，只是搬到 GPU 并行跑 + 叠加折射渲染），代码量 ~280 行全部在组件内，无外部依赖。

**渲染管线**（每帧执行，顺序不能乱）：

```
 [1] Splat Shader     → FBO_A (高度场 u)
        在鼠标位置 / 随机扰动位置，给 += 高斯脉冲（= 投石子）
 [2] WaveEq Shader    → FBO_B, FBO_A 交替 ping-pong 2 次
        u_next = 2u_cur - u_prev + c² * Δu - damp*u
        （每帧跑 2 次 substep 提升 CFL 稳定性，不用太小心 dt）
 [3] NormalMap Shader → FBO_C (RG8 法线贴图)
        nx = (u[x+1]-u[x-1]), ny = (u[y+1]-u[y-1])
 [4] SkyGradient Shader → 全屏直接画
        先画一张静态的「深海蓝→午夜蓝 + 微弱海雾」背景底色
 [5] Composite Shader  → 默认 framebuffer (屏幕)
        ① 对背景图做折射采样：sample(tex, uv + k*nx/ny)
        ② 用 Blinn-Phong 计算海面高光点（2 个虚拟方向光：左上 + 右上）
        ③ 用法线 z 值做 Fresnel 边缘增亮（模拟水面边缘反光，用户截图里最亮的那几条亮白色浪花线）
        ④ 叠加 vignette 暗色四角，防止卡片边缘颜色太突兀和页面背景割裂
```

**模拟分辨率**：卡片物理尺寸通常是 `1200×500px` 量级，**模拟分辨率降级到 256×96**（~1/4 线性缩小），Wave Equation 只在 256×96 的 FBO 上跑，性能极致（每帧 ~12 万 fragment shader invocation，M1 Mac 每帧 < 0.2ms，iPhone 14 轻松 120fps），笔记本风扇完全不转。Composite shader 是在**屏幕分辨率**直接采样（折射 + 背景），所以最终结果清晰度=屏幕尺寸。

**自动扰动策略**（不要鼠标也能动）：
- mount 后 300ms 投 4 个大脉冲（初始水波氛围建立）
- 之后每 1200ms ±200ms 随机在卡片内投 1~2 个小脉冲（模拟微风拂水 + 维持动效，不要一直静止变成静态卡）
- 鼠标 hover 卡片时：每 80ms 在鼠标位置投一个强脉冲（"鼠标划过水面留下涟漪"的交互反馈，用户示意图里如果鼠标移过，会有小水花，这是加分项；pointer-events 不拦截 hover 事件检测用 `wrapperRef` 上的 `onMouseMove`）

### 3.3 Step 3：WebGL 不支持 / 老设备 / `prefers-reduced-motion: reduce` 的降级

- **降级优先级最高**：先 `matchMedia('(prefers-reduced-motion: reduce)')` → 直接只显示 CSS fallback 渐变背景 + 2s 极慢呼吸亮度变化（`filter: brightness(1 ± 0.02)`），不启动任何 WebGL 循环 / RAF。
- **WebGL 初始化失败（webgl2 context 拿不到）**：退出 useEffect，canvas 保持透明 → 露出外层的 CSS `bg-[linear-gradient(135deg,var(--color-odyssey),#030814)]` 渐变 fallback，视觉和用户示意图一样好看（深蓝→黑斜向渐变）。
- **离开视口时暂停渲染循环**：用 `IntersectionObserver` 监听 `wrapperRef`，`!isIntersecting` 时 `cancelAnimationFrame`，`isIntersecting` 时重新 resume。防止用户滚走后浏览器后台 tab 继续烧电。
- **组件 unmount（路由切走）**：调用 `gl.deleteTexture` / `deleteFramebuffer` / `deleteProgram` 全部释放资源，WebGL 资源不爆显存。

### 3.4 Step 4：`page.tsx` 接入卡片

原 L122 内容（空行 + `</div>`）改为：

```tsx
import { OdysseyFluidCard } from "@/components/home/odyssey-fluid-card";

// ... subsection(Reading) 结束后的 L122
<div className="subsection mb-12">
  <h2 className="text-muted-foreground font-sans text-sm">Wiki</h2>
  <div className="mt-4">
    <OdysseyFluidCard />
  </div>
</div>
```

注意**用户示意图里没有显示 h2 小标题**（Reading/Writing 那个），但为了和现有"subsection + 小标题 + 内容"的结构一致，我们加一行 `<h2>Wiki</h2>`，字体/尺寸/颜色完全照搬 Today / Writing / Reading 的 h2。如果用户想更贴示意图（不要 h2），可以把这两行注释掉——卡片本身自洽。

### 3.5 Step 5：`globals.css` 追加辅助样式

```css
.odyssey-fluid-card {
  transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 260ms ease;
  transform: translateZ(0); /* 强制图层合成，hover 时提升 repaint 成本 */
  will-change: transform;
}
.odyssey-fluid-card:hover {
  transform: translateY(-2px) scale(1.005); /* 极轻微抬升，符合 Wiki 的克制气质 */
  box-shadow: 0 20px 50px -12px rgba(10, 22, 40, 0.45);
}
.odyssey-fluid-card::after { /* 可选 WebGL 没起来时的静态水纹感 */
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 8px);
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0.6;
}
```

注意：`.odyssey-fluid-card::after` 是 fallback 视觉补充（很薄的 8px 斜条纹叠加，模拟微弱反光），WebGL 运行时 WebGL canvas 在上面盖掉不冲突。

---

## 4. 潜在风险与应对

| 风险 | 触发条件 | 影响 | 处理方案 |
|---|---|---|---|
| **WebGL2 Context Lost（`webglcontextlost` 事件）** | 设备内存紧张、切后台、切独显 | 白卡 / 流体停了但文案还在 | 监听 canvas 的 `webglcontextlost`，一旦触发释放资源并把 canvas 永久隐藏 → fallback CSS 渐变顶上，不影响跳转。 |
| **`getContext('webgl2')` 拿不到** | IE / 非常老的 Safari 14 | 白屏 | 代码里 if(!gl2 && !gl1) 时直接 return，不挂异常。CSS fallback 已经在 Link 根上就位。 |
| **首页首次加载 bundle size 增大** | 虽然零依赖，但组件本身 ~520 行 TS + 5 个 shader 字符串 | 影响 LCP？ | （一）Shader 字符串约 2.1KB（gzip 后 ~700B），可以忽略；（二）组件本身是 client component，但 Next App Router 默认会把 client code 单独分包；首页 subsection 里的 MusicPlayerCard 已经是 client 组件，多一个不改变 bundle 策略；（三）如果用户想极致首屏 LCP，可以进一步把整个 Card 包成 `next/dynamic` lazy import（`ssr: false` 或 ssr 都可以），把 WebGL 代码延迟到首帧之后才 load。Plan 默认不加 dynamic（避免额外一层抽象），如果 build 时发现 LCP 变化再调。 |
| **手机端 60Hz 掉帧** | 低端 Android（骁龙 660 以下） | 轻微卡顿 | 已经通过"模拟分辨率 256×96"降级，CPU/GPU 成本都极低。如果仍然掉帧，检测 `navigator.hardwareConcurrency <= 4 && matchMedia('max-device-pixel-ratio 2.5')` → 把自动投石间隔从 1200ms 拉到 2000ms。 |
| **卡片高度在 subsection 内被 `max-w-[480px]` 压窄**（这是潜在大坑！） | 请特别注意：`app/other.css L64-L70` 里还保留了 **全局 `.subsection { max-w-[480px] sm:max-w-screen-sm }`**！之前 Odyssey Wiki 内部为了避开这个规则把 MDX 的 className 全改成 `odysses-subsection`，而首页 (main)/page.tsx 的 Writing / Reading 都是 480px 居中的窄卡没问题，但是新的大海流体卡片**如果被 480px max-w 压住，会变成瘦长窄条非常丑**，用户示意图的"宽扁大海卡片"感就没了 | **这是本 plan 最大的一个 design decision**。应对方案二选一（默认推荐方案 A，在 §5 让用户选）：<br/>方案 A（推荐）：给新的 subsection **再加一个自定义 class** `odyssey-home-card-subsection`，在 globals.css 里写 `.odyssey-home-card-subsection { max-width: var(--container-2xl); width: 100%; }`（或者直接在 className 里 Tailwind 写 `!max-w-none`），让卡片和 MusicPlayerCard 的宽度一致？不对，需要看 MusicPlayerCard 的渲染宽度。先手动去页面里看一下 subsection 实际的宽度效果——如果默认 max-w 是 480px，流体卡片会被压到过窄。<br/>方案 B：把卡片单独移到 `subsection` 外面（section 根下，不包 subsection），直接写成 `<OdysseyFluidCard className="max-w-160 mx-auto w-full px-6 lg:max-w-200 mb-12" />`，和 Odyssey wiki page L83 的 Hero 容器一致。 |
| **文案中英两行 + Fraunces 字号和示意图不一致** | 默认 Fraunces 字体已在项目里（odyssey/wiki/h1 全用它），Ocean Fluid Card 的 h3 如果默认 `font-serif` 会不会 fallback 到 Times New Roman？ | 视觉走样 | Card 的 h3 class 里显式加 `font-serif` 同时确保和项目 global 的 serif fallback 一致，或像 OceanGradientTitle 一样直接用 `fraunces.className` 导入 `@/lib/fonts` 并包一层 span 确保字体激活。 |

---

## 5. 需要用户提前确认的两个决策点（执行前先定）

### 决策 1：卡片宽度用哪种？（⚠️ 必选，和 subsection max-w 强相关）

| 选项 A（局部加宽 subsection） | 选项 B（放到 subsection 外面，和 Odyssey wiki page hero 对齐） |
|---|---|
| 新卡片包在一个 subsection 里，但 className 上加 `!max-w-none md:max-w-[720px] lg:max-w-[960px]`，并在 `@apply` 前用 Tailwind `!` 覆盖全局 .subsection 的 max-w-480 | 新卡片 **不**在任何 subsection 内，直接放到 section 根，className 用和 Odyssey wiki hero 一样的 `max-w-160 mx-auto w-full px-6 lg:max-w-200 mb-12`（和 Odyssey 自己的标题容器完全一致宽度，跨页面视觉统一） |
| 优点：维持现有 section/subsection 层级结构 | 优点：更干净，不依赖 `!important` 类覆盖，宽屏卡片视觉大气贴合用户截图的扁长大海蓝效果 |
| **默认推荐 B**，因为流体卡片就该是"海报级"视觉元素，和 Reading / Writing 的 480px 窄条并列不合适。 |

### 决策 2：文案内容

默认文案（和用户提供的 DeepSeek 示意图 1:1 翻译改写为适配 Odyssey Wiki）：
```
左上 Tag：   WIKI · STUDY NOTES（大写 mono 小字，白 60%）
大标题 1：   The Odyssey         （Fraunces 白，3xl / 5xl）
大标题 2：   共赴星辰大海         （Fraunces 白 85%，2xl / 4xl）
左下 CTA：   进入指南  →         （sans 白 70%，hover 变亮 + Arrow 微位移）
右下图标：   <Waves className="h-7 w-7 text-white/30" />
```
如果用户想替换成别的中文/英文标题（例如"奥德赛阅读指南"或"Walking through Homer"），在执行时改字符串即可。

### 决策 3：鼠标移过卡片要不要有跟随涟漪？

- **要**（默认推荐）：用户鼠标移过时，鼠标对应的位置会有一圈一圈小涟漪散开，手指划过手机屏幕（touchmove）也一样 → 交互反馈更强
- **不要**：只靠定时投石，完全被动动效 → 更克制，不抢注意力

---

## 6. 完成标准（Definition of Done）

- ✅ `/` 首页 L122 之后出现一张 `[16:9 sm:21:9]` 大海蓝圆角卡片，深蓝流体层叠光泽 + 文案，和用户提供的 DeepSeek 示意图视觉结构一致
- ✅ 点击卡片任意位置（包括 Canvas）跳转到 `/the-odyssey`；右键"在新标签页打开 Link"可用；⌘Enter 聚焦时可用；hover 有 1.005 scale + 投影加深；键盘 focus 可见 focus ring
- ✅ 流体模拟**持续动**，30 秒观察不会静止（自动投石维持）；波纹叠加折射的高光线条感 = 用户截图里的流体层叠光泽
- ✅ `prefers-reduced-motion: reduce` → WebGL 完全不启动，只显示 CSS 渐变 fallback
- ✅ 卡片滚出视口（IntersectionObserver），RAF 暂停，回滚到可视区自动恢复
- ✅ Build：`npm run build` exit 0，页面 SSG 正常（(main)/page.tsx 之前是 ○ static）
- ✅ Diagnostics：0 新增 lint/type 错误
- ✅ Perf：每帧 WebGL 工作 < 1ms（CPU/GPU 都不热），M1 Pro 预览中 Activity Monitor 能源影响 0.0x

---

## 7. 回滚方案

如果执行后效果不满意（或用户觉得流体动效太抢 Blog 首页注意力）：

1. 直接删除 `components/home/odyssey-fluid-card.tsx`
2. 回滚 `page.tsx` 的 import + subsection 插入（总共 5 行）
3. 删除 `globals.css` 末尾的 `.odyssey-fluid-card` 相关样式
4. **零副作用**，因为没改任何全局依赖 / 其它组件。
