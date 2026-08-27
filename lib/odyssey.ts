import { allOdysseys } from "content-collections";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

import {
  BookOpen,
  Route,
  Users,
  BookMarked,
  Lightbulb,
  Sparkles,
  Landmark,
  Map as MapIcon,
  Columns,
  Compass,
} from "lucide-react";

export const ODYSSEY_CATEGORIES = [
  "Overview",
  "Plot Summary",
  "Books",
  "Characters",
  "Themes",
  "Symbols",
  "History & Archaeology",
  "Geography & Places",
  "Culture & Society",
  "Reading Guide",
] as const;

export type OdysseyCategory = (typeof ODYSSEY_CATEGORIES)[number];

export const CATEGORY_META: Record<OdysseyCategory, {
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}> = {
  "Overview": {
    description: "作品总览、荷马介绍、创作背景",
    icon: BookOpen,
    accent: "text-amber-700",
  },
  "Plot Summary": {
    description: "故事总脉络与时间线梳理",
    icon: Route,
    accent: "text-rose-700",
  },
  "Characters": {
    description: "人物谱系：家族、神明、求婚者、配角",
    icon: Users,
    accent: "text-sky-700",
  },
  "Books": {
    description: "24 卷分卷精读摘要与原文对照",
    icon: BookMarked,
    accent: "text-emerald-700",
  },
  "Themes": {
    description: "主题分析：nostos、xenia、disguise…",
    icon: Lightbulb,
    accent: "text-violet-700",
  },
  "Symbols": {
    description: "象征意象解读：橄榄树、奥德修斯的弓、大海…",
    icon: Sparkles,
    accent: "text-indigo-700",
  },
  "History & Archaeology": {
    description: "迈锡尼时代背景、特洛伊战争史实",
    icon: Landmark,
    accent: "text-orange-700",
  },
  "Geography & Places": {
    description: "伊萨卡、特洛伊、斯克里亚、冥府等地点",
    icon: MapIcon,
    accent: "text-teal-700",
  },
  "Culture & Society": {
    description: "古希腊信仰、待客之道、城邦社会",
    icon: Columns,
    accent: "text-fuchsia-700",
  },
  "Reading Guide": {
    description: "译本推荐、阅读顺序建议、注释",
    icon: Compass,
    accent: "text-slate-700",
  },
};

export type OdysseyEntry = (typeof allOdysseys)[number];
export type OdysseyLocalizedFields = Partial<{
  title: string;
  shortTitle: string;
  aliases: string[];
  summary: string;
  tags: string[];
  cover: string;
}>;

function getOdysseyLocalizedFields(entry: OdysseyEntry, locale: Locale): OdysseyLocalizedFields | undefined {
  return entry.i18n?.[locale] as OdysseyLocalizedFields | undefined;
}

export function getOdysseyEntryTitle(entry: OdysseyEntry, locale: Locale = DEFAULT_LOCALE) {
  return getOdysseyLocalizedFields(entry, locale)?.title ?? entry.title;
}

export function getOdysseyEntryShortTitle(entry: OdysseyEntry, locale: Locale = DEFAULT_LOCALE) {
  return getOdysseyLocalizedFields(entry, locale)?.shortTitle ?? entry.shortTitle;
}

export function getOdysseyEntryDisplayTitle(entry: OdysseyEntry, locale: Locale = DEFAULT_LOCALE) {
  return getOdysseyEntryShortTitle(entry, locale)?.trim() || getOdysseyEntryTitle(entry, locale);
}

export function getOdysseyEntrySummary(entry: OdysseyEntry, locale: Locale = DEFAULT_LOCALE) {
  return getOdysseyLocalizedFields(entry, locale)?.summary ?? entry.summary;
}

export function getOdysseyEntryTags(entry: OdysseyEntry, locale: Locale = DEFAULT_LOCALE) {
  return getOdysseyLocalizedFields(entry, locale)?.tags ?? entry.tags ?? [];
}

export function getOdysseyEntryAliases(entry: OdysseyEntry, locale: Locale = DEFAULT_LOCALE) {
  return getOdysseyLocalizedFields(entry, locale)?.aliases ?? entry.aliases ?? [];
}

export function getOdysseyEntryCover(entry: OdysseyEntry, locale: Locale = DEFAULT_LOCALE) {
  return getOdysseyLocalizedFields(entry, locale)?.cover ?? entry.cover;
}

