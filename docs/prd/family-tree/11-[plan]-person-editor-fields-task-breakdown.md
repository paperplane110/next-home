---
date: 2026-07-02
source: docs/prd/family-tree/03-[plan]-feature-plan.md#L94-L96
reference:
  - app/(main)/playground/family-tree/_components/person-editor-drawer.tsx
  - app/(main)/playground/family-tree/_types/graph.ts
  - app/(main)/playground/family-tree/_utils/person-form.ts
---

# Family Tree 人物编辑器字段修复任务拆解

## 1. 目标

围绕 `03-[plan]-feature-plan.md` 中这两条遗留问题，输出一份可直接指导实现的拆解文档：

1. 修复“出生日期、死亡日期无法设置更新”
2. 修复“无法打 badges”

本次改动的目标口径：

1. 日期输入不再要求完整年月日，统一按“年份”精度处理
2. badges 支持新增、删除、修改
3. 使用一个适合“自由录入标签”的组件，而不是继续堆普通 input
4. 尽量复用现有显示链路，不改动 node / sidebar 已经可用的 badges 展示

## 2. 当前问题定位

结合当前代码，问题主要集中在“表单层”而不是“展示层”：

1. `person-editor-drawer.tsx` 目前使用的是 `<Input type="date" />`
   - 浏览器要求完整日期字符串
   - 与当前人物数据更常见的“只有年份”口径不匹配
   - 这也是“无法稳定设置更新”的高风险来源
2. `BiographyPersonData` 已经支持 `badges?: string[]`
3. 但 `PersonFormDraft` 目前没有 `badges`
4. `createPersonFormDraft / sanitizePersonDraft / mergePersonDraftIntoNode` 也没有 badges 的读写链路
5. `person-node.tsx` 和 `sidebar-drawer.tsx` 已经能正确渲染 badges

结论：

1. 显示层基本不用重做
2. 需要补的是“草稿结构 + 编辑组件 + 提交流程 + 键盘交互”

## 3. 范围边界

### 3.1 本次要做

1. 人物表单里的出生年份、死亡年份输入
2. badges 的新增、删除、修改
3. 相关草稿、清洗、提交逻辑补齐
4. 处理 badges 输入与全局 `Enter` 保存快捷键之间的冲突

### 3.2 本次不做

1. 不做完整年月日选择器
2. 不做跨语言、跨页面复用的全局标签系统
3. 不做 badges 预置词库或远程联想
4. 不改导出 schema，仍然沿用 `BiographyPersonData.badges?: string[]`

## 4. 日期字段方案

### 4.1 数据口径

日期字段本阶段统一按“年份字符串”处理：

1. `birthDate` 保存为年份字符串，如 `1917`
2. `deathDate` 保存为年份字符串，如 `2001`
3. 未填写时保存为空字符串，合并入 node 时再转成 `undefined`
4. `birthDeath` 继续沿用 `buildBirthDeathLabel()` 生成，不额外引入新字段

### 4.2 兼容旧数据

虽然当前数据源里主要依赖 `birthDeath` 展示，但后续导入文件或旧数据里可能已经存在完整日期字符串，因此草稿初始化阶段需要兼容：

1. 若读到 `1917-06-10` 这类值，表单里应归一化为 `1917`
2. 若读到已经是 `1917`，则原样回填
3. 若读到空值，则回填为空

建议新增一个轻量辅助函数，例如：

1. `normalizeYearValue(raw?: string): string`

职责仅限于：

1. 提取可用年份
2. 屏蔽完整日期格式带来的回填问题

### 4.3 UI 方案

不再使用 `type="date"`，改为更贴合当前场景的“年份输入”：

1. 保持两列布局不变
2. 使用普通 `Input`
3. 搭配：
   - `inputMode="numeric"`
   - `placeholder="例如：1917"`
   - `maxLength`
4. 在 label 或说明文案里明确“仅需填写年份”

这样做的原因：

1. HTML 原生 date input 强制要求完整日期
2. 目前人物资料通常只掌握年份
3. 年份输入更符合家庭树的资料录入心智模型

