# 改进意见

## 样式相关

## Page Feedback: /playground/family-tree
**Viewport:** 1440×778

### 1. text [10px]
**Location:** .react-flow > .react-flow > .max-w-[320px] > .text-[10px]
**Feedback:** 去掉这个

### 2. text base
**Location:** .react-flow > .react-flow > .max-w-[320px] > .mt-1
**Feedback:** 这里展示图表名称：Personal History - Family

### 3. react flow
**Location:** .absolute > .react-flow > .react-flow > .react-flow
**Feedback:** 画布的背景 从纯色改成 dotted

### 4. section flex
**Location:** .neon-auth-ui > .section
**Feedback:** footer  上面的 margin 取消掉，直接和画布相接。但是尽量不修改 footer，因为会影响太多其他页面

### 5. icon
**Location:** .absolute > .react-flow > .react-flow > svg
**Feedback:** 不要 minimap

### 6. flex flex
**Location:** .react-flow > .react-flow > .grid > .flex
**Feedback:** 婚姻节点本身只显示婚姻二字，不要有黑点

### 7. rounded [24px]
**Location:** .relative > .pointer-events-none > .pointer-events-auto > .rounded-[24px]
**Feedback:** 当没有选择人物时，不显示下面过多的描述，只保留 eyebrow 的 “人物详情”，以及黑字 “选择人物”

### 8. pointer events
**Location:** .min-h-[calc(100vh-8rem)] > .relative > .pointer-events-none > .pointer-events-auto
**Feedback:** 太宽了，外部 flex 布局使用 items-end，尽量减少宽度。不要 “legend” 文字

### 9. react flow
**Location:** .absolute > .react-flow > .react-flow > .react-flow
**Feedback:** 家族树视图下，节点距离过近，至少 3x

## 功能相关

### 1. 家族树视图下，过滤所有非血亲的节点
