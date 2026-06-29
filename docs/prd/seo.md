# SEO 需求与迭代指南

## 背景
- 站点域名：tyyuan.me，托管于 Vercel
- 当前访问量较低，历史未做页面级 SEO 与索引优化
- 已完成的首轮优化：页面级元数据、动态详情元数据、结构化数据、robots 与 sitemap

## 目标
- 提升搜索引擎抓取能力（可索引、可发现、可理解）
- 改善社交分享卡片展示（Open Graph/Twitter）
- 保证 URL 规范与站点一致性（canonical、metadataBase）

## 范围
- 页面：Home、Posts 列表、Reading 列表、About
- 详情页：Posts/[slug]、Reading/[slug]
- 站点级：robots、sitemap

## 需求清单
- 页面级 SEO（列表/静态页）
  - 为每个页面设置 title 与 description
  - 设置 canonical 指向站点路径（例如 /、/posts、/reading、/about）
  - 配置 Open Graph（type、siteName、title、description、url）
  - 配置 Twitter（card、title、description）
- 动态详情页 SEO（Posts/Reading）
  - 使用 generateMetadata 基于 MDX 内容生成 title/description
  - 设置 canonical 为 /posts/[slug] 或 /reading/[slug]
  - Open Graph 使用 article 类型，包含 publishedTime 与 tags
  - 注入 Article JSON‑LD（headline、description、datePublished、author、keywords）
  - robots: index/follow
- 索引与可抓取
  - robots.ts：允许全部路径抓取
  - sitemap.ts：包含首页、列表页、About，以及所有 Posts/Reading 详情页

## 验收标准（AC）
- /robots.txt 可访问，允许抓取根路径
- /sitemap.xml 可访问，包含静态页与所有文章详情 URL
- 页面源代码有正确的 title、description、canonical、OG、Twitter 元数据
- 文章详情页的结构化数据通过 Google Rich Results Test 验证（Article）
- canonical 指向 tyyuan.me 域名下的正确路径，避免重复内容
- 在 Google Search Console 提交站点并成功提交 sitemap.xml

## 实施记录
- 全局默认元数据与模板：[app/layout.tsx](file:///Users/tyyuan/Desktop/code/next-home/app/layout.tsx)
- 主页元数据：[app/(main)/page.tsx](file:///Users/tyyuan/Desktop/code/next-home/app/(main)/page.tsx)
- Posts 列表页元数据：[app/(main)/posts/page.tsx](file:///Users/tyyuan/Desktop/code/next-home/app/(main)/posts/page.tsx)
- Reading 列表页元数据：[app/(main)/reading/page.tsx](file:///Users/tyyuan/Desktop/code/next-home/app/(main)/reading/page.tsx)
- About 页元数据：[app/(main)/about/page.tsx](file:///Users/tyyuan/Desktop/code/next-home/app/(main)/about/page.tsx)
- Posts 详情动态元数据 + Article JSON‑LD：[app/(main)/posts/[slug]/page.tsx](file:///Users/tyyuan/Desktop/code/next-home/app/(main)/posts/%5Bslug%5D/page.tsx)
- Reading 详情动态元数据 + Article JSON‑LD：[app/(main)/reading/[slug]/page.tsx](file:///Users/tyyuan/Desktop/code/next-home/app/(main)/reading/%5Bslug%5D/page.tsx)
- Robots 与 Sitemap：
  - [app/robots.ts](file:///Users/tyyuan/Desktop/code/next-home/app/robots.ts)
  - [app/sitemap.ts](file:///Users/tyyuan/Desktop/code/next-home/app/sitemap.ts)

## 迭代建议（Backlog）
- 为文章增加封面图并扩展 openGraph.images，以提升分享卡片效果
- Twitter 配置补充 twitter.site 与 twitter.creator
- [x] 在 Google Search Console 完成站点所有权验证并提交 sitemap.xml
- 将封面图作为 MDX frontmatter 字段，并在 generateMetadata 与 JSON‑LD 中引用
- 定期检查结构化数据与抓取情况（Search Console 报告）
- 若后续启用多语言（i18n），增加 hreflang 与语言特定的 canonical
- 考虑添加 Breadcrumb JSON‑LD（若引入层级导航）

## 维护指引（新增页面/功能时）
- 页面/功能 PR Checklist：
  - 页面级 metadata（title/description/canonical/OG/Twitter）齐全
  - 详情页 generateMetadata 与 JSON‑LD 完整
  - 如含新详情页，sitemap 覆盖该路由（若从内容集合自动生成则无需手动）
  - 更新本文件的“实施记录/范围/AC/Backlog”条目

