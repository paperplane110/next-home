---
date: 2026-07-02
source: docs/prd/family-tree/03-[plan]-feature-plan.md#5
reference: app/(main)/playground/family-tree/_data/family-tree-Personal-History-20260702-1156.json
---

# Family Tree 加载功能任务拆解

## 1. 目标

围绕 `03-[plan]-feature-plan.md` 的第 5 点“加载功能”，输出一份可以直接指导实现的任务拆解文档。

本阶段交付目标：

1. 用户点击右上角工具栏“加载”按钮后，可以从本地选择一个之前导出的 JSON 文件
2. 系统读取并校验该文件，成功后将其恢复为当前页面的工作状态
3. 恢复内容至少包括：
   - `graphDraft` 中的 nodes / edges
   - `meta`（书名、作者、简介）
   - `theme`（person category / edge relationship 的 label 与颜色映射）
   - `lastSavedAt`
4. 加载完成后，页面切换到一个稳定、可继续编辑的状态，不出现选中态残留或 drawer 残留

## 2. 输入基准

当前加载功能的输入格式，以这份真实导出文件为基准：

- `app/(main)/playground/family-tree/_data/family-tree-Personal-History-20260702-1156.json`

从该文件可以确认当前存档结构为：

1. 顶层包含 `schemaVersion / savedAt / meta / theme / graph`
2. `graph.nodes` 中同时存在：
   - `biographyPersonNode`
   - `marriageNode`
3. `graph.edges` 中保存的是 `customRelationEdge`
4. `theme.personCategory` 保存的是 `label + theme`
5. `theme.edgeRelationship` 保存的是 `label + style`

因此加载功能不能只恢复图数据，也要恢复外围配置。

## 3. 边界（明确不做）

1. 不做跨版本迁移器（本阶段仅支持 `schemaVersion: 1`）
2. 不做部分导入（要么整个文件加载成功，要么提示失败）
3. 不做 theme 的自动 merge 策略（当前优先以文件内 theme 为准）
4. 不做后端远程加载

## 4. 数据口径（加载什么）

### 4.1 主数据口径

加载成功后，页面主数据应直接替换为：

- `graphDraft = parsed.graph`

原因：

1. 当前页面所有编辑行为都以 `graphDraft` 为唯一真值
2. `viewGraph` 只是从 `graphDraft + viewMode` 派生，不应作为加载入口

### 4.2 外围状态口径

加载成功后还需要同步恢复：

1. `exportMeta`
2. `theme`
3. `lastSavedAt`
4. `isDirty = false`

同时需要主动清空这些 UI 状态：

1. `selectedPersonId`
2. `selectedEdgeId`
3. `edgeContextMenu`
4. `editorState`
5. `edgeEditorState`
6. `personFormDraft`
7. `edgeFormDraft`

目的：

1. 避免文件切换后还保留旧文件的选中态
2. 避免 drawer 指向已经不存在的节点或边

## 5. 文件格式与校验策略

### 5.1 格式

仍然是单文件 JSON（`.json`）。

加载流程建议：

1. 使用隐藏的 `<input type="file" accept="application/json,.json" />`
2. 用户点击“加载”按钮时触发文件选择
3. 通过 `File.text()` 读取内容
4. `JSON.parse()` 转成对象

### 5.2 基础校验

最低限度需要校验以下字段：

1. （不做限制，这个不校验）`schemaVersion === 1`
2. `savedAt` 为字符串
3. `meta` 存在，且至少包含 `bookTitle / author / description`
4. `theme.personCategory` 存在
5. `theme.edgeRelationship` 存在
6. `graph.nodes` 是数组
7. `graph.edges` 是数组

### 5.3 图数据校验

建议补充这些结构性校验：

1. 所有 node 必须有 `id / type / position / data`
2. 所有 edge 必须有 `id / source / target / type / data`
3. edge 的 `source / target` 必须都能在 `graph.nodes` 中找到
4. `marriageNode.data.husbandId / wifeId` 应为字符串
5. `biographyPersonNode.data.category` 应在允许枚举里
6. `edge.data.relationshipType` 应在允许枚举里

