# Family Tree 新增节点功能任务拆解

date: 2026-07-01

## 1. 目标

围绕 `03-feature-plan.md` 中的第一个功能“新增节点功能”，输出一份可以直接指导实现的任务拆解文档。

本次聚焦的交付目标：

1. 用户可以在画布空白处通过右键或双击发起“新增人物”
2. 系统会先在画布中插入一个默认人物节点
3. 右侧立即弹出编辑面板，用户补充人物信息
4. 提交后节点更新并保留在画布中
5. 本阶段只做前端本地内存态，不接后端保存

---

## 2. 当前实现现状

当前 `family-tree` demo 的主页面位于：

- `app/(main)/playground/family-tree/page.tsx`

当前图谱渲染链路是：

1. 读取静态数据 `biographyData`
2. 通过 `buildViewGraph(biographyData, viewMode)` 生成当前视图的 `nodes + edges`
3. 将结果喂给 React Flow

对应文件：

- `app/(main)/playground/family-tree/_data/biography-data.ts`
- `app/(main)/playground/family-tree/_utils/layout-calc.ts`
- `app/(main)/playground/family-tree/_types/graph.ts`

这意味着当前页面的“源数据”是只读静态常量，问题在于：

1. 新增节点后，如果仍然依赖静态 `biographyData`，切换视图时新增节点会丢失
2. 右侧当前只有 `SidebarDrawer`，它是“详情查看态”，还不是“可编辑表单态”
3. `BiographyPersonData` 目前只有 `birthDeath` 这样的展示字段，还没有结构化的 `gender / birthDate / deathDate`

所以要实现“新增节点”，第一步不是直接绑事件，而是先把“静态只读图谱”升级为“页面内可编辑图谱状态”。

---

## 3. 核心实现思路

### 3.1 总体思路

采用“先插入默认节点，再打开右侧表单补全信息”的模式，而不是“先填表再决定是否落图”。

这样做的原因：

> @audit: 是的，因为“乐观更新”
1. 用户在画布上发起新增时，最重要的是先确认空间位置
2. 节点先出现，交互反馈更直接，符合无界画布编辑器的直觉
3. 后续做拖拽、撤销、批量编辑时，这种模式更容易扩展

### 3.2 状态设计思路

当前页面需要新增三层状态：

1. `graphDraft`
   - 含义：当前可编辑的完整图谱数据源
   - 类型：`GraphDataset`
   - 用途：替代只读 `biographyData`，作为所有视图切换、增删改节点的唯一来源

2. `editorState`
   - 含义：右侧编辑面板当前是否打开、处于新增还是编辑、正在编辑哪个节点
   - 推荐结构：

```ts
type PersonEditorMode = "create" | "edit";

interface PersonEditorState {
  open: boolean;
  mode: PersonEditorMode;
  personId: string | null;
}
```

1. `personFormDraft`
   - 含义：右侧表单中的临时输入值
   - 用途：避免每次输入都直接污染图谱正式数据

### 3.3 交互链路

推荐交互顺序如下：

1. 用户在 React Flow 画布空白处右键，或双击空白处
2. 读取触发位置，并转换为 Flow 坐标
3. 创建一个默认人物节点，插入 `graphDraft.nodes`
4. 选中新节点
5. 打开右侧“新增人物”抽屉
6. 用户填写姓名、性别、出生日期、死亡日期等字段
7. 点击保存后，将表单数据回写到该节点
8. 关闭抽屉

取消策略建议：

1. 如果是“新增态”且用户直接关闭抽屉
2. 并且该节点仍然是默认空白内容
3. 则自动删除这个临时节点

这样可以避免画布上残留大量未完成的空白节点。

---

## 4. 技术决策

### 4.1 画布事件

使用 React Flow 提供的 Pane 级事件：

1. `onPaneContextMenu`
   - 用于右键空白处新增节点
   - 需要 `event.preventDefault()`，避免浏览器原生右键菜单出现

2. `onPaneDoubleClick`
   - 用于双击空白处新增节点
   - 作为右键操作的补充入口

