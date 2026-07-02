---
date: 2026-07-02
source: docs/prd/family-tree/03-[plan]-feature-plan.md#4
---

# Family Tree 保存功能任务拆解

## 1. 目标

围绕 `03-[plan]-feature-plan.md` 的第 4 点“保存功能”，输出一份可以直接指导实现的任务拆解文档。

本阶段交付目标：

1. 用户点击右上角工具栏“保存”按钮后，可将当前画布内容导出到本地文件
2. 导出的内容包含：
   - node / edge 数据（以 `graphDraft` 为准）
   - 书籍 meta（标题、作者、简要描述）
   - person category 对应的 label / 颜色关系
   - edge relationshipType 对应的 label / 颜色关系
3. 文件带版本号与保存时间，便于后续兼容升级
4. 不引入后端；保存仅面向本地文件（下载）

## 2. 边界（明确不做）

1. 不做加载（第 5 点另起任务拆解）
2. 不做多人协作/云同步
3. 不做“自动推导配色对应关系”的逻辑（配色对应由用户维护，保存时只是把当前配置写入文件）
4. 不做复杂的撤销/回退（对应第 3 点的后续项）

## 3. 数据口径（保存谁）

### 3.1 源数据口径

保存的主数据以页面内的可编辑状态 `graphDraft: GraphDataset` 为准。

原因：

1. `graphDraft` 是当前编辑行为的唯一真值来源
2. 视图层 `viewGraph` 会对数据做过滤/投影（例如只显示某视图相关的边），不适合作为保存口径

### 3.2 需要剥离的运行时字段

保存前需要对节点数据做一次净化（避免把运行时注入字段写入文件）：

1. `BiographyPersonData.actions`（运行时注入回调，不可序列化，也不应出现在存档中）
2. 任何可能在未来注入的“仅 UI 层使用”的字段（以 `data` 上的函数/DOM 引用为判定标准）

## 4. 文件格式与 Schema

### 4.1 格式选择

建议：单文件 JSON（`.json`），原因：

1. 可读、可 diff、便于手动修复
2. 作为 demo 阶段存档足够稳定
3. 便于后续迁移与兼容（加 `version`）

### 4.2 Schema（建议）

建议定义一个独立的导出结构 `FamilyTreeExportFile`（与运行时 `GraphDataset` 解耦）：

```ts
type FamilyTreeExportFile = {
  schemaVersion: 1;
  savedAt: string; // ISO
  meta: {
    bookTitle: string;
    author: string;
    description: string;
  };
  theme: {
    personCategory: Record<string, { label: string; color: string }>;
    edgeRelationship: Record<string, { label: string; color: string }>;
  };
  graph: {
    nodes: Array<{
      id: string;
      type: "biographyPersonNode" | "marriageNode";
      position: { x: number; y: number };
      data: unknown;
    }>;
    edges: Array<{
      id: string;
      type: "customRelationEdge";
      source: string;
      target: string;
      sourceHandle?: string | null;
      targetHandle?: string | null;
      data: unknown;
    }>;
  };
};
```

说明：

1. `theme.*.color` 的表达方式需在实现时确定：是 hex
2. `data` 保持原始结构（只做“剥离运行时字段”），以降低迁移成本

## 5. UI / 交互拆解

### 5.1 工具栏按钮行为

1. 将“保存”按钮从禁用占位态切换为可点击
2. 点击后立即下载一个文件（无需弹窗）
3. 下载成功后，页面左上角标题栏（第 7 点）可显示：
   - “已保存”
   - 最近保存时间

### 5.2 文件命名策略

1. `family-tree-{bookTitle}-{YYYYMMDD-HHmm}.json`

## 6. 代码任务拆解（按实现顺序）

### 6.1 定义导出类型与净化函数

1. 定义 `FamilyTreeExportFile` 类型（放在 `family-tree/_types` 或 `family-tree/_utils`）
2. 实现 `sanitizeGraphDraftForExport(graphDraft)`：
   - 深拷贝（避免直接改动页面状态对象）
   - 删除 `biographyPersonNode.data.actions`
   - 确保没有函数类型字段（遇到函数则删除或置空）

验收点：

1. `JSON.stringify(result)` 不抛异常
2. 导出结构不包含 `actions`

### 6.2 组装导出 payload

1. 在页面层维护 `meta` 状态（bookTitle/author/description）
2. 在页面层维护 `theme` 状态（category/edge 的 label&color）
3. 组装 `FamilyTreeExportFile`：
   - `schemaVersion`
   - `savedAt`
   - `meta`
   - `theme`
   - `graph: sanitizeGraphDraftForExport(graphDraft)`

验收点：

1. 导出 JSON 中包含完整 `meta/theme/graph`
2. 在任意视图（family/star）保存时内容一致（因为口径是 graphDraft）

### 6.3 触发浏览器下载

1. 采用 `Blob` + `URL.createObjectURL` + `<a download>` 触发下载
2. 下载后执行 `URL.revokeObjectURL`

验收点：

1. Chrome / Safari 下均能下载
2. 下载文件名符合预期

### 6.4 写回“保存状态”

1. 保存成功后更新 `lastSavedAt`
2. 提供一个 `dirty` 状态：
   - 任意节点/边/元信息变更 -> dirty = true
   - 保存成功 -> dirty = false

验收点：

1. 标题栏能展示“未保存（浅灰色）/已保存（绿色）”
2. 保存后时间更新

## 7. 测试与验证清单

1. 新建/编辑/删除人物后保存，导出文件能体现最新节点与边
2. 新建/编辑/删除 edge 后保存，导出文件能体现最新关系与 label/description
3. 删除人物导致婚姻节点被清理后保存，导出文件中不包含孤立 `marriageNode`
4. 导出 JSON 可被 `JSON.parse` 正常解析（人工验证即可）
5. 导出文件不包含 `actions` 字段

## 8. 风险与注意点

1. 视图层 nodes/edges 与 `graphDraft` 是两套集合：保存必须坚持 `graphDraft` 口径
2. `position` 与 `viewMeta.*.position` 同时存在：保存时应原样保存，加载阶段再决定“哪个是真值来源”
3. `theme` 的字段结构需要尽早确定，否则会影响后续加载与 UI 展示

---

fix

- [x] 下载按钮点击后，不要进入 active 状态（也就是背景是黑色的状态）
- [x] 下载按钮 hover 时，显示距离上次保存的时间
  - 10 秒内未保存，显示“几秒前”
  - 10 秒以上，显示“xx 秒前”
  - 1 分钟以上，显示“xx 分钟前”
  - 1 小时以上，显示“xx 小时前”
  - 1 天以上，显示“xx 天前”
- [x] 每次拖动节点后，更新 `graphDraft` 中 “对应视图” 的 `position` 字段

reverted

- `person node，view 没有 family 的节点不应该出现在 family view 中`
- 该项已回退，当前保留原有 `buildViewGraph()` 逻辑，不纳入本轮 save 功能开发结果
