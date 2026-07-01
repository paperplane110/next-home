# Family Tree 关系 Edge 功能任务拆解

date: 2026-07-01

## 1. 目标

围绕 `03-feature-plan.md` 中的第八项“关系 edge”，输出一份可以直接指导实现的任务拆解文档。

本次聚焦的交付目标：

1. 用户可以在画布中发起新建 edge
2. 新建 edge 时，默认类型为 `other`，默认没有自定义 label
3. 用户可以双击 edge，打开右侧 sheet / drawer 编辑 edge 的类型和 label
4. 除 `other` 外，每种 edge 类型都支持一个预设 label；如果用户未填写自定义 label，则展示预设 label
5. 当从“婚姻专用 source handle”发起连线时，只允许创建家族关系，不允许创建其他类型
6. 当新建的 edge 类型为 `marriage` 且 target 是人物节点时，不直接保留这条 edge，而是自动转译成“婚姻节点 + 两条 marriage edge”的结构

本阶段仍然只做前端本地内存态，不接后端保存。

---

## 2. 当前实现现状

当前 `family-tree` 页面已经具备以下能力：

1. 页面主数据源已经升级为可编辑状态 `graphDraft`
2. 已支持人物节点新增、编辑、删除
3. 已有自定义 edge 渲染组件 `CustomRelationEdge`
4. 已有婚姻节点 `MarriageNode`
5. 关系 edge 已有 `relationshipType / label / description / views` 等基础字段

当前关键文件：

- `app/(main)/playground/family-tree/page.tsx`
- `app/(main)/playground/family-tree/_types/graph.ts`
- `app/(main)/playground/family-tree/_components/custom-relation-edge.tsx`
- `app/(main)/playground/family-tree/_components/person-node.tsx`
- `app/(main)/playground/family-tree/_components/marriage-node.tsx`
- `app/(main)/playground/family-tree/_data/biography-data.ts`

当前缺口主要有五个：

1. `page.tsx` 里还没有 `onConnect / isValidConnection` 等连线创建链路
2. 节点 handle 还没有区分“普通关系发起”和“婚姻关系发起”
3. 页面中还没有 edge 编辑态，也没有对应的右侧编辑抽屉
4. `RelationshipEdgeData` 里还没有“默认 label / 自定义 label”这层语义拆分
5. 当前 `marriageNode` 只是静态结构节点，新建 marriage 关系时还没有自动转译逻辑

所以这次关系 edge 功能的重点，不是仅仅“把 React Flow 的连线打开”，而是建立一套稳定的：

1. 连线创建规则
2. edge 数据建模
3. edge 编辑抽屉
4. marriage 特殊结构转译

---

## 3. 核心实现思路

### 3.1 总体思路

关系 edge 功能建议分成两层：

1. 通用 edge 闭环
   - 允许从节点连到节点 / 结构节点
   - 生成默认 edge
   - 支持双击 edge 编辑

2. marriage 特殊闭环
   - marriage 不直接保留为一条人物到人物的普通 edge
   - 而是自动落成一个婚姻节点，再生成两条 marriage edge

这样拆分的原因：

1. 通用 edge 和 marriage edge 的数据语义不同
2. 如果一开始就把所有 edge 都按 marriage 逻辑做，会让实现复杂度膨胀
3. React Flow 的基础连接能力和婚姻结构转译应该分层实现，便于调试

### 3.2 推荐交互链路

建议交互顺序如下：

1. 用户从节点 handle 发起拖拽连线
2. 系统根据 `sourceHandle / targetHandle / source / target` 判断是否合法
3. 如果是普通关系连线：
   - 直接向 `graphDraft.edges` 中插入一条默认 edge
4. 如果是 marriage 特殊连线，且 target 是人物节点：
   - 新增一个 `marriageNode`
   - 新增一条 `source -> marriageNode`
   - 新增一条 `target -> marriageNode`
   - 不保留原始 `source -> target` 连线
5. 用户双击某条 edge
6. 右侧打开 edge 编辑抽屉
7. 用户调整 edge 类型和 label
8. 保存后回写 `graphDraft.edges`

### 3.3 edge 的默认数据策略

新建普通 edge 时，建议默认数据为：

```ts
{
  relationshipType: "other",
  label: "",
  description: "",
  views: [当前视图]
}
```

但这里需要再补一层规则：

1. `label` 表示用户自定义输入
2. `relationshipType` 对应一套预设 label
3. 当用户没填 `label` 时，展示预设 label