### 4.4 校验与清洗

年份字段建议采用“宽进严出”的策略：

1. 输入阶段允许用户编辑纯文本数字
2. 提交阶段统一 trim
3. 最终只保留可识别年份
4. 空值转为 `undefined`

本阶段建议先约束为：

1. 空字符串
2. 1 到 4 位数字字符串

@audit 公元前的怎么办？

不需要在本阶段引入复杂日期校验器。

## 5. Badges 编辑方案

### 5.1 组件选型

`badges` 更适合“自由录入标签编辑器”，不适合直接套用固定枚举型 `MultiSelect`。

原因：

1. 这里的 badges 不是预定义选项集合
2. 用户需要临时输入任意文本
3. “新增”和“修改”都要求有更直接的 tag-editing 体验

因此建议新增一个局部组件，例如：

1. `person-badges-input.tsx`

组件职责：

1. 展示当前已添加的 badge 列表
2. 支持输入新 badge
3. 支持删除已有 badge
4. 支持点击已有 badge 进入编辑

实现建议：

1. 视觉层复用 shadcn `Badge`
2. 输入层复用现有 `Input`
3. 删除动作使用小型 icon button 或 badge 内嵌 close affordance

也就是说，这里更合适的是“Badge + Input 组合组件”，而不是“下拉选择组件”。

### 5.2 交互定义

建议的交互口径如下：

1. 输入框中输入文本，按 `Enter` 或分隔符后新增 badge
2. 空白文本不新增
3. 前后空格自动 trim
4. 重复 badge 不重复写入
5. 点击某个 badge 可进入编辑态
6. 编辑完成后按 `Enter` 保存修改
7. 点击 badge 上的删除按钮可移除该项

可选增强，但不是必须项：

1. 输入框为空时按 `Backspace`，删除最后一个 badge

### 5.3 草稿状态建议

建议把“已提交的 badges”与“输入过程中的临时文本”分开：

1. `PersonFormDraft` 中新增 `badges: string[]`
2. 组件内部再维护一个局部 `pendingBadge` 文本状态
3. 如需支持编辑态，可再维护 `editingBadgeIndex`

这样做的好处：

1. 页面层仍然只持有真正要提交的 form draft
2. 输入过程中的临时光标状态不污染页面主状态
3. 逻辑边界清晰，后续更容易抽复用组件

## 6. 键盘交互约束

这是这次实现里最需要提前明确的一点。

当前页面层已经有全局快捷键：

1. `Enter` 保存人物表单
2. `Esc` 关闭 drawer

如果 badges 输入框也直接用 `Enter` 新增标签，就会与全局保存逻辑冲突。

### 6.1 建议处理方式

1. badges 输入框在有待提交文本时，`Enter` 应优先用于“确认 badge”
2. 该次按键不应继续触发页面层的“保存人物”
3. 只有在 badges 输入框为空时，才允许用户继续使用全局 `Enter` 提交整份表单

### 6.2 实现口径

建议双保险处理：

1. 在 badges 输入组件内部拦截 `Enter`
2. 同时给输入框加一个可识别标记，例如 `data-person-badge-input`
3. 页面层 `handleKeyDown` 在处理人物表单 `Enter` 时，对该输入框做额外分支判断

目的：

1. 避免“想新增 badge，却把整个 drawer 提交了”
2. 保持现有 `Enter / Esc` 快捷键体验不退化

## 7. 数据结构与代码任务拆解

### 7.1 扩展人物草稿类型

涉及文件：

1. `_types/graph.ts`

任务：

1. 给 `PersonFormDraft` 新增 `badges: string[]`

验收点：

1. 人物草稿结构能够完整表达 badges
2. 不再出现“底层 node 数据有 badges，但表单层没有入口”的断层

### 7.2 补齐人物表单工具函数

涉及文件：

1. `_utils/person-form.ts`

任务：

1. `createPersonFormDraft()` 回填 `badges`
2. 初始化日期草稿时做年份归一化
3. `sanitizePersonDraft()` 补上 badges 清洗
4. `mergePersonDraftIntoNode()` 把 badges 正确写回 node
5. 继续同步生成 `birthDeath`

