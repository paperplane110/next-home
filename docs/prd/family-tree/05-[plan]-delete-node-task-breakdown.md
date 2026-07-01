# Family Tree 删除节点功能任务拆解

date: 2026-07-01

## 1. 目标

围绕 `03-feature-plan.md` 中的第三点“节点删除功能”，输出一份可以直接指导实现的任务拆解文档。

本次聚焦的交付目标：

1. 用户选中一个人物节点后，可以看到位于节点右上角的两个小操作按钮
2. 两个按钮分别为“编辑”和“删除”
3. 点击删除按钮后，当前人物节点会立即从画布移除
4. 与该人物节点直接相关的边也会同步移除
5. 如果右侧人物详情抽屉或编辑抽屉正处于该人物上下文，也要同步关闭
6. 本阶段不做删除后的撤销、回退或缓存

---

## 2. 当前实现现状

当前 `family-tree` 页面已经具备以下基础能力：

1. 页面主数据源已经从静态只读数据升级为页面内可编辑状态 `graphDraft`
2. 已支持新增默认人物节点
3. 已支持右侧 `PersonEditorDrawer` 编辑人物基础信息
4. 页面已有 `selectedPersonId`，可以表达“当前被选中的人物节点”

当前关键文件：

- `app/(main)/playground/family-tree/page.tsx`
- `app/(main)/playground/family-tree/_components/person-node.tsx`
- `app/(main)/playground/family-tree/_components/person-editor-drawer.tsx`
- `app/(main)/playground/family-tree/_types/graph.ts`

这说明删除功能已经具备必要前提，不需要再先重构数据源。

当前缺口主要有三个：

1. 选中态节点上还没有悬浮操作按钮
2. 页面中还没有删除节点的方法
3. 删除节点时，还没有统一处理“相关边”和“右侧 UI 状态”

所以这次删除功能的重点，不是数据建模，而是：

1. 给选中节点补操作入口
2. 建立稳定的删除执行链路
3. 保证删除后 UI 状态同步收敛

---

## 3. 核心实现思路

### 3.1 总体思路

删除功能采用“选中节点后，在节点右上角出现轻量操作浮层”的交互模式。

这样做的原因：

1. 删除行为是针对单个节点的局部操作，最合适挂在节点本体附近
2. 用户已经有“点击节点查看详情”的操作习惯，在同一选中态里补操作按钮，认知成本最低
3. 这套结构可以直接复用到第二点“编辑节点功能”

### 3.2 删除链路

推荐交互顺序如下：

1. 用户点击一个人物节点
2. 节点进入选中态
3. 节点右上角出现两个 icon 按钮：编辑、删除
4. 用户点击删除按钮
5. 系统从 `graphDraft.nodes` 中移除该人物节点
6. 系统从 `graphDraft.edges` 中移除所有 `source` 或 `target` 指向该节点的边
7. 若当前右侧详情或编辑抽屉指向该节点，则同步关闭
8. 若当前 `selectedPersonId` 正是该节点，则清空选中态

### 3.3 本阶段删除范围

第一版只支持删除：

1. `biographyPersonNode`

第一版不支持：

1. 直接删除 `marriageNode`
2. 删除后自动重连关系
3. 删除确认弹窗
4. 删除后撤销

原因：

1. `marriageNode` 是关系结构节点，不适合和人物节点在同一轮混做
2. 自动重连涉及家族树语义，不是简单 UI 删除
3. 当前 PRD 明确优先级是“完成删除动作”，不是“删除恢复机制”

---

## 4. 技术决策

### 4.1 删除入口放置位置

删除按钮不放在右侧详情卡片，而放在节点右上角的操作浮层中。

建议效果：

1. 仅在人物节点被选中时显示
2. 浮层宽度控制在两个 icon 按钮大小
3. 按钮圆角小型按钮，和节点本体视觉解耦

推荐做法：

1. 在 `PersonNode` 中根据 `selected` 渲染右上角绝对定位的操作区域
2. 操作区域使用 `pointer-events-auto`
3. 节点根元素保持 `relative`
4. 采用 ghost 样式

### 4.2 编辑和删除的动作分发方式

不要让 `PersonNode` 组件自己直接操作 `graphDraft`。

推荐做法：

1. `PersonNode` 只负责触发事件
2. 删除和编辑逻辑仍然集中在 `page.tsx`

建议在节点数据里注入一个轻量 action 回调对象，例如：

