## Image reference

- [Athena](https://www.britannica.com/topic/Athena-Greek-mythology)
- <br />

## 2026.8.20

&#x20;

- sidebar 样式解决
- 整体 layout，responsive 解决
- toc 样式
- toc 功能性 bug 解决
  - 跳转高度 scroll-mt-24
  - 特殊字符 slug 转译，ts 脚本和 rehype-slug 不一致导致无法跳转
- 添加特殊主题色 color-odysse
- hero 渐变动效
- 主页 Wave 效果卡片
- Inline link hover popover card 效果

## 2026.8.21

Todo

- [x] Popover card 中 shortTitle 不够短

* [x] category 太长了
* [x] how to apply odysseyLink in mdx
  - 方案：在 `content-collections.ts` 的 Odyssey 集合编译阶段接入 `remarkOdysseyAutolink`
  - 词典来源：每个 Odyssey 词条的 `title / shortTitle / aliases`
  - 规则：只自动链接正文文本；跳过 heading / code / 已有 link / MDX JSX；同一词条每篇只链接第一次
  - 渲染：自动生成的 `/the-odyssey/...` 链接会在 Odyssey 词条页通过 `OdysseyA` → `OdysseyInlineLink` 显示 hover popover
  - 扩展：后续只需要在 frontmatter 里补 `aliases`，就能持续提升人名、地名、术语的自动识别率

- [ ] Logo
- [ ] 交互式地图
- [ ] 人物关系图谱，使用 react node
- [ ] CharacterCard styles

* [ ] 国际化
  - 当前路由骨架已升级为 `/zh/the-odyssey/...` / `/en/the-odyssey/...`，默认中文；旧 `/the-odyssey/...` 重定向到中文路径
  - [x] MDX 翻译成中文
  - [x] slug 策略：不同语言共用同一套 slug
  - [x] Popover / InlineLink 也要语言感知
  - [ ] SEO 也要一起做
    - hreflang
    - locale-specific canonical
    - 多语言 sitemap
    - 多语言 metadata
* [ ] odysessy/page&#x20;
  - [ ] 文案需要打磨，减少ai感
  - [ ] 中下半部分的内容需要重新设计
- [ ] Timeline component
- [ ] 人物众多，需要分类
- [ ] contents 的顺序是怎么决定的

# 2026.8.27

* [x] Write article
  - [x] character: Zeus
  - [x] character: Mentor
  - [x] character: Nestor
  - [x] Geo: Sparta
  - [x] Geo: Pylos
* [ ] Interactive map
  - [ ] I want to manage the place information in one place, and when I hover the city marker, it should show the place information, like the name, the latitude and longitude, the story related to the place.
  - [ ] I also want to prepare the route information, showing the whole route of odysseus' journey. Each part of the route should has some description, like what happened, how long it took, etc.