建议补充的清洗规则：

1. badges 全部 trim
2. 去掉空字符串
3. 去重
4. 保持原有顺序

验收点：

1. 编辑已有人物时，badges 能正确回填
2. 提交后 node.data.badges 正确更新
3. `birthDeath` 仍能正确联动更新

### 7.3 重构人物编辑表单字段

涉及文件：

1. `_components/person-editor-drawer.tsx`

任务：

1. 将出生日期、死亡日期从 `type="date"` 改为年份输入
2. 增加 badges 字段区
3. 为年份输入补充清晰 placeholder / hint
4. 保持现有按钮区与 `Kbd` 提示风格一致

验收点：

1. 用户可以直接输入年份并保存
2. 创建态和编辑态都能正常使用
3. 原有 `Enter / Esc` 提示不失真

### 7.4 新增 badges 专用编辑组件

涉及文件：

1. 新增 `_components/person-badges-input.tsx`

建议组件职责：

1. 接收 `value: string[]`
2. 接收 `onChange(nextBadges: string[])`
3. 内部管理 `pendingBadge`
4. 支持新增、删除、编辑

验收点：

1. 新增 badge 流程顺畅
2. 删除 badge 简单直接
3. 修改 badge 不需要用户手动删掉后重输整组数据

### 7.5 调整页面级快捷键兼容

涉及文件：

1. `page.tsx`

任务：

1. 保持现有人物表单 `Enter` 保存能力
2. 为 badges 输入场景让出优先级
3. 避免 badges 输入时误触发表单提交

验收点：

1. badges 输入框聚焦且有文本时，按 `Enter` 只新增 badge
2. badges 输入框为空时，按 `Enter` 仍可保存整份表单
3. `Esc` 关闭 drawer 的行为不受影响

## 8. 验收清单

1. 新建人物时可以填写出生年份、死亡年份并成功保存
2. 编辑人物时可以修改已有年份并成功覆盖旧值
3. 若旧数据里日期是完整字符串，进入编辑表单后会被正常归一化为年份
4. 可以新增多个 badges
5. 可以删除某个 badge
6. 可以修改某个 badge
7. 重复 badge 不会被重复写入
8. 提交后人物节点卡片上的 badges 正确显示
9. 提交后右侧详情面板中的 badges 正确显示
10. badges 输入过程不会误触发全局 `Enter` 保存

## 9. 风险与注意点

1. 当前 `Enter` 是页面层全局监听，badges 输入如果不专门处理，极易再次引发键盘冲突
2. 年份字段从“完整日期输入”改成“年份输入”后，草稿初始化必须兼容旧值格式
3. badges 的“修改”不能只做“新增 + 删除”，否则交互会显得笨重，建议明确一个轻量编辑态
4. `person-node` 和 `sidebar-drawer` 已经能渲染 badges，因此实现时应优先补齐数据链路，而不是重复改显示层

## 10. 建议实现顺序

1. 先改 `PersonFormDraft` 与 `person-form.ts`
2. 再新增 `person-badges-input.tsx`
3. 再改 `person-editor-drawer.tsx`
4. 最后补 `page.tsx` 的键盘兼容处理

这样可以先把数据链路打通，再处理 UI 和交互细节，回归验证成本最低。

---

bug
- drawer 的 scroll 事件被外部劫持了？无法滚动 drawer 内的长内容。（可能和我使用 Lenis 滚动库有关）
- badges 交互需要改进
  - 取消编辑图标，改为点击 badge，就认为是在编辑该 badge
  - 当前无法取消编辑状态的 badges。所以当正在编辑一个 badge 时，再次点击这个badge/或 esc，则退出这个 badge 的编辑状态
  - 取消删除图标，在 badge 的右上角，新增一个小型的删除图标，圆形
- 当打开 drawer 时，自动 focus 到 name input，并全选姓名
- 更新一下保存的快捷键，改为 ⌘ + Enter，避免和 input 的 Enter 冲突
  - 同时更新一下 edge 的保存快捷键，改为 ⌘ + Enter