### 5.4 校验失败的处理

校验失败时：

1. 不修改当前页面任何状态
2. 给出明确错误提示
3. 错误提示优先面向用户可理解，例如：
   - “文件格式不正确”
   - “暂不支持该版本的存档”
   - “图谱数据缺少必要字段”

## 6. UI / 交互拆解

### 6.1 工具栏按钮行为

1. 将“加载”按钮从禁用占位态切换为可点击
2. 点击后打开系统文件选择器
3. 选中合法文件后，替换当前页面内容
4. 加载成功后 tooltip 可显示：
   - “从本地加载”
   - 若需要，也可补充“当前文件保存于 xx 前”

### 6.2 冲突策略

当前页面可能存在未保存改动，因此需要先定一个策略。

建议本阶段使用最简单的明确策略：

1. 若 `isDirty === false`：直接加载
2. 若 `isDirty === true`：先弹出 `confirm` 二次确认
   - “当前有未保存改动，继续加载会覆盖当前内容，是否继续？”

这样可以避免用户误覆盖当前工作区。

## 7. 代码任务拆解（按实现顺序）

### 7.1 定义导入类型与解析函数

1. 复用保存阶段的 `FamilyTreeExportFile` 类型
2. 新增 `parseFamilyTreeImportFile(rawText)`：
   - `JSON.parse`
   - 顶层字段校验
   - graph 结构校验
   - 返回强类型结果或抛出错误

验收点：

1. 合法 JSON 文件能正常解析
2. 非法 JSON / 缺字段文件会抛出可识别错误

### 7.2 页面层接入文件选择器

1. 在 `page.tsx` 中放置隐藏 file input
2. “加载”按钮点击时触发 `input.click()`
3. `onChange` 时读取文件文本并调用解析函数

验收点：

1. 点击按钮能打开系统选择器
2. 重复选择同一文件也能触发加载（需要重置 input value）

### 7.3 应用导入结果

1. 成功后写入：
   - `graphDraft`
   - `exportMeta`
   - `theme`
   - `lastSavedAt`
2. 重置：
   - `selectedPersonId = ""`
   - `selectedEdgeId = null`
   - `edgeContextMenu = null`
   - 两个 drawer 关闭
   - 两份 form draft 重置
   - `isDirty = false`

验收点：

1. 加载后画布能正确显示节点与边
2. 不出现旧文件选中态残留

### 7.4 与现有保存链路打通

1. 确保“加载后立即再保存”生成的文件结构仍与当前 schema 一致
2. 确保 theme / meta 在加载后会进入新的保存文件

验收点：

1. 加载 sample 文件后立刻点击保存，得到的 JSON 仍可再次加载

## 8. 测试与验证清单

1. 使用 `family-tree-Personal-History-20260702-1156.json` 进行加载，页面应能完整恢复
2. family / star 两个视图切换正常
3. 加载后继续新增节点、编辑节点、删除 edge，功能不受影响
4. 加载后立即保存，导出 JSON 结构完整
5. 选择非 JSON 文件时，应提示失败且不污染当前状态
6. 选择缺少 `graph` 的错误 JSON 时，应提示失败且不污染当前状态
7. 当前有未保存改动时，点击加载应先确认

## 9. 风险与注意点

1. 当前主题配置在代码里已有默认值；加载功能接入后，需要明确“运行时显示是否立即受导入 theme 影响”
   1. 主题完全采用导入的 theme 配置，不使用默认值
2. `position` 与 `viewMeta.*.position` 同时存在，加载阶段建议原样接受，不在此处做重算
3. 如果导入文件中的节点/边类型超出当前代码支持范围，应直接报错，不做 silent fallback
4. 隐藏 file input 的值需要在每次处理后清空，否则同一文件重复选择可能不会触发 `change`


---

Polish

- [x] 若当前有修改未保存，提示用户是否确认加载，使用 shadcn `AlertDialog`
- [x] 样式太简单了，title 部分加个警告 icon，整体是居中布局。文案精简一下