也就是说，渲染层不要只看 `edge.data.label`，而应该走：

```ts
displayLabel = edge.data.label || RELATIONSHIP_PRESET_LABEL[edge.data.relationshipType]
```

这样既能让新建 edge 默认有语义，又能让用户覆盖它。

---

## 4. 技术决策

### 4.1 连接入口

使用 React Flow 原生连接能力：

1. `onConnect`
   - 处理正式创建
2. `isValidConnection`
   - 处理连接规则校验
3. `Connection`
   - 用于读取 `source / target / sourceHandle / targetHandle`

推荐原则：

1. 所有“能不能连”的判断都放在页面层
2. 节点组件只负责渲染 handle，不直接决定业务逻辑

### 4.2 连接规则判断方式

这轮不额外给 `PersonNode` 增加新的 handle 类型语义。

推荐做法：

1. 保持现有人物节点 handle 结构尽量简单
2. 在页面层通过 `connection.source` 找到 source 节点
3. 再根据 source 节点的 `type` 判断当前连接应该走哪套业务规则

也就是说，连接规则的关键不是“sourceHandle 是什么”，而是“这条连接是从哪种节点发起的”：

1. 若 source 节点是 `marriageNode`
   - 只允许建立 blood | adoption 关系
2. 若 source 节点是 `biographyPersonNode`
   - 允许创建普通关系 edge

这样做的原因：

1. 当前 marriage 的特殊语义本来就来自结构节点本身，而不是人物节点上的某个额外 handle
2. 不需要为了这一个规则改动 `PersonNode` 的交互复杂度
3. 页面层基于节点类型判断，更接近当前图谱数据结构，也更容易维护

### 4.3 relationshipType 与预设 label

建议新增一份关系类型配置表，集中维护：

```ts
const RELATIONSHIP_TYPE_META = {
  blood: { label: "血缘" },
  adoption: { label: "收养" },
  marriage: { label: "夫妻" },
  employ: { label: "雇佣关系" },
  peer: { label: "同龄人" },
  ally: { label: "盟友" },
  mentor: { label: "导师" },
  friendship: { label: "朋友" },
  other: { label: "" },
}
```

建议用途：

1. 作为 edge 编辑表单的选项来源
2. 作为默认展示 label 来源
3. 作为婚姻关系特殊处理的判断来源

### 4.4 marriage 特殊转译策略

这是本轮最核心的特殊规则。

当满足以下条件时：

1. 新建 edge 的 `relationshipType === "marriage"`
2. `target` 是 `biographyPersonNode`

则不要直接往 `graphDraft.edges` 插入一条普通 edge，而是执行：

1. 创建一个新的 `marriageNode`
2. 该节点横坐标为 `source` 和 `target` 的中点
3. 纵坐标为 `max(source.y, target.y) + 24`
4. 新增一条 `source -> marriageNode`
5. 新增一条 `target -> marriageNode`

同时建议：

1. 这两条 edge 的 `relationshipType` 都为 `marriage`
2. marriage node 默认 `label: "夫妻"`
3. `husbandId / wifeId` 第一版不要做严格性别校验，先以 `source / target` 记录

原因：

1. 现有图谱结构本身就是“婚姻节点 + 两条关系边”
2. 如果继续允许人物到人物直接是 marriage edge，会形成两套数据语义并存
3. 这会直接影响后续 family 视图的布局和删除逻辑

### 4.5 edge 编辑面板

推荐新增一个独立组件：

- `app/(main)/playground/family-tree/_components/edge-editor-drawer.tsx`

继续复用现有 drawer 基础设施：

- `components/ui/drawer.tsx`

表单字段第一版建议只做：

1. source 名称
2. target 名称
3. edge 类型
4. label
5. description 描述

### 4.6 本阶段支持范围

第一版支持：

1. 新建普通 edge
2. 双击编辑 edge 类型和 label
3. marriage 特殊结构转译

第一版不支持：

1. edge 删除
2. edge 撤销 / 回退
3. edge 批量编辑
4. marriage node 自动重排其他节点
5. 根据 gender 自动决定 husband / wife

---

## 5. 实施顺序

建议严格按下面顺序实现。

### 步骤一：补 edge 数据建模与关系类型配置

目标：

1. 明确 edge 的可编辑字段
2. 建立 `relationshipType -> 默认 label` 的配置

需要改动：

- `app/(main)/playground/family-tree/_types/graph.ts`
- 推荐新增 `app/(main)/playground/family-tree/_utils/edge-meta.ts`

