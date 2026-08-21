import { getEntrySlug, type OdysseyCategory, type OdysseyEntry } from "@/lib/odyssey";
import { DEFAULT_LOCALE, getLocaleFromPathname, type Locale } from "@/lib/i18n";

const ODYSSEY_BASE_SEGMENT = "the-odyssey";

const categoryLabels: Record<Locale, Record<OdysseyCategory, string>> = {
  zh: {
    "Overview": "总览",
    "Plot Summary": "剧情总览",
    "Characters": "人物",
    "Books": "分卷精读",
    "Themes": "主题",
    "Symbols": "象征",
    "History & Archaeology": "历史与考古",
    "Geography & Places": "地理与地点",
    "Culture & Society": "文化与社会",
    "Reading Guide": "阅读指南",
  },
  en: {
    "Overview": "Overview",
    "Plot Summary": "Plot Summary",
    "Characters": "Characters",
    "Books": "Books",
    "Themes": "Themes",
    "Symbols": "Symbols",
    "History & Archaeology": "History & Archaeology",
    "Geography & Places": "Geography & Places",
    "Culture & Society": "Culture & Society",
    "Reading Guide": "Reading Guide",
  },
};

const categoryDescriptions: Record<Locale, Record<OdysseyCategory, string>> = {
  zh: {
    "Overview": "作品总览、荷马介绍、创作背景",
    "Plot Summary": "故事总脉络与时间线梳理",
    "Characters": "人物谱系：家族、神明、求婚者、配角",
    "Books": "24 卷分卷精读摘要与原文对照",
    "Themes": "主题分析：nostos、xenia、disguise…",
    "Symbols": "象征意象解读：橄榄树、奥德修斯的弓、大海…",
    "History & Archaeology": "迈锡尼时代背景、特洛伊战争史实",
    "Geography & Places": "伊萨卡、特洛伊、斯克里亚、冥府等地点",
    "Culture & Society": "古希腊信仰、待客之道、城邦社会",
    "Reading Guide": "译本推荐、阅读顺序建议、注释",
  },
  en: {
    "Overview": "Orientation to the poem, Homer, and the tradition behind it.",
    "Plot Summary": "The full story arc and timeline of the return journey.",
    "Characters": "Major characters, divine patrons, families, and rivals.",
    "Books": "Book-by-book reading notes and selected passage context.",
    "Themes": "Recurring ideas such as nostos, xenia, disguise, and recognition.",
    "Symbols": "Objects and images that carry narrative or thematic weight.",
    "History & Archaeology": "Mycenaean context, Troy, and the archaeological record.",
    "Geography & Places": "Ithaca, Troy, Scheria, the Underworld, and more.",
    "Culture & Society": "Religion, hospitality, sacrifice, kingship, and everyday life.",
    "Reading Guide": "Edition notes, reading order, and practical study guidance.",
  },
};

export function getOdysseyLocale(pathname: string | null | undefined) {
  return getLocaleFromPathname(pathname);
}

export function isOdysseyPathname(pathname: string | null | undefined) {
  if (!pathname) return false;
  return pathname === `/${ODYSSEY_BASE_SEGMENT}` ||
    pathname.startsWith(`/${ODYSSEY_BASE_SEGMENT}/`) ||
    pathname === `/${DEFAULT_LOCALE}/${ODYSSEY_BASE_SEGMENT}` ||
    pathname.startsWith(`/${DEFAULT_LOCALE}/${ODYSSEY_BASE_SEGMENT}/`) ||
    pathname === `/en/${ODYSSEY_BASE_SEGMENT}` ||
    pathname.startsWith(`/en/${ODYSSEY_BASE_SEGMENT}/`);
}

export function getOdysseyHomeHref(locale: Locale = DEFAULT_LOCALE) {
  return `/${locale}/${ODYSSEY_BASE_SEGMENT}`;
}

export function getOdysseyEntryHref(locale: Locale = DEFAULT_LOCALE, entryOrSlug: OdysseyEntry | string) {
  const slug = typeof entryOrSlug === "string" ? entryOrSlug : getEntrySlug(entryOrSlug);
  return `${getOdysseyHomeHref(locale)}/${slug}`;
}

