import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, { LineElement } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";



// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

/** @type {import('rehype-pretty-code').Options;} */
const prettyCodeOptions = {
  theme: "one-light",
  keepBackground: false, // 让我们自己用 CSS 控制背景
  defaultLang: {
    block: "plaintext",
    inline: "js",
  },
  onVisitLine(node: LineElement) {
    if (node.children.length === 0) {
      // 避免空行高度为 0
      node.children = [{ type: "text", value: " " }];
    }
  },
};

// posts 集合
const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: ["*.mdx"],
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    readingTime: z.number(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(
      context, document,
      {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions], rehypeSlug],
        // 引入 components/mdx 目录下的所有文件, 并将其引入路径设置为 @/
        files(appender) {
          appender.directory("@/", "components/mdx")
        },
      },
    );
    return {
      ...document,
      mdx,
    };
  },
});

// projects 集合
const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: ["*.mdx"],
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date()
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document,
      {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      }
    );
    return {
      ...document,
      mdx,
    };
  },
});

// reading 集合
const reading = defineCollection({
  name: "reading",
  directory: "content/reading",
  include: ["*.mdx"],
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    readingTime: z.number(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(
      context, document,
      {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions], rehypeSlug],
        // 引入 components/mdx 目录下的所有文件, 并将其引入路径设置为 @/
        files(appender) {
          appender.directory("@/", "components/mdx")
        },
      },
    );
    return {
      ...document,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [posts, projects, reading],
});
