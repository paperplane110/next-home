# 家族树展示组件技术方案编写计划

## Summary
- 目标：先产出一份文档，不写业务代码；文档落点定为 `docs/requirements/family-tree-reactflow.md`。
- 方案方向：独立页面优先，底层采用“关系图模型（nodes + edges）”，渲染层使用 React Flow，后续演进为“轻量编辑”页面。
- 一期定位：虽然用户未来要可交互，但当前交付物仅为技术方案文档，文档中需要覆盖静态版如何落地、以及如何平滑升级到交互式页面。

## Current State Analysis
- 文档目录已存在：仓库已有 `docs/requirements/seo.md`，说明当前项目接受在 `docs/requirements` 下维护需求/方案文档。
- 内容系统已就绪：`content-collections.ts` 已配置 `posts`、`reading` 两类 MDX 内容，且支持从 `components/mdx` 引入自定义组件，说明后续家族树既可以做独立页面，也可以在文章中嵌入摘要版或跳转入口。
- 阅读详情页渲染链路清晰：`app/(main)/reading/[slug]/page.tsx` 通过 `MDXContent` 渲染正文，未来若需要“传记文章 -> 家族树”的联动，可以在这个入口补充组件映射或插入链接。
- 仓库已有树形实验：`app/(main)/playground/tree/layout.tsx` 与 `app/(main)/playground/tree/components/tree.tsx` 证明项目里已经有“节点关系 + 路由联动 + 可展开树”的探索，但现状是严格树结构，不支持“婚姻、继承、旁支、多父母、边标签”等更自由的关系图表达。
- 依赖现状：`package.json` 中尚未安装 React Flow（通常为 `@xyflow/react`），因此正式实现前需要新增依赖；这一点应在文档中单独列为实现前提。
- UI 能力基础较好：项目已具备 `Badge`、`Card`、`Popover`、`Drawer`、`Dialog` 等基础组件，可直接作为未来节点徽标、节点详情、边说明或侧边编辑面板的 UI 基础。

## Proposed Changes

### 1. 创建正式技术方案文档
- 新增文件：`docs/requirements/family-tree-reactflow.md`
- 目的：把“组件为什么这么设计、先做什么、后做什么、数据结构怎么定、交互边界是什么”一次写清楚，避免后续实现阶段反复改架构。
- 文档风格参考：沿用 `docs/requirements/seo.md` 的结构化写法，使用“背景 / 目标 / 范围 / 方案 / 验收 / Backlog”这种工程文档格式。

### 2. 文档应包含的核心章节
- 背景与目标：
  - 说明使用场景是“阅读传记时展示家族树/人物关系图”。
  - 强调诉求不是严格意义上的单根树，而是可扩展、可加 badge、可加边文案、后续可编辑的关系图组件。
- 设计原则：
  - “无界”优先于“标准树”。
  - 数据模型先行，布局算法和 UI 只是渲染层。
  - 静态展示与未来编辑共用一份图数据结构，避免一期重写。
- 选型说明：
  - 使用 React Flow 作为画布、缩放、拖拽、节点/边渲染框架。
  - 节点样式自定义通过 custom node 实现；badge 作为节点 data 的一部分渲染。
  - 边文字通过 edge label / custom edge 实现；婚姻、血缘、收养、继承等关系用 edge type + label 表达。
- 数据模型：
  - 明确定义 `FamilyGraph`、`FamilyNode`、`FamilyEdge`、`NodeBadge` 的建议字段。
  - `FamilyNode` 至少包含：`id`、`name`、`subtitle`、`badges`、`avatar/portrait?`、`meta`、`position?`。
  - `FamilyEdge` 至少包含：`id`、`source`、`target`、`relationType`、`label`、`direction`、`styleVariant`。
  - 解释为何不要继续复用当前 playground 的 `children[]` 树结构：因为它无法自然表达多对多关系与跨分支连接。