### 4.2 坐标转换

使用 React Flow 的坐标转换能力，将鼠标屏幕坐标转换为画布坐标。

推荐方法：

1. 使用 `useReactFlow()`
2. 通过 `screenToFlowPosition({ x, y })` 获取真实节点落点

这样可以保证在当前缩放、平移状态下，新节点仍然出现在用户点击的位置，而不是出现在错误的绝对坐标。

### 4.3 右侧面板实现方式

项目里目前没有现成的 `sheet.tsx`，但已有：

- `components/ui/drawer.tsx`

因此第一版建议直接使用现有 `Drawer` 组件，并配置为右侧弹出：

1. 不需要额外引入新 UI 基础设施
2. 与“右侧弹出 sheet”的产品要求基本等价
3. 后续可以平滑复用到“编辑人物”“删除确认”等场景

### 4.4 数据建模

为了支持后续编辑、保存、加载，建议这次不要继续只用 `birthDeath` 这种展示字段，而是补充结构化字段：

```ts
type PersonGender = "male" | "female" | "unknown";

interface BiographyPersonData {
  name: string;
  gender?: PersonGender;
  birthDate?: string;
  deathDate?: string;
  birthDeath?: string;
  ...
}
```

其中：

1. `birthDate` / `deathDate` 用于表单输入与后续保存
2. `birthDeath` 作为当前 UI 兼容字段，可以在提交时由结构化字段派生

### 4.5 第一版新增节点范围

第一版只支持新增：

1. `biographyPersonNode`

第一版不支持：

1. 新增婚姻节点
2. 新增连线
3. 自动推导血缘关系
4. 自动重排家族树布局

原因：

1. “新增人物”是最小闭环
2. 婚姻节点和关系边涉及关系建模，不适合和表单录入绑在同一轮做
3. 当前 `family` 视图布局依赖静态 `viewMeta.familyTree.position`，如果同时做自动布局，复杂度会明显提升

---

## 5. 实施顺序

建议严格按下面顺序实现，避免后面频繁返工。

### 步骤一：把静态数据升级为可编辑数据源

目标：

1. 将 `biographyData` 从“初始常量”变成“页面初始化数据”
2. 页面内部维护 `graphDraft`

实施方式：

1. `page.tsx` 中新增：

```ts
const [graphDraft, setGraphDraft] = useState<GraphDataset>(biographyData);
```

2. 将 `buildViewGraph` 的输入由 `biographyData` 改为 `graphDraft`
3. 所有节点增删改都只操作 `graphDraft`

为什么必须先做这一步：

1. 否则新增节点只会短暂存在于当前视图
2. 一旦切换 `family / star` 视图，新增数据就会被静态源覆盖掉

### 步骤二：补充类型定义和默认节点工厂

目标：

1. 明确新增人物节点的最小数据结构
2. 保证每次创建节点时结构一致

建议新增一个工厂函数，例如：

- `app/(main)/playground/family-tree/_utils/create-person-node.ts`

职责：

1. 生成唯一 `id`
2. 生成默认 `position`
3. 生成默认 `data`
4. 填充 `viewMeta.familyTree.position`
5. 填充 `viewMeta.starNetwork`

默认值建议：

1. `name: "未命名人物"`
2. `category: "other"`
3. `gender: "unknown"`
4. `badges: []`
5. `bioSummary: ""`
6. `viewMeta.familyTree.generation`
   - 第一版先给默认值 `1`
7. `viewMeta.starNetwork`
   - 第一版默认放在 `outer`

注意：

当前 `family` 视图完全依赖 `viewMeta.familyTree.position`，所以新增节点时必须同步写入这个字段，否则切换到 `family` 视图后节点可能出现在意料之外的位置。

### 步骤三：接入 Pane 级新增入口

目标：

1. 在空白画布上触发新增节点

需要改动：

- `app/(main)/playground/family-tree/page.tsx`

推荐拆出两个 handler：

1. `handlePaneContextMenu`
2. `handlePaneDoubleClick`

