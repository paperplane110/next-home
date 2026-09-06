import type { MetadataRoute } from "next";
import { allPosts, allReadings, allOdysseys } from "content-collections";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tyyuan.me";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/posts`, lastModified: new Date() },
    { url: `${baseUrl}/reading`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
  ];

  const postRoutes: MetadataRoute.Sitemap = allPosts.map((p) => ({
    url: `${baseUrl}/posts/${p._meta.path}`,
    lastModified: new Date(p.date),
  }));

  const readingRoutes: MetadataRoute.Sitemap = allReadings.map((p) => ({
    url: `${baseUrl}/reading/${p._meta.path}`,
    lastModified: new Date(p.date),
  }));

  // Odyssey wiki：zh/en 首页 + 全部词条，附语言对
  const odysseyHrefs = (locale: "zh" | "en", slug?: string) =>
    `${baseUrl}/${locale}/the-odyssey${slug ? `/${slug}` : ""}`;
  const odysseyLanguages = (slug?: string) => ({
    zh: odysseyHrefs("zh", slug),
    en: odysseyHrefs("en", slug),
  });

  const odysseySlugs = Array.from(
    new Set(
      allOdysseys.map((entry) =>
        entry._meta.path.replace(/^(?:zh|en)\//, "")
      )
    )
  );

  const odysseyRoutes: MetadataRoute.Sitemap = odysseySlugs.flatMap((slug) =>
    (["zh", "en"] as const).map((locale) => ({
      url: odysseyHrefs(locale, slug),
      alternates: { languages: odysseyLanguages(slug) },
    }))
  );

  const odysseyHomeRoutes: MetadataRoute.Sitemap = (
    ["zh", "en"] as const
  ).map((locale) => ({
    url: odysseyHrefs(locale),
    alternates: { languages: odysseyLanguages() },
  }));

  return [
    ...staticRoutes,
    ...postRoutes,
    ...readingRoutes,
    ...odysseyHomeRoutes,
    ...odysseyRoutes,
  ];
}