- 一期静态版落地方案：
  - 页面优先，不先做 MDX 内嵌复杂交互。
  - 建议未来实现路径：`app/(main)/family-tree/[slug]/page.tsx` 作为独立页面入口。
  - 图数据建议单独维护于 `content/family-trees/<slug>.ts` 或 `content/family-trees/<slug>.json`，由页面读取并映射为 React Flow 的 `nodes/edges`。
  - 一期仅允许“代码维护数据 + 页面渲染”，不在页面内直接改写持久化文件。
- 二期轻量编辑方案：
  - 在独立页面增加“新增节点 / 新增关系 / 改标签 / 改 badge”的前端编辑能力。
  - 编辑结果先保存在前端状态或导出为 JSON，不接数据库。
  - 引入“source of truth”概念：编辑器操作的产物仍是同一份 `FamilyGraph` 结构，避免显示页和编辑页分叉。
- 三期可选演进：
  - 文章内嵌简化版 `FamilyTreeEmbed` 组件，用于在 `reading` MDX 文章内插入家族树缩略视图或“查看完整家族树”入口。
  - 更智能的自动布局（如 dagre / elkjs）。
  - 持久化存储、版本管理、关系过滤、节点详情侧栏。

### 3. 文档中要明确的未来文件边界
- 文档里需要给出后续真实实现时建议新增/涉及的文件，避免方案停留在抽象层：
  - `app/(main)/family-tree/[slug]/page.tsx`：独立家族树页面。
  - `components/family-tree/family-tree-canvas.tsx`：React Flow 画布封装。
  - `components/family-tree/family-node.tsx`：自定义节点。
  - `components/family-tree/family-edge.tsx`：自定义边与边标签。
  - `components/family-tree/types.ts`：图模型类型定义。
  - `content/family-trees/<slug>.ts`：家族图静态数据。
  - `components/mdx/family-tree-embed.tsx`：未来文章内嵌版本。
- 这些文件当前都不存在，因此正式文档里要说明它们是“建议实现结构”，不是仓库现状。

### 4. 文档中要锁定的关键实现决策
- 页面入口：独立路由优先，不把第一版复杂交互塞进 `reading/[slug]` 页面。
- 渲染模型：采用关系图，不再基于 `children[]` 递归树。
- 交互边界：二期只做“轻量编辑”，即前端临时编辑、导出 JSON 或复制配置，不引入数据库与多人协作。
- 样式扩展：节点上的 badge、状态点、人物头衔、颜色主题均以 node data 驱动；边上的文字、颜色、箭头样式以 edge data 驱动。
- 布局策略：一期优先“手工 position + React Flow viewport”，必要时再引入自动布局；因为家族树通常需要人工审美与叙事控制，自动布局不一定优于手工摆放。
- 嵌入策略：后续如果在文章内嵌，只放只读版或缩略版，不直接把编辑器放进 MDX 正文。

## Assumptions & Decisions
- 已确认的用户偏好：
  - 第一版：独立页面优先。
  - 底层模型：关系图模型。
  - 后续交互：轻量编辑。
  - 技术选型：React Flow。
- 本计划默认技术方案文档会写到 `docs/requirements/family-tree-reactflow.md`，而不是直接开始实现页面或组件。
- 本计划不包含代码开发、依赖安装、页面接线、样式编写，仅包含“把技术方案文档写完整”。
- 本计划默认技术方案中会同时覆盖“静态版”和“未来交互版”的架构衔接，而不是只描述一期静态效果。

## Verification Steps
- 确认文档目标文件路径为 `docs/requirements/family-tree-reactflow.md`。
- 确认文档内容包含以下最少章节：背景、目标、范围、技术选型、数据模型、分阶段方案、建议文件结构、验收标准、Backlog。
- 确认文档中的所有现状描述都能在当前仓库中找到依据：
  - `docs/requirements/seo.md`
  - `content-collections.ts`
  - `app/(main)/reading/[slug]/page.tsx`
  - `app/(main)/playground/tree/layout.tsx`
  - `app/(main)/playground/tree/components/tree.tsx`
  - `package.json`
- 确认文档明确写出“React Flow 当前尚未安装，需在真正实现时新增依赖”。
- 确认文档明确区分“一期静态展示”和“二期轻量编辑”，避免范围混淆。
