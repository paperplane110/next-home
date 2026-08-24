# next-home

个人博客 / 知识站点（Next.js 16 + Tailwind CSS v4 + shadcn/ui + content-collections）。

## Odyssey Wiki 内容约定（content/odyssey/）

- 每个词条有 zh/ 与 en/ 两个版本，slug 必须一致；/zh 优先渲染中文版，缺失时回退英文正文。
- **写/改中文内容前必查** [docs/project-odyssey/transliteration-glossary.md](docs/project-odyssey/transliteration-glossary.md)：
  - 正文一律用表中的「主译名」，首次出现写「中文（English）」格式，此后只用中文；
  - 变体译名只允许出现在 frontmatter 的 `aliases` 字段（用于搜索与自动链接）；
  - 表中没有的新译名，先按文档内的音译规则推导并登记到表中，再使用。
- 分类内排序由 frontmatter 的 `order` 字段决定（数字越小越靠前），sidebar 与 commandK 都按它排序。
- Markdown 两个坑：
  - 列表条目之间**不要加空行**——否则整张列表变 loose，每个 `<li>` 会被套上 `<p>`；
  - `**加粗**` 的闭合 `**` 后面要跟空格——紧跟标点加字母（如 `**X.**Y`）时加粗会失效。
- 内容改了但 dev server 没反映时：`npm run content:rebuild`（清除 content-collections 缓存并全量重编译）。
