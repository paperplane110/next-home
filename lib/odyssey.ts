import { allOdysseys } from "content-collections";

import {
  BookOpen,
  Route,
  Users,
  BookMarked,
  Lightbulb,
  Sparkles,
  Landmark,
  Map,
  Columns,
  Compass,
} from "lucide-react";

export const ODYSSEY_CATEGORIES = [
  "Overview",
  "Plot Summary",
  "Characters",
  "Books",
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
    icon: Map,
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

export function getEntriesByCategory(category: OdysseyCategory): OdysseyEntry[] {
  return allOdysseys
    .filter((e) => e.category === category)
    .sort((a, b) => a.order - b.order);
}

export function getAllEntries(): OdysseyEntry[] {
  return [...allOdysseys].sort((a, b) => {
    const catOrder = ODYSSEY_CATEGORIES.indexOf(a.category) - ODYSSEY_CATEGORIES.indexOf(b.category);
    if (catOrder !== 0) return catOrder;
    return a.order - b.order;
  });
}

export function getEntryBySlug(slug: string): OdysseyEntry | undefined {
  return allOdysseys.find((e) => e._meta.path === slug);
}

export function getCategoryCounts(): Record<OdysseyCategory, number> {
  const counts = Object.fromEntries(
    ODYSSEY_CATEGORIES.map((c) => [c, 0])
  ) as Record<OdysseyCategory, number>;
  for (const entry of allOdysseys) {
    counts[entry.category]++;
  }
  return counts;
}

export function getRelatedEntries(slugs: string[]): OdysseyEntry[] {
  return slugs
    .map((slug) => getEntryBySlug(slug))
    .filter((e): e is OdysseyEntry => Boolean(e));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const entry of allOdysseys) {
    entry.tags?.forEach((t) => tags.add(t));
  }
  return Array.from(tags).sort();
}
