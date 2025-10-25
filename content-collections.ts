import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, { CharsElement, LineElement } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";



// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

/** @type {import('rehype-pretty-code').Options;} */
const prettyCodeOptions = {
  theme: "github-light",
  keepBackground: false, // 让我们自己用 CSS 控制背景
  defaultLang: "plaintext",
  onVisitLine(node: LineElement) {
    if (node.children.length === 0) {
      // 避免空行高度为 0
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node: LineElement) {
    node.properties.className = [
      ...(node.properties.className || []),
      "line--highlighted",
    ];
  },
  onVisitHighlightedChars(node: CharsElement) {
    node.properties.className = [
      ...(node.properties.className || []),
      "word--highlighted",
    ];
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
      }
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

export default defineConfig({
  collections: [posts, projects],
});
