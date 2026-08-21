import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
} from "lucide-react";
import {
  ODYSSEY_CATEGORIES,
  CATEGORY_META,
  getEntriesByCategory,
  getAllEntries,
  getEntryBySlug,
  type OdysseyCategory,
  type OdysseyEntry,
} from "@/lib/odyssey";
import { OdysseyCommandTrigger } from "@/components/odyssey/odyssey-command";
import OdysseyInlineLink from "@/components/odyssey/odyssey-inline-link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "The Odyssey Walkthrough",
  description:
    "奥德赛阅读指南与荷马史诗研究 Wiki — 人物关系、分卷精读、主题意象、历史考古、地理路线、古希腊社会文化与译本推荐。",
  alternates: { canonical: "/the-odyssey" },
  openGraph: {
    type: "website",
    title: "The Odyssey Walkthrough",
    description:
      "奥德赛阅读指南与荷马史诗研究 Wiki — 人物关系、分卷精读、主题意象、历史考古、地理路线、古希腊社会文化与译本推荐。",
    url: "https://tyyuan.me/the-odyssey",
    siteName: "Tianyu",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Odyssey Walkthrough",
    description:
      "奥德赛阅读指南与荷马史诗研究 Wiki — 人物关系、分卷精读、主题意象、历史考古、地理路线、古希腊社会文化与译本推荐。",
  },
};

type InternalLinkDef = { href: string; label: string };

function resolveOdysseyEntry(href: string): OdysseyEntry | undefined {
  const prefix = "/the-odyssey/";
  if (!href.startsWith(prefix)) return undefined;
  const slug = href.slice(prefix.length);
  return getEntryBySlug(slug);
}