内部共用一个新增方法，例如：

```ts
function startCreatePerson(flowPosition: XYPosition) {}
```

该方法内部完成：

1. 调用 `createPersonNode`
2. 更新 `graphDraft`
3. 设置 `selectedPersonId`
4. 打开右侧编辑抽屉
5. 初始化 `personFormDraft`

### 步骤四：把右侧详情面板拆成“查看态 + 编辑态”

当前已有：

- `app/(main)/playground/family-tree/_components/sidebar-drawer.tsx`

建议不要继续让一个组件同时承担“详情查看”和“表单录入”，而是拆分为：

1. `SidebarDrawer`
   - 继续负责只读详情展示

2. `PersonEditorDrawer`
   - 新增，负责创建/编辑人物表单

推荐新增文件：

- `app/(main)/playground/family-tree/_components/person-editor-drawer.tsx`

建议使用：

- `components/ui/drawer.tsx`
- `components/ui/button.tsx`
- 项目现有 `input / textarea / select` 组件

如果项目内缺少对应表单 UI 组件，再按需补简单原生表单控件。

### 步骤五：表单提交与节点回写

目标：

1. 将表单草稿回写到图谱正式数据

保存逻辑建议：

1. 根据 `editorState.personId` 找到目标节点
2. 合并表单数据
3. 重新计算展示字段 `birthDeath`
4. 更新 `graphDraft.nodes`
5. 保持 `edges` 不变
6. 关闭抽屉

这里建议新增一个纯函数，例如：

- `app/(main)/playground/family-tree/_utils/person-form.ts`

职责：

1. `buildBirthDeathLabel`
2. `sanitizePersonDraft`
3. `mergePersonDraftIntoNode`

这样可以把页面组件里的数据清洗逻辑抽出去，避免 `page.tsx` 过重。

### 步骤六：补取消逻辑和空白节点清理

@audit 不做这个自动清理功能

目标：

1. 避免新增中断后遗留垃圾节点

建议规则：

1. 若 `editorState.mode === "create"`
2. 且用户关闭抽屉时该节点仍为默认空白节点
3. 则自动从 `graphDraft.nodes` 中移除

判断“是否为空白默认节点”的方法建议做成独立函数：

```ts
function isTemporaryBlankPerson(node: PersonNode): boolean {}
```

---

## 6. 文件级任务拆解

### 6.1 `app/(main)/playground/family-tree/page.tsx`

需要做的事：

1. 新增 `graphDraft` 作为图谱唯一数据源
2. 新增 `editorState`
3. 新增 `personFormDraft`
4. 接入 `onPaneContextMenu`
5. 接入 `onPaneDoubleClick`
6. 接入 `PersonEditorDrawer`
7. 提交、取消时回写或删除临时节点

### 6.2 `app/(main)/playground/family-tree/_types/graph.ts`

需要做的事：

1. 给 `BiographyPersonData` 增加结构化字段
   - `gender`
   - `birthDate`
   - `deathDate`
2. 增加表单 draft 类型
3. 增加 editor state 类型

### 6.3 `app/(main)/playground/family-tree/_components/person-editor-drawer.tsx`

需要做的事：

1. 渲染右侧创建人物表单
2. 区分新增态和编辑态标题
3. 提供保存 / 取消按钮
4. 向父组件抛出 `onSubmit` / `onClose`

### 6.4 `app/(main)/playground/family-tree/_utils/create-person-node.ts`

需要做的事：

1. 统一生成默认节点
2. 封装 ID 生成
3. 封装默认视图元数据

### 6.5 `app/(main)/playground/family-tree/_utils/person-form.ts`

需要做的事：

1. 表单字段转展示字段
2. 输入清洗
3. 判断临时节点是否为空白

---

## 7. 关键方法建议

### 7.1 新增节点工厂

建议使用纯函数，便于测试和复用：

```ts
createPersonNode({
  position,
  viewMode,
})
```

输入：

1. 画布坐标
2. 当前视图模式

输出：

1. 一个完整可渲染的 `PersonNode`