```ts
interface PersonNodeActions {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

然后在页面层为渲染用的 `nodes` 动态附加这两个回调。

这样做的原因：

1. 保持节点组件只负责展示和事件上抛
2. 所有状态更新继续集中在页面层，避免状态分散
3. 后续做节点上下文菜单、确认弹窗时更容易扩展

### 4.3 删除边的策略

删除节点时，边必须同步删除。

第一版推荐策略：

1. 删除所有满足以下条件的边：

```ts
edge.source === personId || edge.target === personId
```

这意味着：

1. 与该人物直连的婚姻边会消失
2. 与该人物直连的社交/政治/商业边也会消失

第一版暂不处理：

1. “婚姻节点因失去两端人物而变成孤儿节点”的自动清理
2. “删除父节点后，是否要继续保留子代关系”的业务语义修复

原因是本轮任务目标是“先稳定删除一个人物节点”，不是“自动修复关系图”。

### 4.4 右侧 UI 的同步关闭策略

删除发生后，需要统一清理以下状态：

1. `selectedPersonId`
2. `editorState`
3. `personFormDraft`

建议规则：

1. 如果被删除的节点正是当前选中人物，则 `selectedPersonId = ""`
2. 如果 `editorState.personId === 被删除节点 id`，则关闭编辑抽屉
3. `personFormDraft` 重置为默认空表单

这样可以避免：

1. 右侧抽屉继续显示已被删除的对象
2. 删除后点击别处时出现陈旧状态

---

## 5. 实施顺序

建议严格按下面顺序实现。

### 步骤一：为人物节点补操作按钮展示层

目标：

1. 在选中态的人物节点上显示“编辑 / 删除”两个按钮

需要改动：

- `app/(main)/playground/family-tree/_components/person-node.tsx`

实现方式：

1. 节点外层容器加 `relative`
2. 当 `selected === true` 时，渲染右上角绝对定位按钮组
3. 两个按钮建议使用 `Button size="icon-sm"` 或原生小按钮样式
4. 删除按钮建议使用更危险的视觉提示，如 `destructive` 倾向色

这一步先只做“显示”和“点击不报错”，不急着先绑删除逻辑。

### 步骤二：给节点注入页面层动作回调

目标：

1. 让 `PersonNode` 能调用页面层的编辑和删除逻辑

需要改动：

- `app/(main)/playground/family-tree/page.tsx`
- `app/(main)/playground/family-tree/_types/graph.ts`

推荐方式：

1. 扩展一个仅用于渲染层的节点 data 字段，例如：

```ts
node.data.actions = {
  onEdit,
  onDelete,
}
```

2. 页面在把 `viewGraph.nodes` 喂给 React Flow 之前，动态为人物节点补上 actions

注意：

1. 这类函数型字段只存在于前端运行时，不需要写回最终保存文件
2. 因为当前阶段还没实现“导出到本地”，这样做不会产生数据序列化问题

### 步骤三：实现人物节点删除方法

目标：

1. 统一完成“删除节点 + 删除相关边 + 清理 UI 状态”

建议新增页面级方法：

```ts
function handleDeletePerson(personId: string) {}
```

方法内部完成：

1. 从 `graphDraft.nodes` 里过滤掉该人物节点
2. 从 `graphDraft.edges` 里过滤掉与该人物节点关联的边
3. 如果当前选中的是该节点，清空 `selectedPersonId`
4. 如果当前编辑的是该节点，关闭 `PersonEditorDrawer`
5. 重置 `personFormDraft`

### 步骤四：复用同一套入口支持“编辑节点”

虽然本轮重点是删除，但由于 PRD 第二点和第三点共享同一组按钮，所以建议这轮顺手把“编辑按钮入口”也接好。

最小实现建议：

1. 点击编辑按钮后，复用现有 `PersonEditorDrawer`
2. 加载当前节点的 `personFormDraft`
3. 将 `editorState.mode` 切换为 `edit`

这样能保证“节点右上角两个按钮”的整体体验一体化落地。

### 步骤五：自测删除后图谱状态

目标：

1. 确认删除后不会残留脏 UI 状态

重点验证：

1. 删除当前选中节点后，右侧详情卡片是否收起
2. 删除当前正在编辑的节点后，编辑抽屉是否关闭
3. 删除节点后，相关边是否同步消失
4. 切换 `family / star` 视图后，删除结果是否仍然保持

---

## 6. 文件级任务拆解

### 6.1 `app/(main)/playground/family-tree/_types/graph.ts`

需要做的事：

1. 为人物节点 data 增加可选的运行时 action 类型
2. 明确 `onEdit` / `onDelete` 的参数形式

建议新增：

```ts
export interface PersonNodeActions {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

### 6.2 `app/(main)/playground/family-tree/_components/person-node.tsx`

需要做的事：

1. 节点进入选中态时显示两个 icon 按钮
2. 编辑按钮触发 `person.data.actions?.onEdit?.(nodeId)`
3. 删除按钮触发 `person.data.actions?.onDelete?.(nodeId)`
4. 处理按钮点击时不要误触发节点拖拽

建议注意：

1. 按钮点击时 `event.stopPropagation()`
2. 操作区域不能覆盖节点主要内容点击区域

### 6.3 `app/(main)/playground/family-tree/page.tsx`

需要做的事：

1. 提供 `handleEditPerson`
2. 提供 `handleDeletePerson`
3. 在渲染给 React Flow 的人物节点 data 上注入 actions
4. 删除时同步清理 `selectedPersonId`
5. 删除时同步清理 `editorState`
6. 删除时同步重置 `personFormDraft`

### 6.4 `app/(main)/playground/family-tree/_components/person-editor-drawer.tsx`

需要做的事：

1. 继续复用，不需要大改
2. 确认在 `mode === "edit"` 时标题和按钮文案正确

---

## 7. 关键方法建议

### 7.1 删除人物

建议页面层抽象为：

```ts
deletePerson(personId: string)
```

职责：

1. 删除人物节点
2. 删除直连边
3. 清理选中态
4. 清理编辑态

### 7.2 打开编辑抽屉

建议页面层抽象为：

```ts
openEditPersonEditor(personId: string)
```

职责：

1. 找到目标节点
2. 生成 `personFormDraft`
3. 打开右侧抽屉

### 7.3 构建带动作的渲染节点

建议页面层在 `viewGraph.nodes` 基础上生成：

```ts
const interactiveNodes = ...
```

职责：

1. 不修改原始 `graphDraft`
2. 只给 React Flow 的渲染层节点临时附加 `actions`

这样可以避免把函数对象直接污染到原始图谱数据源中。

---

## 8. 边界情况

### 8.1 删除当前选中节点

预期行为：

1. 节点消失
2. 高亮消失
3. 右侧详情卡片关闭或回到空态

### 8.2 删除当前正在编辑的节点

预期行为：

1. 节点消失
2. 编辑抽屉关闭
3. 表单内容重置

### 8.3 删除后切换视图

因为源数据保存在 `graphDraft`，只要删除是基于 `graphDraft` 执行，切换到另一视图后删除结果应继续保持，不应“复活”。

### 8.4 删除后留下孤立婚姻节点

这是第一版最需要明确的边界。

当前建议：

1. 第一版允许存在孤立婚姻节点的技术债
2. 不在这一轮顺手做自动清理

原因：

1. 这会引出“何时删除婚姻节点”“是否要级联删除另一端关系”的业务规则
2. 一旦在本轮混做，删除逻辑会快速膨胀

建议在后续单独补一个“关系结构清理”任务。

### 8.5 误触删除

第一版可以先不做确认弹窗，直接删除。

但实现时建议预留一个方法层级，让以后很容易插入确认逻辑，例如：

```ts
requestDeletePerson(personId)
confirmDeletePerson(personId)
```

---

## 9. 推荐的实现顺序

建议实际开发时按这个顺序提交：

### 第一轮：节点选中态操作浮层

1. 先让选中节点右上角出现编辑和删除按钮
2. 先验证按钮位置、尺寸和点击命中区域

### 第二轮：编辑按钮接入

1. 点击编辑按钮可以打开已有 `PersonEditorDrawer`
2. 复用当前新增节点实现里的表单回写链路

### 第三轮：删除节点主逻辑

1. 删除节点
2. 删除相关边
3. 清理选中态和编辑态

### 第四轮：补细节交互

1. 防止按钮点击冒泡
2. 删除后详情卡片回到空态
3. 删除后编辑抽屉关闭

### 第五轮：验证双视图一致性

1. 在 `family` 视图删除
2. 切换到 `star` 视图确认仍然删除
3. 在 `star` 视图删除
4. 切回 `family` 确认仍然删除

---

## 10. 验收标准

完成后应满足以下验收项：

1. 选中人物节点后，其右上角会出现两个 icon 大小的按钮
2. 点击编辑按钮可以打开右侧编辑抽屉
3. 点击删除按钮后，人物节点会从画布上消失
4. 与该人物节点直接相连的边会同步消失
5. 如果当前右侧详情或编辑抽屉指向该人物，删除后会同步关闭或回到空态
6. 切换 `family / star` 视图后，删除结果仍然保持
7. 新增代码无 TypeScript 和运行时报错

---

## 11. 本次建议使用的工具与方法

### UI / 交互

1. React Flow 的 `selected` 节点态
2. 项目现有 `Button`
3. `lucide-react` 图标
4. 现有 `PersonEditorDrawer`

### 工程方法

1. 页面层集中管理删除逻辑
2. 节点组件只负责渲染和触发事件
3. 运行时渲染节点附加 `actions`
4. 先完成最小删除闭环，再考虑确认弹窗和撤销

---

## 12. 结论

删除节点功能的正确切入点，不是直接在 `graphDraft` 上写一个 `filter`，而是先建立“选中节点 -> 右上角操作浮层 -> 页面层统一处理删除”的完整操作链。

落地顺序应当是：

1. 先补节点右上角的编辑/删除按钮
2. 再补页面层删除方法
3. 再处理边联动清理和右侧 UI 状态同步
4. 最后验证双视图一致性

按这个顺序实现，可以和第二点“编辑节点功能”共用同一套选中态交互，不会出现两套入口、两套状态机并行的问题。