实施方式：

1. 保持 `relationshipType` 枚举集中定义
2. 增加默认 label 配置表
3. 如有必要，新增 `EdgeFormDraft`
4. 新增 `EdgeEditorState`

### 步骤二：补连接规则判断底座

目标：

1. 让页面层可以根据 source 节点类型决定连接规则

需要改动：

- `app/(main)/playground/family-tree/_components/marriage-node.tsx`
- `app/(main)/playground/family-tree/page.tsx`

实施方式：

1. 保持 `PersonNode` 现有 handle 结构不膨胀
2. 如有必要，仅为 `marriageNode` 的 handle 补稳定 id，便于识别结构连接
3. 在页面层通过 `connection.source` 定位 source 节点
4. 根据 source 节点 `type` 分流普通关系和 family / marriage 相关关系

### 步骤三：接入 React Flow 的 edge 新建链路

目标：

1. 用户可以拖拽创建连线

需要改动：

- `app/(main)/playground/family-tree/page.tsx`

实施方式：

1. 增加 `isValidConnection`
2. 增加 `handleConnect`
3. `handleConnect` 内部按 connection 类型分流：
   - 普通 edge 直接插入
   - marriage edge 走特殊转译

### 步骤四：实现 marriage 特殊结构工厂

目标：

1. 避免在页面里散落婚姻节点与婚姻边的拼装逻辑

推荐新增工具：

- `app/(main)/playground/family-tree/_utils/create-marriage-structure.ts`

职责：

1. 计算 marriage 节点位置
2. 生成 marriage node
3. 生成两条 marriage edge

### 步骤五：实现 edge 编辑抽屉

目标：

1. 支持双击 edge 打开编辑表单

推荐新增：

- `app/(main)/playground/family-tree/_components/edge-editor-drawer.tsx`

页面层需要补：

1. `selectedEdgeId`
2. `edgeEditorState`
3. `edgeFormDraft`
4. `handleEdgeDoubleClick`
5. `handleSubmitEdgeEditor`

### 步骤六：补默认 label 展示与校验

目标：

1. 当 label 留空时，仍然能显示关系语义

需要改动：

- `app/(main)/playground/family-tree/_components/custom-relation-edge.tsx`

实施方式：

1. 读取关系类型配置
2. 如果 `edge.data.label` 为空，则回退到预设 label
3. 如果 `relationshipType === "other"` 且 label 也为空，则可以不展示 label

### 步骤七：自测双视图与 marriage 特例

目标：

1. 确保普通 edge 与 marriage edge 都能稳定工作

重点验证：

1. 新建普通 edge 是否立即出现
2. 双击 edge 是否能打开编辑抽屉
3. label 留空时是否显示预设 label
4. marriage 新建时是否自动转译为 marriage node + 2 条 edge
5. family / star 视图切换后结果是否保持

---

## 6. 文件级任务拆解

### 6.1 `app/(main)/playground/family-tree/_types/graph.ts`

需要做的事：

1. 明确 `RelationshipType`
2. 新增 edge 表单 draft 类型
3. 新增 edge 编辑状态类型
4. 如有必要，为 runtime 编辑动作预留扩展

建议新增：

```ts
interface EdgeFormDraft {
  relationshipType: RelationshipType;
  label: string;
}

interface EdgeEditorState {
  open: boolean;
  edgeId: string | null;
}
```

### 6.2 `app/(main)/playground/family-tree/_components/marriage-node.tsx`

需要做的事：

1. 明确 marriageNode 的 source / target handle id
2. 为后续 marriage 结构连接提供稳定锚点

### 6.3 `app/(main)/playground/family-tree/_components/custom-relation-edge.tsx`

需要做的事：

1. 处理默认 label 回退
2. 支持 edge 双击编辑入口
3. 保持 label 渲染与 edge 类型视觉风格一致

### 6.4 `app/(main)/playground/family-tree/_components/edge-editor-drawer.tsx`

需要做的事：

1. 渲染 edge 类型选择
2. 渲染 label 输入框
3. 提供保存 / 取消按钮
4. 向父组件抛出 `onSubmit / onOpenChange`

### 6.5 `app/(main)/playground/family-tree/page.tsx`

需要做的事：

1. 接入 `onConnect`
2. 接入 `isValidConnection`
3. 在连接时根据 source 节点类型分流业务规则
4. 提供普通 edge 创建逻辑
5. 提供 marriage 特殊转译逻辑
6. 提供 edge 双击编辑入口
7. 提供 edge 保存回写逻辑

