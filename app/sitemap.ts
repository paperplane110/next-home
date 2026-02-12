import type { MetadataRoute } from "next";
import { allPosts, allReadings } from "content-collections";

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

  return [...staticRoutes, ...postRoutes, ...readingRoutes];
}
