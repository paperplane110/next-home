有几个问题需要解决

## Page Feedback: /playground/family-tree
**Viewport:** 1440×778

### 1. section page
**Location:** .neon-auth-ui > .min-h-[calc(100vh-8rem)] > .section
**Feedback:** 更改样式，不对宽度做限制

### 2. rounded 3xl
**Location:** .section > .subsection > .flex > .rounded-3xl
**Feedback:** 使用 absolute 样式，悬浮在整个页面的右上角

### 3. border border
**Location:** .section > .subsection > .overflow-hidden > .border-b
**Feedback:** 去掉里面这个描述 div

### 4. react flow
**Location:** .h-[72vh] > .react-flow > .react-flow > .react-flow
**Feedback:** 这一部分尽量铺满整个 page

### 5. rounded 3xl
**Location:** .section > .subsection > .flex > .rounded-3xl
**Feedback:** 太大了，尽可能精简占地面积，同样使用 absolute 悬浮在屏幕右侧