### 6.6 推荐新增的工具文件

建议新增：

- `app/(main)/playground/family-tree/_utils/edge-meta.ts`
- `app/(main)/playground/family-tree/_utils/create-marriage-structure.ts`

职责：

1. 关系类型元数据与默认 label 配置
2. marriage 结构工厂

---

## 7. 关键方法建议

### 7.1 创建普通 edge

建议页面层抽象为：

```ts
createRelationshipEdge(connection: Connection, viewMode: GraphViewMode)
```

职责：

1. 生成唯一 edge id
2. 填充默认 `relationshipType: "other"`
3. 写入当前视图 `views`

### 7.2 校验连接是否合法

建议页面层抽象为：

```ts
isRelationshipConnectionValid(connection: Connection): boolean
```

职责：

1. 判断 source / target 是否存在
2. 判断是否允许自连
3. 判断 source 节点若为 `marriageNode`，是否只能走 family / marriage 规则
4. 判断是否允许人物直接连 marriageNode

### 7.3 创建婚姻结构

建议使用纯函数：

```ts
createMarriageStructure({
  sourceNode,
  targetNode,
  viewMode,
})
```

输出：

1. `marriageNode`
2. 两条 `marriage` edge

### 7.4 打开 edge 编辑抽屉

建议页面层抽象为：

```ts
openEdgeEditor(edgeId: string)
submitEdgeEditor()
```

职责：

1. 找到目标 edge
2. 生成 `edgeFormDraft`
3. 打开抽屉
4. 提交后回写 edge 数据

---

## 8. 边界情况

### 8.1 新建 edge 时当前视图不同

建议规则：

1. 在 `family` 视图新建的 edge，默认 `views: ["family"]`
2. 在 `star` 视图新建的 edge，默认 `views: ["star"]`

不要自动同时写入双视图，避免用户在另一个视图看到意料之外的新关系。

### 8.2 label 为空

预期行为：

1. 若关系类型不是 `other`
2. 且用户未填 label
3. 则展示关系类型预设 label

### 8.3 `other` 类型且 label 为空

预期行为：

1. edge 仍然存在
2. 但不显示 label 标签

### 8.4 marriage 特殊结构

预期行为：

1. 人物到人物的 marriage 创建动作不会留下原始直连 edge
2. 页面最终呈现的是 marriageNode + 两条 marriage edge

### 8.5 双击 edge 编辑

预期行为：

1. 双击 edge 打开编辑抽屉
2. 保存后立即更新 edge 显示
3. 切换视图后不丢失

### 8.6 marriage 节点作为 source 的限制

预期行为：

1. 如果连接的 source 节点是 `marriageNode`
2. 则不允许创建非 family / marriage 语义的普通关系

建议第一版直接在 `isValidConnection` 中返回 `false`，而不是先创建再报错。

---

## 9. 推荐的实现顺序

建议实际开发时按这个顺序提交：

### 第一轮：连线底座

1. 接入 `onConnect`
2. 建立基于 source 节点类型的规则判断
3. 先完成普通 edge 最小新建闭环

### 第二轮：edge 编辑闭环

1. 接 edge 双击
2. 新增 `EdgeEditorDrawer`
3. 支持修改类型和 label

### 第三轮：默认 label 逻辑

1. 接关系类型元数据
2. 支持 label 回退展示

### 第四轮：marriage 特殊转译

1. 从 marriage 节点相关连接规则切入
2. 自动生成 marriage node + 两条 marriage edge

### 第五轮：补规则校验和双视图验证

1. 校验非法连接
2. 校验 family / star 视图下结果一致性

---

## 10. 验收标准

完成后应满足以下验收项：

1. 用户可以在图中创建一条新的普通 edge
2. 新建 edge 时默认类型为 `other`
3. 双击 edge 可以打开右侧编辑抽屉
4. 用户可以修改 edge 类型和 label
5. 除 `other` 外，label 留空时可显示预设 label
6. 从 `marriageNode` 发起的关系不能创建成非家族关系
7. 新建 marriage 且 target 为人物时，会自动转译成 marriageNode + 两条 edge
8. 切换 `family / star` 视图后，edge 结果仍然保持
9. 新增代码无 TypeScript 和 React Flow 运行时报错

---

## 11. 本次建议使用的工具与方法

### UI / 交互

1. React Flow
   - `onConnect`
   - `isValidConnection`
   - `onEdgeDoubleClick`
   - `Connection`