export function getLocaleAwareOdysseyHref(href: string, locale: Locale = DEFAULT_LOCALE) {
  const normalizedRoot = getOdysseyHomeHref(locale);

  if (href === `/${ODYSSEY_BASE_SEGMENT}` || href === `${normalizedRoot}`) {
    return normalizedRoot;
  }

  if (href.startsWith(`/${ODYSSEY_BASE_SEGMENT}/`)) {
    return `${normalizedRoot}/${href.slice(`/${ODYSSEY_BASE_SEGMENT}/`.length)}`;
  }

  if (href.startsWith("/zh/the-odyssey/") || href.startsWith("/en/the-odyssey/")) {
    return `${normalizedRoot}/${href.split("/").slice(3).join("/")}`;
  }

  return href;
}

export function getOdysseyCategoryLabel(category: OdysseyCategory, locale: Locale = DEFAULT_LOCALE) {
  return categoryLabels[locale][category];
}

export function getOdysseyCategoryDescription(category: OdysseyCategory, locale: Locale = DEFAULT_LOCALE) {
  return categoryDescriptions[locale][category];
}

export function getOdysseySlugFromHref(href: string) {
  const normalized = href
    .replace(/^\/(?:zh|en)\/the-odyssey\//, "")
    .replace(/^\/the-odyssey\//, "")
    .split(/[?#]/)[0];

  if (!normalized || normalized === href) return undefined;
  return normalized;
}

export function getOdysseyHrefForLocaleFromPathname(
  pathname: string | null | undefined,
  locale: Locale = DEFAULT_LOCALE,
) {
  if (!pathname) return getOdysseyHomeHref(locale);

  const slug = getOdysseySlugFromHref(pathname);
  return slug ? getOdysseyEntryHref(locale, slug) : getOdysseyHomeHref(locale);
}

export const ODYSSEY_UI_COPY = {
  zh: {
    layoutTitle: "The Odyssey Walkthrough",
    layoutSubtitle: "Tianyu Reading Notes",
    backToBlog: "返回博客",
    wikiButton: "奥德赛阅读 Wiki",
    footerTitle: "The Odyssey Walkthrough",
    footerLicense: "compiled by Tianyu · Content under CC BY-NC 4.0",
    searchLabel: "搜索 Odyssey",
    tocLabel: "本页目录",
    homeTitle: "The Odyssey Walkthrough",
    homeDescription:
      "奥德赛阅读指南与荷马史诗研究 Wiki — 人物关系、分卷精读、主题意象、历史考古、地理路线、古希腊社会文化与译本推荐。",
    homeHeroLead:
      "为荷马史诗《奥德赛》（The Odyssey）读者准备的中文阅读伴侣。梳理人物关系、分卷逐读、主题意象、时代背景与译本对照，让阅读英文原著的你随时能回到上下文里。",
    articleCategoryEntries: "篇词条",
    articleThemeCategories: "个主题分类",
    booksCovered: "已覆盖 Books",
    entriesLabel: "篇目",
    followUpTitle: "From Here: Themes & Guides",
    followUpDescription: "按主题展开的所有词条，每个分类下都能继续跳转到更细的阅读条目。",
    referencesTitle: "参考资料",
    languageLabel: "语言",
    languageZh: "中文",
    languageEn: "English",
    overviewTitle: "在这里你能查到什么",
  },
  en: {
    layoutTitle: "The Odyssey Walkthrough",
    layoutSubtitle: "Tianyu's Reading Notes",
    backToBlog: "Back to Blog",
    wikiButton: "The Odyssey Wiki",
    footerTitle: "The Odyssey Walkthrough",
    footerLicense: "compiled by Tianyu · Content under CC BY-NC 4.0",
    searchLabel: "Search Odyssey",
    tocLabel: "On this page",
    homeTitle: "The Odyssey Walkthrough",
    homeDescription:
      "A bilingual Odyssey reading wiki covering characters, book-by-book notes, themes, symbols, archaeology, geography, and reading guides.",
    homeHeroLead:
      "A reading companion for Homer’s The Odyssey, with character notes, book-by-book walkthroughs, recurring themes, historical context, and edition guidance gathered around a shared canonical slug system.",
    articleCategoryEntries: "entries",
    articleThemeCategories: "theme groups",
    booksCovered: "Books covered",
    entriesLabel: "entries",
    followUpTitle: "From Here: Themes & Guides",
    followUpDescription: "Browse every Odyssey article by topic, then continue into the more detailed entries within each section.",
    referencesTitle: "References & Sources",
    languageLabel: "Language",
    languageZh: "中文",
    languageEn: "English",
    overviewTitle: "What You Can Explore Here",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function getOdysseyCopy(locale: Locale = DEFAULT_LOCALE) {
  return ODYSSEY_UI_COPY[locale];
}