export default function TheOdysseyHomePage() {
  const allEntries = getAllEntries();
  const totalArticles = allEntries.length;
  const totalCategories = ODYSSEY_CATEGORIES.length;
  const booksCovered = getEntriesByCategory("Books").length;

  const overviewEntries = getEntriesByCategory("Overview");
  const charactersEntries = getEntriesByCategory("Characters");
  const booksEntries = getEntriesByCategory("Books");
  const themesEntries = getEntriesByCategory("Themes");
  const symbolsEntries = getEntriesByCategory("Symbols");
  const historyEntries = getEntriesByCategory("History & Archaeology");
  const geographyEntries = getEntriesByCategory("Geography & Places");
  const cultureEntries = getEntriesByCategory("Culture & Society");
  const readingEntries = getEntriesByCategory("Reading Guide");
  const plotEntries = getEntriesByCategory("Plot Summary");

  const followUpCategories: OdysseyCategory[] = [
    "Plot Summary",
    "Characters",
    "Books",
    "Themes",
    "Symbols",
    "History & Archaeology",
    "Geography & Places",
    "Culture & Society",
    "Reading Guide",
  ];

  return (
    <div className="max-w-160 mx-auto px-6 lg:max-w-200">
      <section className="w-full pb-10 sm:pb-14 border-b border-neutral-200/70 page-top-margin">
        <div className="flex flex-col items-start gap-6">
          <div className="w-full flex flex-col gap-4">
            <h1
              className={cn(
                "text-4xl sm:text-5xl lg:text-7xl soft-70 font-bold tracking-tight soft-60",
                fraunces.className
              )}
            >
              <span className="odyssey-gradient-linear">The Odyssey</span>
              <span className="block font-light text-neutral-900 mt-1">Walkthrough</span>
            </h1>
            <p
              className={cn(
                "text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed",
                fraunces.className
              )}
            >
              为荷马史诗《奥德赛》（<span className="font-semibold">The Odyssey</span>）读者准备的中文阅读伴侣。
              梳理人物关系、分卷逐读、主题意象、时代背景与译本对照，
              让阅读英文原著的你随时能回到上下文里。
            </p>
          </div>

          <OdysseyCommandTrigger className="w-full max-w-md" />

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[11px]">
              {totalArticles} 篇词条
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              {totalCategories} 个主题分类
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              已覆盖 Books {booksCovered} / 24 卷
            </Badge>
          </div>
        </div>
      </section>

      <section className="w-full py-12 sm:py-16" id="overview">
        <div className="w-full max-w-none">
          <div className="space-y-6 sm:space-y-7 text-[15.5px] sm:text-base leading-[1.85] text-neutral-700">
            <p>
              《奥德赛》是西方文学源头的两大荷马史诗之一（另一部是《伊利亚特》）。
              全诗 24 卷、约 12000 行六音步扬抑格
              （dactylic hexameter），讲述特洛伊战争结束后，
              <OdysseyInlineLink
                href="/the-odyssey/characters-odysseus"
                entry={resolveOdysseyEntry("/the-odyssey/characters-odysseus")}
              >
                奥德修斯
              </OdysseyInlineLink>
              （Ὀδυσσεύς / Odysseus）花了十年时间才辗转回到故乡
              <OdysseyInlineLink
                href="/the-odyssey/geography-ithaca"
                entry={resolveOdysseyEntry("/the-odyssey/geography-ithaca")}
              >
                伊萨卡
              </OdysseyInlineLink>
              （Ithaca）岛的故事。与《伊利亚特》聚焦战场上的"愤怒"不同，
              《奥德赛》的核心情绪是{" "}
              <em className="font-serif text-odyssey">νόστος · nostos</em>
              ——回家。这部 Wiki 正是围绕 nostos 这一条主线建立的。
            </p>

            <p>
              如果你正准备开始读，可以先从{" "}
              <OdysseyInlineLink
                href="/the-odyssey/overview-introduction"
                entry={resolveOdysseyEntry("/the-odyssey/overview-introduction")}
              >
                作品结构简介
              </OdysseyInlineLink>{" "}
              与{" "}
              <OdysseyInlineLink
                href="/the-odyssey/overview-homer"
                entry={resolveOdysseyEntry("/the-odyssey/overview-homer")}
              >
                荷马与口传史诗传统
              </OdysseyInlineLink>{" "}
              入手，快速了解史诗的构成、口头诗歌的叠句与 epithet（修饰套语）是怎么回事；
              如果想先看整个故事脉络（不介意剧透），可以读{" "}
              <OdysseyInlineLink
                href="/the-odyssey/plot-summary-nostos"
                entry={resolveOdysseyEntry("/the-odyssey/plot-summary-nostos")}
              >
                The Story Arc: Nostos
              </OdysseyInlineLink>
              ，它把从特洛伊陷落、海上漂泊、回到伊萨卡直至血洗求婚者的全过程串成一条线。
            </p>

            <h2
              className={cn(
                "pt-6 text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight",
                fraunces.className
              )}
            >
              在这里你能查到什么
            </h2>

            <p>
              <strong>人物谱系：</strong>
              四大核心角色单独成篇——
              <OdysseyInlineLink
                href="/the-odyssey/characters-odysseus"
                entry={resolveOdysseyEntry("/the-odyssey/characters-odysseus")}
              >
                奥德修斯
              </OdysseyInlineLink>
              （多谋的 polytropos 英雄）、
              <OdysseyInlineLink
                href="/the-odyssey/characters-telemachus"
                entry={resolveOdysseyEntry("/the-odyssey/characters-telemachus")}
              >
                忒勒马科斯
              </OdysseyInlineLink>
              （Telemachy，少年寻父的成长线）、
              <OdysseyInlineLink
                href="/the-odyssey/characters-penelope"
                entry={resolveOdysseyEntry("/the-odyssey/characters-penelope")}
              >
                珀涅罗珀
              </OdysseyInlineLink>
              （以织机与梦拖延求婚者的王后）、
              <OdysseyInlineLink
                href="/the-odyssey/characters-athena"
                entry={resolveOdysseyEntry("/the-odyssey/characters-athena")}
              >
                雅典娜
              </OdysseyInlineLink>
              （始终在场的庇护者）；
              其余神明家族与求婚者阵营后续会陆续补全。
            </p>

            <p>
              <strong>逐卷精读：</strong>
              每一卷都会整理要点、引文与关键词。
              目前已经写完{" "}
              <OdysseyInlineLink
                href="/the-odyssey/books-book-1"
                entry={resolveOdysseyEntry("/the-odyssey/books-book-1")}
              >
                Book 1 — Athena Inspires the Prince
              </OdysseyInlineLink>
              （忒勒马科马科斯开场）与{" "}
              <OdysseyInlineLink
                href="/the-odyssey/books-book-5"
                entry={resolveOdysseyEntry("/the-odyssey/books-book-5")}
              >
                Book 5 — Odysseus: Nymph and Shipwreck
              </OdysseyInlineLink>
              （奥德修斯首次登场，离开卡吕普索，遭遇波塞冬海难登上斯克里亚）。
              剩余 22 卷会随着我自己阅读进度持续更新。
            </p>

            <p>
              <strong>主题与象征：</strong>
              史诗的很多妙处藏在反复出现的母题里——
              <OdysseyInlineLink
                href="/the-odyssey/themes-xenia"
                entry={resolveOdysseyEntry("/the-odyssey/themes-xenia")}
              >
                xenia（主客之道）
              </OdysseyInlineLink>
              （宙斯作为 Xenios 所守护的待客法则，既被求婚者与独目巨人破坏，也被
              涅斯托尔、墨涅拉奥斯、费埃克斯人践行）、
              伪装（disguise）、nostos 之外的归家条件，
              以及更具象的{" "}
              <OdysseyInlineLink
                href="/the-odyssey/symbols-bow"
                entry={resolveOdysseyEntry("/the-odyssey/symbols-bow")}
              >
                奥德修斯的大弓
              </OdysseyInlineLink>
              （身份与复仇的双重象征，仅合法的主人才能拉开）。
            </p>

            <p>
              <strong>历史与地理：</strong>
              史诗并非纯粹虚构。了解{" "}
              <OdysseyInlineLink
                href="/the-odyssey/history-mycenaean"
                entry={resolveOdysseyEntry("/the-odyssey/history-mycenaean")}
              >
                迈锡尼青铜时代的世界
              </OdysseyInlineLink>
              （线形文字 B、宫殿经济、赫梯与埃及档案中所见的 Ahhiyawa），
              以及{" "}
              <OdysseyInlineLink
                href="/the-odyssey/history-troy-war"
                entry={resolveOdysseyEntry("/the-odyssey/history-troy-war")}
              >
                特洛伊战争在考古中到底对应什么
              </OdysseyInlineLink>
              （Schliemann → Dörpfeld → Blegen 三代人对 Hisarlık 的发掘），
              会让你读诗时对"战船数目表""青铜武器""城墙"等细节有更实感的想象。
              地理部分则整理了关键地点——故乡{" "}
              <OdysseyInlineLink
                href="/the-odyssey/geography-ithaca"
                entry={resolveOdysseyEntry("/the-odyssey/geography-ithaca")}
              >
                伊萨卡
              </OdysseyInlineLink>
              、史诗起点{" "}
              <OdysseyInlineLink
                href="/the-odyssey/geography-troy"
                entry={resolveOdysseyEntry("/the-odyssey/geography-troy")}
              >
                特洛伊
              </OdysseyInlineLink>
              、中转站{" "}
              <OdysseyInlineLink
                href="/the-odyssey/geography-scheria"
                entry={resolveOdysseyEntry("/the-odyssey/geography-scheria")}
              >
                斯克里亚（Scheria）
              </OdysseyInlineLink>
              ——并提供随文可用的地中海航行地图组件。
            </p>

            <p>
              <strong>文化与阅读：</strong>
              <OdysseyInlineLink
                href="/the-odyssey/culture-olympian-gods"
                entry={resolveOdysseyEntry("/the-odyssey/culture-olympian-gods")}
              >
                奥林匹斯信仰与荷马式的诸神
              </OdysseyInlineLink>
              （神人同形同性、Zeus 的至上权但有限、献祭与占卜如何运作）；
              以及在译本方面，{" "}
              <OdysseyInlineLink
                href="/the-odyssey/reading-guide-editions"
                entry={resolveOdysseyEntry("/the-odyssey/reading-guide-editions")}
              >
                English Editions &amp; Translations
              </OdysseyInlineLink>{" "}
              会对比 Fagles、Fitzgerald、Lattimore、Loeb 希英对照本、Heubeck 评注版
              等常见版本的风格，帮助你挑一册顺手的作为案头书。
            </p>

            <p>
              这个站点是我自己读英文原著过程中边查边写的笔记，也希望成为你读到任何位置时，
              可以随手跳回来的索引与上下文。如果还不知道从哪里进入，
              推荐顺序：作品简介 → 故事脉络（Nostos）→ Book 1 &amp; Book 5 → 四位核心人物 →
              xenia 主题 → 再顺着你感兴趣的卷和人物一路展开。
              按 <kbd className="rounded border border-neutral-300 px-1.5 py-0.5 text-[10px] font-mono text-neutral-600">⌘K</kbd>{" "}
              可以随时全局检索任意词条、人名、地名。
            </p>
          </div>
        </div>
      </section>

      <section className="w-full pb-16 sm:pb-20" id="themes">
        <div className="w-full">
          <div className="flex flex-col gap-2 mb-8 sm:mb-10">
            <h2
              className={cn(
                "text-2xl sm:text-3xl font-light tracking-tight text-neutral-900 soft-50",
                fraunces.className
              )}
            >
              From Here: Themes &amp; Guides
            </h2>
            <p
              className={cn(
                "text-base sm:text-lg text-muted-foreground",
                fraunces.className
              )}
            >
              按主题展开的所有词条，每个分类下都能继续跳转到更细的阅读条目。
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {followUpCategories.map((category) => {
              const meta = CATEGORY_META[category];
              const entries: OdysseyEntry[] = (() => {
                switch (category) {
                  case "Plot Summary": return plotEntries;
                  case "Characters": return charactersEntries;
                  case "Books": return booksEntries;
                  case "Themes": return themesEntries;
                  case "Symbols": return symbolsEntries;
                  case "History & Archaeology": return historyEntries;
                  case "Geography & Places": return geographyEntries;
                  case "Culture & Society": return cultureEntries;
                  case "Reading Guide": return readingEntries;
                  default: return getEntriesByCategory(category);
                }
              })();
              const Icon = meta.icon;
              if (entries.length === 0) return null;

              return (
                <div
                  key={category}
                  className="rounded-2xl border border-neutral-200/70 bg-white/60 p-5 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-50",
                          meta.accent
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={cn(
                            "text-xl sm:text-2xl font-semibold text-neutral-900 mb-1",
                            fraunces.className
                          )}
                        >
                          {category}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {meta.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px] sm:text-[11px]">
                      {entries.length} entries
                    </Badge>
                  </div>

                  <ul className="space-y-1">
                    {entries.map((entry, idx) => (
                      <li key={entry._meta.path} className="list-none">
                        <Link
                          href={`/the-odyssey/${entry._meta.path}`}
                          className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-100/80"
                        >
                          <span className="text-[11px] text-neutral-400 tabular-nums shrink-0 pt-0.5 w-7 text-right font-mono">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div
                              className={cn(
                                "text-base sm:text-[17px] font-medium text-neutral-900 truncate group-hover:text-odyssey transition-colors",
                                fraunces.className
                              )}
                            >
                              {entry.title}
                            </div>
                            {entry.summary && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                                {entry.summary}
                              </p>
                            )}
                          </div>
                          <ArrowUpRight className="size-4 shrink-0 mt-1.5 text-neutral-300 transition-colors group-hover:text-odyssey" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