2. 项目现有 UI
   - `components/ui/drawer.tsx`
   - `components/ui/button.tsx`
   - 原生 `select / input`

### 工程方法

1. 页面层集中管理 edge 的创建和编辑
2. 节点组件只负责暴露带语义的 handle
3. 使用配置表集中管理关系类型元数据
4. 使用纯函数处理 marriage 特殊结构创建
5. 先做普通 edge 闭环，再补 marriage 特例

---

## 12. 结论

“关系 edge 功能”的正确切入点，不是直接打开 React Flow 的默认连线能力，而是先建立：

1. 可校验的 handle 语义
2. 可编辑的 edge 数据模型
3. 稳定的 edge 编辑抽屉
4. marriage 特殊结构转译

落地顺序应当是：

1. 先打通普通 edge 创建与编辑闭环
2. 再补默认 label 与关系类型配置
3. 最后单独实现 marriage 的结构化特殊规则

按这个顺序实现，可以避免一开始就在 marriage 逻辑上过度缠绕，也能最大化复用现有的人物编辑、节点状态和 `graphDraft` 数据流。

---

## 13. 下一阶段任务

基于当前已经完成的一版 edge 功能，下一阶段建议继续推进以下两个任务。

### 13.2 补齐第八项未覆盖能力

当前第八项功能还存在三块未完成内容：

1. 单击 edge 后，前端没有反馈
2. edge 删除
3. marriage 规则进一步收紧
4. 保存 / 加载与 edge 数据联动

#### 13.2.1 edge 删除

目标：

1. 用户可以删除一条已有 edge
2. 删除后画布立即更新
3. 如果右侧 edge 编辑抽屉正在编辑该 edge，需要同步关闭

建议方案：

1. 第一版优先复用 edge 选中态
2. 可在 edge label 附近或右侧抽屉内提供删除入口
3. 右键edge，弹出菜单，菜单包含“删除”选项
4. 页面层新增统一删除方法，例如：

```ts
deleteRelationshipEdge(edgeId: string)
```

需要同步处理：

1. 从 `graphDraft.edges` 中移除目标 edge
2. 清理 `selectedEdgeId`
3. 关闭 `edgeEditorState`
4. 重置 `edgeFormDraft`

需要额外注意：

1. 若删除的是 marriage 相关 edge，不要在这一轮顺手自动清理孤立 marriageNode，除非后续单独定义规则

#### 13.2.2 marriage 规则收紧

目标：

1. 把当前较宽松的 marriage 相关连接规则收紧到更符合家族图谱语义的状态

建议继续明确的规则包括：

1. `marriageNode -> person` 仅允许 `blood | adoption`
2. `person -> marriageNode` 不允许新建普通关系
3. `person -> person` 保存为 `marriage` 后，必须始终走结构化转译，不允许保留直连 marriage edge
4. 已经结构化生成的 marriage edge 不能改成非 marriage 类型

推荐做法：

1. 将 marriage 相关规则集中整理到一个独立判断层
2. 不要把规则散落在多个组件条件分支里
3. 对“允许连接”“允许保存”“允许修改类型”分别建立判断

验收标准：

1. marriage 相关非法关系不能被创建
2. marriage 相关非法编辑不能被保存
3. marriage 结构不会因为编辑而退化成混乱的直连 edge

#### 13.2.3 保存 / 加载联动

目标：

1. 第四项“保存功能”和第五项“加载功能”在落地时，edge 数据能完整参与导出与导入

需要覆盖的数据包括：

1. 普通 edge
2. marriage 结构生成的 edge
3. marriageNode 本身
4. edge 的 `relationshipType / label / description / views`

推荐关注点：

1. 导出后再次加载，edge 类型和展示标签是否保持
2. marriage 结构加载后是否仍能被正确识别为 marriageNode + 两条 edge
3. 已编辑但未自定义 label 的 edge，加载后是否还能继续回退到预设 label

推荐实施顺序：

1. 先定义保存文件中 edge 与 marriageNode 的数据格式
2. 再实现导出
3. 再实现加载恢复
4. 最后验证加载后的编辑、删除是否仍可继续工作

---

## 14. 下一阶段建议顺序

如果继续推进，推荐按下面顺序做：

1. 先完成“拖拽新建 edge”的强验证，确认当前实现底座成立
2. 再补 edge 删除，形成增删改闭环
3. 再收紧 marriage 规则，避免后续数据形态发散
4. （当前还没做保存 / 加载功能）最后接保存 / 加载联动，把当前 edge 能力接入完整数据流
