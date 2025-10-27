# My Next Blog

This is my next blog. Built with Next.js, shadcn and Tailwind CSS.

## Reference

- Google Design: [link](https://design.google/?home=)

## Dev logs

Todo list

- [ ] ? apply liquid glass effect on navigation bar: [link](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/)
- [ ] pick bg color & texture for the page
- [ ] design css for mdx
  - [ ] design custom components to replace the original components: [link](https://mdxjs.com/table-of-components/#components)
    - [ ] blockquote
- [x] Use Nextjs font module: [link](https://nextjs.org/docs/app/api-reference/components/font)
- [x] "writing page"
- [ ] "About page"
- [ ] "Book page"
- [ ] add previous and next post link on each post page
- [ ] Footer component
- [ ] icon design
- [ ] meta
- [ ] seo
- [ ] Progress indicator for posts.
- [ ] More meta info of mdx by using [ContentCollection](https://www.content-collections.dev/docs/transform#examples)
- [ ] 

### 2025-10-27

Finish mdx's components:
- [x] blockquote
- [ ] code block
  - [rehype-pretty-code custom styles](https://rehype-pretty.pages.dev/)
    - [x] light mode.
    - [ ] apply styles for dark mode.
  - [Shiki code themes](https://shiki.style/themes#themes)
  - Nested CSS: `&` represents the parent element.
  - CSS attribute selector: `[data-rehype-pretty-code-figure]` to select `<element data-rehype-pretty-code-figure>`
- [x] inline code
  - Manually set the font-size because font-mono looks bigger than font-serif.
- [x] hyperlink
- [x] order list item
- [x] "tips" component
  - [ ] variation for more color? use clsx?

Polish:
- [x] the head of post is a little bit far from the top of the contents.

### 2025-10-26

- 对齐了 home page, writing page and post page 的标题
- add soft 70 font variation setting

### 2025-10-25

Today's goal is to finish the "writing page"

Here is some tasks:

- [x] posts list
  - [x] hover style，hover group
- [x] tags
  - [ ] hover style？
  - [x] 实现已经激活的 tag
- [x] 文章列表用年份来分类，分割线
  - [x] 点击年份，实现针对年份筛选
  - [x] 若已经筛选，则需要有按钮来取消年份筛选
- [x] query by tags, by years
  - [x] use url query to keep the selected tag
  - [x] 给文章页面中的 tag 添加链接，链接到 tag 筛选对应的文章列表页面
- [x] Use Nextjs font module: [link](https://nextjs.org/docs/app/api-reference/components/font)
  
迁移文章

- [ ] migrate posts from obsidian
- [x] migrate posts from resume-nuxt

### 2025-10-24

Change
- 新增：网易云音乐卡片
  - 新增光盘、黑胶组件
  - 为 update 状态前添加 breath 效果指示灯
- 不使用全局居中的容器，而是类似苹果克隆的那个项目，定义 section 和 subsection 类来实现

Fix
- 修复：Frame 组件在 sm 屏幕宽度下，页面大于屏幕。

Todo
- [x] mdx 代码块无样式
- [x] mdx 表格无样式
- [x] FrameProvider 中存在 bug，一旦切换路由，frame 状态重置成了默认值