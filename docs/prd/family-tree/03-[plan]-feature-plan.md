---
date: 2026-7-1
priority: @p1, @p2 ...
---

# 功能开发计划



## 1. 新增节点功能

- [x] 在画布双击时，新增一个节点
- [x] 这个节点先是空白的默认人物节点
- [x] 同时右侧弹出 sheet，sheet 内部是“新增人物”的表单
- [x] 用户可以在表单中输入人物的姓名、性别、出生日期、死亡日期等信息
- [x] 新增完成后，表单会关闭，节点更新，显示在画布上
- [ ] 监听快捷键，cmd + n 就是新建节点。兼容 win 的快捷键 ctrl + n

## 2. 节点编辑功能

- [x] 选中一个节点后，会在其右上角显示一个两个 icon 大小的按钮，编辑和删除
- [x] 用户可以点击编辑按钮后，右侧会弹出 sheet
- [x] 用户可以在 sheet 中编辑人物的姓名、性别、出生日期、死亡日期等信息
- [x] 编辑完成后，sheet 会关闭，节点更新，显示在画布上
- [x] 快捷键支持，修改/新建完成后，按 enter 键确认
- [x] 快捷键支持，按 esc 键取消编辑/新建
- [x] 在对应按钮上添加 kbd 组件，提示快捷键

## 3. 节点删除功能

- [x] 选中一个节点后，会在其右上角显示一个两个 icon 大小的按钮，编辑和删除
- [x] 用户可以点击删除按钮后，节点会从画布上移除
- [x] 同时右侧会关闭 sheet
- [ ] （后续实现）节点删除后，内容缓存，支持回退
- [ ] 快捷键支持：选中节点后，按 backspace 删除节点，同时关闭 sheet

## 4. 保存功能

- [x] 用户可以在画布上点击“保存”按钮，将当前画布内容保存到本地
  - [x] 不仅包含 node、edge 信息
  - [x] 还包括 meta info，比如这本书的标题、作者、简要描述等
  - [x] person category 对应label、颜色的关系
  - [x] edge category 对应label、颜色的关系
  - [x] 请选择合适的文件格式

## 5. 加载功能

- [x] 用户可以在画布上点击“加载”按钮，从本地加载保存的画布内容

## 6. 画布的 tool list

- [x] tool list 是一个长方形的，只包含 icon 图标的工具栏
- [x] 它位于画布右上角
- [x] 它有以下功能按钮：
  - [x] 保存，保存到本地
  - [x] 加载，从本地加载保存的画布内容
- [x] 当鼠标hover到 icon 时，显示对应的tooltip提示信息
  - [x] tooltip 位置在 icon 上方，现在被下面的人物 drawer 挡住了
  - [x] tooltip 样式改为浅色
  - [x] tooltip 从 page 解耦，抽取出来作为组件
- [ ] 给一些按钮添加快捷键提示，参考：https://ui.shadcn.com/docs/components/radix/tooltip#with-keyboard-shortcut

### 6.1 视图切换功能
- [x] family-tree 视图时，lucide network 的图标
- [x] social 视图时，显示一个合适的图标

## 7. 左上角的标题栏

- [ ] 新增一行不显眼的小字，显示是否保存的状态，以及上次改动时间

## 8. 关系 edge

- [x] 允许新建edge，初次新建的时候默认为 other 且没有 label
- [x] 双击 edge 时，弹出 sheet，用户可以在 sheet 中编辑 edge 的类型和 label
- [x] edge 的类型，除了 other 外，应该预设一个 label，如果用户 label 留空，就可以使用预设的那个
- [x] 编辑完成后，sheet 会关闭，edge 更新，显示在画布上
- [x] marriage source handle 开始的 edge ，只能是家族关系，不能是其他关系

特殊情况
- [x] 当新建的 edge 为 marriage 时，如果 target 是个 person， 那么做以下几件事
- [x] 新增一个 marriage 节点 横向位置为 source 和 target 的中间位置，纵坐标为 source 和 target 两者 max + 24px
- [x] 新增一个 edge，从 source 到 marriage 节点
- [x] 新增一个 edge，target 的 source handle 到 marriage 节点

快捷键
- [x] 选中 edge 后，按 backspace 删除 edge
- [x] 右键后展示的 menu 中，“删除”文字后加上 ⌫ 图标，并使用 Kbd 组件

## 9. 框选功能


## 99. 细节

person node
- [x] person-node editor 存在问题
  - 出生日期、死亡日期无法设置更新
  - 无法打 badges
- [ ] 更加方便输入英文名的功能：自动补全？
  - [ ] 或者根据父亲的英文名，自动补全当前节点的姓氏
- [ ] 更轻量化的交互，现在填写节点信息主要靠的是 form
  - [ ] 姓名的修改直接在node中，
  - [ ] 其他功能考虑做成一个出现在 node 下方条形的 tool bar
    - [ ] 像性别就可以用 icon button 来解决
    - [ ] category 可以显示一个 badge，hover 后出现 select menu ，用户可以选择不同的 category
    - [ ] badge 的添加/删除/修改

node
- [ ] 更加方便对齐 node 的功能，比如node的移动按照合适的刻度来移动，而不是任意位置
- [ ] 新增右键node弹出 menu 功能
  - [ ] menu分为三个区域
    - [ ] 编辑
    - [ ] 层次：向上一层、向下一层、最上层、最下层
    - [ ] 删除
- [ ] handle 的 source 和 target 似乎不用区分，因为本身并非 有方向 的图
- [ ] handle只允许两个点，是不是太少了。
  - [ ] source handle 有四个，分别是上、下、左、右
  - [ ] target handle 有四个，分别是上、下、左、右；同时包括动态handle，根据新建edge时拖拽的位置，生成对应的 target handle

- [ ] 在family视图下建立的person node 默认 category 为 family
- [ ] 在family视图下建立的 edge 默认为 blood 关系

画布
- [ ] 左键单击后拖动，进行框选 node
