import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { visitParents } from "unist-util-visit-parents";

type OdysseyGlossaryEntry = {
  slug: string;
  terms: string[];
};

type OdysseyFrontmatter = {
  title?: string;
  shortTitle?: string;
  aliases?: string[];
};

const ODYSSEY_CONTENT_DIR = path.join(process.cwd(), "content/odyssey");
const SKIP_ANCESTOR_TYPES = new Set([
  "heading",
  "link",
  "linkReference",
  "definition",
  "inlineCode",
  "code",
  "yaml",
  "html",
  "mdxTextExpression",
  "mdxFlowExpression",
  "mdxjsEsm",
]);
const WORD_CHAR_RE = /[\p{L}\p{N}]/u;

function listOdysseyFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listOdysseyFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeTerm(term: string): string {
  return term.replace(/\s+/g, " ").trim();
}

function addTerm(target: Set<string>, value: string | undefined) {
  if (!value) return;

  const normalized = normalizeTerm(value);
  if (normalized.length < 3) return;
  target.add(normalized);

  const withoutTrailingParen = normalized.replace(/\s*\([^)]*\)\s*$/u, "").trim();
  if (withoutTrailingParen.length >= 3) {
    target.add(withoutTrailingParen);
  }

  const beforeDash = withoutTrailingParen.split(/\s+[—-]\s+/u)[0]?.trim();
  if (beforeDash && beforeDash.length >= 3) {
    target.add(beforeDash);
  }
}

function buildOdysseyGlossary(): OdysseyGlossaryEntry[] {
  const files = listOdysseyFiles(ODYSSEY_CONTENT_DIR);

  return files
    .map((filePath) => {
      const relativePath = path.relative(ODYSSEY_CONTENT_DIR, filePath);
      const slug = relativePath.replace(/\\/g, "/").replace(/\.mdx$/u, "");
      const source = fs.readFileSync(filePath, "utf8");
      const { data } = matter(source);
      const frontmatter = data as OdysseyFrontmatter;
      const terms = new Set<string>();

      addTerm(terms, frontmatter.title);
      addTerm(terms, frontmatter.shortTitle);
      for (const alias of frontmatter.aliases ?? []) {
        addTerm(terms, alias);
      }

      return {
        slug,
        terms: Array.from(terms).sort((a, b) => b.length - a.length),
      };
    })
    .filter((entry) => entry.terms.length > 0)
    .sort((a, b) => b.terms[0]!.length - a.terms[0]!.length);
}

const odysseyGlossary = buildOdysseyGlossary();

function isWordChar(char: string | undefined) {
  return Boolean(char && WORD_CHAR_RE.test(char));
}

function hasWordBoundary(text: string, start: number, end: number) {
  const prev = start > 0 ? text[start - 1] : undefined;
  const next = end < text.length ? text[end] : undefined;
  return !isWordChar(prev) && !isWordChar(next);
}

function createLinkedChildren(
  text: string,
  currentSlug: string | undefined,
  usedSlugs: Set<string>
) {
  const children: Array<{ type: "text"; value: string } | { type: "link"; url: string; children: [{ type: "text"; value: string }] }> = [];
  let buffer = "";
  let cursor = 0;
  let changed = false;

  while (cursor < text.length) {
    let match: { slug: string; term: string } | null = null;

    for (const entry of odysseyGlossary) {
      if (entry.slug === currentSlug || usedSlugs.has(entry.slug)) continue;

      for (const term of entry.terms) {
        if (!text.startsWith(term, cursor)) continue;
        if (!hasWordBoundary(text, cursor, cursor + term.length)) continue;
        match = { slug: entry.slug, term };
        break;
      }

      if (match) break;
    }

    if (!match) {
      buffer += text[cursor];
      cursor += 1;
      continue;
    }

    changed = true;
    if (buffer) {
      children.push({ type: "text", value: buffer });
      buffer = "";
    }

    children.push({
      type: "link",
      url: `/the-odyssey/${match.slug}`,
      children: [{ type: "text", value: match.term }],
    });
    usedSlugs.add(match.slug);
    cursor += match.term.length;
  }

  if (buffer) {
    children.push({ type: "text", value: buffer });
  }

  return changed ? children : null;
}

export function remarkOdysseyAutolink(options: { currentSlug?: string } = {}) {
  return function transformer(tree: any) {
    const usedSlugs = new Set<string>();

    visitParents(tree, "text", (node: any, ancestors: any[]) => {
      if (!node.value || typeof node.value !== "string") return;
      if (ancestors.some((ancestor) => SKIP_ANCESTOR_TYPES.has(ancestor.type))) return;

      const parent = ancestors[ancestors.length - 1];
      if (!parent?.children) return;

      const index = parent.children.indexOf(node);
      if (index === -1) return;

      const replacement = createLinkedChildren(node.value, options.currentSlug, usedSlugs);
      if (!replacement) return;

      parent.children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}
