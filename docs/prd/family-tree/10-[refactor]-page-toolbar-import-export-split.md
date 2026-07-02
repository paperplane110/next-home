---
date: 2026-07-02
source: app/(main)/playground/family-tree/page.tsx
related:
  - docs/prd/family-tree/08-[plan]-save-task-breakdown.md
  - docs/prd/family-tree/09-[plan]-load-task-breakdown.md
---

# Family Tree Page / Toolbar / Import Export Refactor

## 1. 目标

当前 `family-tree/page.tsx` 已经承载了：

1. 图谱主状态
2. 节点与边的交互逻辑
3. 工具栏 UI
4. 保存 / 加载流程
5. 加载前确认弹窗

随着保存和加载功能接入，`page.tsx` 已经开始变得臃肿。本次 refactor 的目标不是“把逻辑都搬走”，而是重新划分职责边界，让页面结构更清晰，同时保留当前的状态控制方式。

## 2. 重构原则

本次重构遵循你确认的三条原则：

1. `page.tsx` 继续持有 `graphDraft / isDirty / meta / theme / selected*` 等真状态
2. 把“工具栏 UI”和“加载确认 UI”抽成组件
3. 把“导入 / 导出流程函数”抽成 hook 或 utils

这三条里，最重要的是第一条：

- 页面层保留状态真值
- 组件层只承接展示与触发
- hook / utils 只承接流程和纯函数，不接管页面控制权

## 3. 不做什么

为了避免重构范围膨胀，本次 refactor 明确不做以下事情：

1. 不把 `graphDraft`、`selectedPersonId`、`selectedEdgeId` 等状态迁移到 context 或 store
2. 不把节点/边编辑逻辑从 `page.tsx` 中整体搬走
3. 不把 `ReactFlow` 画布主渲染层拆出为独立页面容器组件
4. 不借这次机会重写保存 / 加载协议

## 4. 推荐拆分方案

### 4.1 保留在 `page.tsx` 的内容

以下内容继续留在页面层：

1. `graphDraft`
2. `viewMode`
3. `exportMeta`
4. `personCategoryMeta`
5. `edgeRelationshipMeta`
6. `isDirty`
7. `lastSavedAt`
8. `selectedPersonId`
9. `selectedEdgeId`
10. `editorState`
11. `edgeEditorState`
12. 所有真正修改页面状态的回调

例如：

1. `handleDeletePerson`
2. `handleDeleteRelationshipEdge`
3. `handleSubmitPersonEditor`
4. `handleSubmitEdgeEditor`
5. `applyImportedFile`

原因：

1. 这些逻辑直接决定图谱数据的真实变化
2. 如果抽到组件层，后面会出现 props 层层透传与职责反转
3. 这不符合当前项目“状态尽量留在页面层”的约定

### 4.2 抽成组件的内容

#### A. `CanvasToolbar`

职责：

1. 负责右上角工具栏整体布局
2. 负责排列视图切换、保存、加载三个按钮
3. 不持有任何业务真状态，只接收 props

建议 props：

```ts
type CanvasToolbarProps = {
  viewMode: GraphViewMode;
  viewSwitchLabel: string;
  isDirty: boolean;
  lastSavedAt: string | null;
  nowTick: number;
  onToggleView: () => void;
  onSave: () => void;
  onLoad: () => void;
};
```

#### B. `LoadGraphButton`

职责：

1. 只负责“加载”图标按钮本身
2. 负责 tooltip 文案展示
3. 不负责文件解析，也不负责确认弹窗状态

建议 props：

```ts
type LoadGraphButtonProps = {
  isDirty: boolean;
  onClick: () => void;
};
```

#### C. `ConfirmLoadDialog`

职责：

1. 只负责加载前确认弹窗 UI
2. 接收受控的 `open`
3. 通过 `onConfirm` 把确认结果回传给页面层

建议 props：

```ts
type ConfirmLoadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};
```

### 4.3 抽成 hook / utils 的内容

#### A. `useFamilyTreeImportExport`

这个 hook 适合承接“保存 / 加载的流程编排”，但不持有主状态。

它更像一个“控制器层”，而不是状态源。

适合放进去的内容：

1. `handleSaveToLocal`
2. `handleImportFileChange`
3. `handleLoadFromLocal`
4. `handleConfirmLoadFromLocal`
5. `importFileInputRef`
6. `isLoadConfirmOpen`

但 hook 不应该内部维护 `graphDraft`，而是通过参数接收：

1. 当前页面状态快照
2. 页面层提供的 `applyImportedFile`
3. 页面层提供的 `resetTransientUiState` 或等价回调

如果觉得 hook 仍然偏重，也可以先只做 utils，不急着抽 hook。

#### B. 继续放在 utils 的内容

以下内容继续保留在 `export-file.ts` 等 utils 中：

1. `createFamilyTreeExportFile`
2. `downloadJsonFile`
3. `parseFamilyTreeImportFile`
4. schema 校验
5. graph sanitize

@audit: export-file.ts 内为什么要有 import 解析的函数？

原因：

1. 它们本质上是纯函数
2. 与 React 生命周期无关
3. 最适合复用和测试

## 5. 推荐落地顺序

建议按最小风险顺序拆：

### 第一步：先抽纯 UI

先抽：

1. `ConfirmLoadDialog`
2. `LoadGraphButton`

收益：

1. 立刻减轻 `page.tsx` 视觉体积
2. 风险最低
3. 不影响主状态归属

### 第二步：再抽工具栏容器

抽出：

1. `CanvasToolbar`

收益：

1. 右上角工具栏区域整体收口
2. 保存/加载/视图切换的视觉结构不再挤在 page 内

### 第三步：视情况决定是否抽 hook

如果 `page.tsx` 在完成前两步后仍然过重，再补：

1. `useFamilyTreeImportExport`

否则可以先不做，避免为了“好看”而制造新的抽象层。

## 6. 推荐文件结构

建议新增这些文件：

```txt
app/(main)/playground/family-tree/
  _components/
    canvas-toolbar.tsx
    load-graph-button.tsx
    confirm-load-dialog.tsx
  _hooks/
    use-family-tree-import-export.ts
```

说明：

1. `_components` 放纯展示组件
2. `_hooks` 放流程编排
3. `_utils` 继续保留纯函数与 schema 相关逻辑

## 7. 验收标准

本次 refactor 完成后，应满足：

1. `page.tsx` 不再直接内联 `AlertDialog` JSX
2. `page.tsx` 不再直接内联右上角工具栏的完整结构
3. `graphDraft / isDirty / meta / theme / selected*` 仍由 `page.tsx` 持有
4. 保存 / 加载功能行为不变
5. 加载前确认、文件选择、导入恢复、tooltip 文案均不回归

## 8. 一句话结论

这次 refactor 的核心不是“把功能搬出 page”，而是：

- 页面层继续掌控状态真值
- 组件层接管 UI 结构
- hook / utils 接管流程和纯函数

这是当前 family-tree 页面最稳妥、也最符合项目约定的拆法。