### 7.2 Flow 坐标获取

建议在页面中通过 React Flow 实例获取：

```ts
const { screenToFlowPosition } = useReactFlow();
```

用途：

1. 把鼠标点击位置转换成节点落点

### 7.3 右侧抽屉控制

推荐抽象为：

```ts
openCreatePersonEditor(personId: string)
closePersonEditor()
submitPersonEditor()
```

这样后续“编辑人物”功能可以直接复用，不需要重写状态机。

---

## 8. 边界情况

实现时需要提前考虑这些问题：

### 8.1 当前视图为 `star`

新增节点后依然要同时写入：

1. `viewMeta.starNetwork`
2. `viewMeta.familyTree.position`

否则切回 `family` 视图后会缺少布局坐标。

### 8.2 当前视图为 `family`

由于 `family` 视图现阶段使用静态坐标放大，并不是自动布局，所以新增节点可能与现有节点重叠。

第一版建议：

1. 允许重叠
2. 让用户自行拖拽微调

后续再考虑：

1. 吸附
2. 自动避让
3. 自动层级布局

### 8.3 用户创建后立刻切换视图

因为源数据保存在 `graphDraft`，理论上不应丢失。

但要确保：

1. 新增节点的两套 `viewMeta` 都有默认值
2. `buildViewGraph` 不会因为缺字段而过滤掉新节点

### 8.4 用户关闭抽屉但未保存

要区分两类场景：

1. 新增态：删除空白临时节点
2. 编辑态：不删除节点，只放弃本次改动

---

## 9. 推荐的实现顺序

建议实际开发时按这个顺序提交：

### 第一轮：数据层重构

1. 引入 `graphDraft`
2. 确认切换视图时新增数据不会丢失

### 第二轮：最小新增闭环

1. 接 `onPaneContextMenu`
2. 创建默认节点
3. 直接让节点显示在画布上

这一步先不要急着做表单，先验证节点确实能稳定插入。

### 第三轮：接右侧表单抽屉

1. 新增 `PersonEditorDrawer`
2. 接入默认表单值
3. 保存后回写节点

### 第四轮：补双击入口和取消逻辑

1. 接 `onPaneDoubleClick`
2. 增加临时节点删除

### 第五轮：补细节体验

1. 表单校验
2. 按钮 loading / disabled
3. 保存成功后的自动选中
4. 新增节点高亮态

---

## 10. 验收标准

完成后应满足以下验收项：

1. 在画布空白处右键，可以新增一个默认人物节点
2. 在画布空白处双击，也可以新增一个默认人物节点
3. 新增后右侧弹出表单抽屉
4. 输入姓名、性别、出生日期、死亡日期后可以保存
5. 保存后节点内容更新，且切换视图不丢失
6. 关闭新增表单时，如果节点仍为空白默认态，则自动删除
7. 新增节点后页面无 TypeScript 和 React Flow 运行时报错

---

## 11. 本次建议使用的工具与方法

### UI / 交互

1. React Flow
   - `onPaneContextMenu`
   - `onPaneDoubleClick`
   - `useReactFlow`
   - `screenToFlowPosition`

2. 项目现有 UI
   - `components/ui/drawer.tsx`
   - `components/ui/button.tsx`

### 工程方法

1. 使用工厂函数创建节点，避免页面里手写散乱对象
2. 使用纯函数处理表单与节点数据转换
3. 将“查看态”和“编辑态”拆成两个独立组件
4. 先完成最小闭环，再补取消、校验和体验细节

---

## 12. 结论

“新增节点功能”的正确切入点，不是直接往 React Flow 里塞一个节点，而是先把 `family-tree` 从“静态演示图谱”升级成“页面内可编辑图谱”。

落地顺序应当是：

1. 先重构数据源状态
2. 再接画布新增事件
3. 再实现右侧新增人物表单
4. 最后补取消清理和体验优化

按这条顺序实现，后续的“编辑人物”“删除人物”“保存/加载”都可以复用同一套状态结构，不会推倒重来。