export function getOdysseyEntrySearchFields(entry: OdysseyEntry, locale: Locale = DEFAULT_LOCALE) {
  const localized = {
    title: getOdysseyEntryTitle(entry, locale),
    shortTitle: getOdysseyEntryShortTitle(entry, locale),
    summary: getOdysseyEntrySummary(entry, locale),
    tags: getOdysseyEntryTags(entry, locale),
    aliases: getOdysseyEntryAliases(entry, locale),
  };

  const alternateLocale: Locale = locale === "zh" ? "en" : "zh";
  const alternate = {
    title: getOdysseyEntryTitle(entry, alternateLocale),
    shortTitle: getOdysseyEntryShortTitle(entry, alternateLocale),
    summary: getOdysseyEntrySummary(entry, alternateLocale),
    tags: getOdysseyEntryTags(entry, alternateLocale),
    aliases: getOdysseyEntryAliases(entry, alternateLocale),
  };

  return { localized, alternate };
}

// 内容按 content/odyssey/{en,zh}/<slug>.mdx 双目录存放，
// _meta.path 形如 "en/themes-xenia"，规范 slug 是去掉语言前缀后的部分。
export function getEntrySlug(entry: OdysseyEntry): string {
  return entry._meta.path.replace(/^(?:zh|en)\//, "");
}

export function getEntryLocale(entry: OdysseyEntry): Locale {
  return entry._meta.path.startsWith("zh/") ? "zh" : "en";
}

function groupEntriesBySlug(entries: OdysseyEntry[]) {
  const bySlug = new Map<string, OdysseyEntry[]>();
  for (const entry of entries) {
    const slug = getEntrySlug(entry);
    const group = bySlug.get(slug);
    if (group) {
      group.push(entry);
    } else {
      bySlug.set(slug, [entry]);
    }
  }
  return bySlug;
}

// 同一 slug 优先取当前语言的条目，没有则回退另一种语言（如 zh 缺失回退英文正文）
function pickEntryForLocale(group: OdysseyEntry[], locale: Locale): OdysseyEntry | undefined {
  return group.find((e) => getEntryLocale(e) === locale) ?? group[0];
}

function resolveEntriesForLocale(locale: Locale): OdysseyEntry[] {
  return Array.from(groupEntriesBySlug(allOdysseys).values())
    .map((group) => pickEntryForLocale(group, locale))
    .filter((e): e is OdysseyEntry => Boolean(e));
}

export function getEntriesByCategory(category: OdysseyCategory, locale: Locale = DEFAULT_LOCALE): OdysseyEntry[] {
  return resolveEntriesForLocale(locale)
    .filter((e) => e.category === category)
    .sort((a, b) => a.order - b.order);
}

export function getAllEntries(locale: Locale = DEFAULT_LOCALE): OdysseyEntry[] {
  return resolveEntriesForLocale(locale).sort((a, b) => {
    const catOrder = ODYSSEY_CATEGORIES.indexOf(a.category) - ODYSSEY_CATEGORIES.indexOf(b.category);
    if (catOrder !== 0) return catOrder;
    return a.order - b.order;
  });
}

export function getEntryBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): OdysseyEntry | undefined {
  const group = groupEntriesBySlug(allOdysseys).get(slug);
  return group ? pickEntryForLocale(group, locale) : undefined;
}

export function getCategoryCounts(locale: Locale = DEFAULT_LOCALE): Record<OdysseyCategory, number> {
  const counts = Object.fromEntries(
    ODYSSEY_CATEGORIES.map((c) => [c, 0])
  ) as Record<OdysseyCategory, number>;
  for (const entry of resolveEntriesForLocale(locale)) {
    counts[entry.category]++;
  }
  return counts;
}

export function getRelatedEntries(slugs: string[], locale: Locale = DEFAULT_LOCALE): OdysseyEntry[] {
  return slugs
    .map((slug) => getEntryBySlug(slug, locale))
    .filter((e): e is OdysseyEntry => Boolean(e));
}

export function getAllTags(locale: Locale = DEFAULT_LOCALE): string[] {
  const tags = new Set<string>();
  for (const entry of resolveEntriesForLocale(locale)) {
    getOdysseyEntryTags(entry, locale).forEach((t) => tags.add(t));
  }
  return Array.from(tags).sort();
}
