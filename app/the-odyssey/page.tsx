import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CommandIcon } from "lucide-react";

import {
  CATEGORY_META,
  ODYSSEY_CATEGORIES,
  getAllEntries,
  getOdysseyEntrySummary,
  getOdysseyEntryTitle,
  getEntriesByCategory,
  getEntryBySlug,
  type OdysseyCategory,
  type OdysseyEntry,
} from "@/lib/odyssey";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import {
  getOdysseyCategoryDescription,
  getOdysseyCategoryLabel,
  getOdysseyCopy,
  getOdysseyEntryHref,
  getOdysseyHomeHref,
} from "@/lib/odyssey-i18n";
import { OdysseyCommandTrigger } from "@/components/odyssey/odyssey-command";
import OdysseyInlineLink from "@/components/odyssey/odyssey-inline-link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { OdysseyMapCard } from "@/components/odyssey/odyssey-map-card";

export function buildOdysseyHomeMetadata(locale: Locale = DEFAULT_LOCALE): Metadata {
  const copy = getOdysseyCopy(locale);
  const canonical = getOdysseyHomeHref(locale);

  return {
    title: copy.homeTitle,
    description: copy.homeDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: copy.homeTitle,
      description: copy.homeDescription,
      url: `https://tyyuan.me${canonical}`,
      siteName: "Tianyu",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.homeTitle,
      description: copy.homeDescription,
    },
  };
}

export const metadata: Metadata = buildOdysseyHomeMetadata();

function resolveOdysseyEntry(slug: string, locale: Locale): OdysseyEntry | undefined {
  return getEntryBySlug(slug, locale);
}

function OdysseyGlossaryLink({
  locale,
  slug,
  children,
}: {
  locale: Locale;
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <OdysseyInlineLink
      href={getOdysseyEntryHref(locale, slug)}
      entry={resolveOdysseyEntry(slug, locale)}
      locale={locale}
    >
      {children}
    </OdysseyInlineLink>
  );
}

function OdysseyHomeOverview({ locale }: { locale: Locale }) {
  const copy = getOdysseyCopy(locale);

  if (locale === "en") {
    return (
      <div className="space-y-6 text-[15.5px] leading-[1.85] text-neutral-700 sm:space-y-7 sm:text-base">
        <p>
          <em>The Odyssey</em> is one of the two Homeric epics at the foundation of Western literature, the companion to the <em>Iliad</em>. Across 24 books and roughly 12,000 lines of dactylic hexameter, it follows{" "}
          <OdysseyGlossaryLink locale={locale} slug="characters-odysseus">
            Odysseus
          </OdysseyGlossaryLink>
          , who spends ten more years trying to reach{" "}
          <OdysseyGlossaryLink locale={locale} slug="geography-ithaca">
            Ithaca
          </OdysseyGlossaryLink>{" "}
          after Troy has fallen. Where the <em>Iliad</em> concentrates on battlefield rage, the <em>Odyssey</em> turns around <em className="font-serif text-odyssey">nostos</em>: return, recovery, and the long work of coming home.
        </p>

        <p>
          If you are just starting, begin with{" "}
          <OdysseyGlossaryLink locale={locale} slug="overview-introduction">
            Introduction to the Odyssey
          </OdysseyGlossaryLink>{" "}
          and{" "}
          <OdysseyGlossaryLink locale={locale} slug="overview-homer">
            Homer and the Epic Tradition
          </OdysseyGlossaryLink>
          . They give you the shape of the poem, the oral tradition behind it, and the critical background that makes the rest of the wiki easier to navigate. If you want the whole arc upfront, jump to{" "}
          <OdysseyGlossaryLink locale={locale} slug="plot-summary-nostos">
            The Story Arc: Nostos
          </OdysseyGlossaryLink>
          , which connects Troy, the wanderings, Ithaca, and the slaughter of the suitors into one readable line.
        </p>

        <h2
          className={cn(
            "pt-6 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl",
            fraunces.className
          )}
        >
          {copy.overviewTitle}
        </h2>

        <p>
          <strong>Characters:</strong> the four core figures already have dedicated entries:
          {" "}
          <OdysseyGlossaryLink locale={locale} slug="characters-odysseus">Odysseus</OdysseyGlossaryLink>,
          {" "}
          <OdysseyGlossaryLink locale={locale} slug="characters-telemachus">Telemachus</OdysseyGlossaryLink>,
          {" "}
          <OdysseyGlossaryLink locale={locale} slug="characters-penelope">Penelope</OdysseyGlossaryLink>,
          and{" "}
          <OdysseyGlossaryLink locale={locale} slug="characters-athena">Athena</OdysseyGlossaryLink>.
          Together they frame the poem’s main tensions: cunning, maturation, fidelity, and divine guidance.
        </p>

        <p>
          <strong>Book-by-book notes:</strong> this walkthrough is being expanded alongside my own reading. Right now it includes{" "}
          <OdysseyGlossaryLink locale={locale} slug="books-book-1">
            Book 1 — Athena Inspires the Prince
          </OdysseyGlossaryLink>{" "}
          and{" "}
          <OdysseyGlossaryLink locale={locale} slug="books-book-5">
            Book 5 — Odysseus — Nymph and Shipwreck
          </OdysseyGlossaryLink>
          , which together give you the opening of the Telemachy and the first on-stage appearance of Odysseus himself.
        </p>

        <p>
          <strong>Themes and symbols:</strong> many of Homer’s deepest patterns live in recurring ideas such as{" "}
          <OdysseyGlossaryLink locale={locale} slug="themes-xenia">
            xenia
          </OdysseyGlossaryLink>
          , disguise, recognition, and the conditions of return. On the more material side, entries like{" "}
          <OdysseyGlossaryLink locale={locale} slug="symbols-bow">
            The Bow of Odysseus
          </OdysseyGlossaryLink>
          {" "}follow how single objects become carriers of kingship, identity, and vengeance.
        </p>

        <p>
          <strong>History and geography:</strong> the epic is not documentary history, but it is rooted in a real Bronze Age world. The pages on{" "}
          <OdysseyGlossaryLink locale={locale} slug="history-mycenaean">
            the Mycenaean world
          </OdysseyGlossaryLink>
          ,{" "}
          <OdysseyGlossaryLink locale={locale} slug="history-troy-war">
            the Trojan War
          </OdysseyGlossaryLink>
          ,{" "}
          <OdysseyGlossaryLink locale={locale} slug="geography-troy">
            Troy
          </OdysseyGlossaryLink>
          ,{" "}
          <OdysseyGlossaryLink locale={locale} slug="geography-ithaca">
            Ithaca
          </OdysseyGlossaryLink>
          , and{" "}
          <OdysseyGlossaryLink locale={locale} slug="geography-scheria">
            Scheria
          </OdysseyGlossaryLink>
          {" "}are there to connect the poem’s imagined world with archaeology, topography, and map-based orientation.
        </p>

        <p>
          <strong>Reading guidance:</strong>{" "}
          <OdysseyGlossaryLink locale={locale} slug="reading-guide-editions">
            Editions and Translations
          </OdysseyGlossaryLink>
          {" "}compares major English translations, Loeb facing-page editions, and commentary-heavy scholarly options, so you can choose a reading setup that fits how close to the Greek you want to work.
        </p>

        <p>
          This wiki is built from reading notes taken while working through the poem itself. The goal is simple: wherever you are in the <em>Odyssey</em>, you should be able to jump back into the needed context quickly. Use{" "}
          <kbd className="rounded border border-neutral-300 px-1.5 py-0.5 text-[10px] font-mono text-neutral-600">
            ⌘K
          </kbd>
          {" "}to search any character, place, theme, or article from the current locale.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[15.5px] leading-[1.85] text-neutral-700 sm:space-y-7 sm:text-base">
      <p>
        《奥德赛》是西方文学源头的两大荷马史诗之一（另一部是《伊利亚特》）。全诗 24 卷、约
        12000 行六音步扬抑格（dactylic hexameter），讲述特洛伊战争结束后，
        <OdysseyGlossaryLink locale={locale} slug="characters-odysseus">
          奥德修斯
        </OdysseyGlossaryLink>
        （Ὀδυσσεύς / Odysseus）花了十年时间才辗转回到故乡
        <OdysseyGlossaryLink locale={locale} slug="geography-ithaca">
          伊萨卡
        </OdysseyGlossaryLink>
        （Ithaca）岛的故事。与《伊利亚特》聚焦战场上的“愤怒”不同，《奥德赛》的核心情绪是{" "}
        <em className="font-serif text-odyssey">νόστος · nostos</em>——回家。这部 Wiki 正是围绕 nostos 这一条主线建立的。
      </p>

      <p>
        如果你正准备开始读，可以先从{" "}
        <OdysseyGlossaryLink locale={locale} slug="overview-introduction">
          作品结构简介
        </OdysseyGlossaryLink>{" "}
        与{" "}
        <OdysseyGlossaryLink locale={locale} slug="overview-homer">
          荷马与口传史诗传统
        </OdysseyGlossaryLink>{" "}
        入手，快速了解史诗的构成、口头诗歌的叠句与 epithet（修饰套语）是怎么回事；如果想先看整个故事脉络（不介意剧透），可以读{" "}
        <OdysseyGlossaryLink locale={locale} slug="plot-summary-nostos">
          故事主线：归乡
        </OdysseyGlossaryLink>
        ，它把从特洛伊陷落、海上漂泊、回到伊萨卡直至血洗求婚者的全过程串成一条线。
      </p>

      <h2
        className={cn(
          "pt-6 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl",
          fraunces.className
        )}
      >
        {copy.overviewTitle}
      </h2>

      <p>
        <strong>人物谱系：</strong>四大核心角色单独成篇——
        <OdysseyGlossaryLink locale={locale} slug="characters-odysseus">奥德修斯</OdysseyGlossaryLink>
        （多谋的 polytropos 英雄）、
        <OdysseyGlossaryLink locale={locale} slug="characters-telemachus">忒勒马科斯</OdysseyGlossaryLink>
        （Telemachy，少年寻父的成长线）、
        <OdysseyGlossaryLink locale={locale} slug="characters-penelope">珀涅罗珀</OdysseyGlossaryLink>
        （以织机与梦拖延求婚者的王后）、
        <OdysseyGlossaryLink locale={locale} slug="characters-athena">雅典娜</OdysseyGlossaryLink>
        （始终在场的庇护者）；其余神明家族与求婚者阵营后续会陆续补全。
      </p>

      <p>
        <strong>逐卷精读：</strong>每一卷都会整理要点、引文与关键词。目前已经写完{" "}
        <OdysseyGlossaryLink locale={locale} slug="books-book-1">
          Book 1 — Athena Inspires the Prince
        </OdysseyGlossaryLink>
        （忒勒马科马科斯开场）与{" "}
        <OdysseyGlossaryLink locale={locale} slug="books-book-5">
          Book 5 — Odysseus: Nymph and Shipwreck
        </OdysseyGlossaryLink>
        （奥德修斯首次登场，离开卡吕普索，遭遇波塞冬海难登上斯克里亚）。剩余 22 卷会随着我自己阅读进度持续更新。
      </p>

      <p>
        <strong>主题与象征：</strong>史诗的很多妙处藏在反复出现的母题里——
        <OdysseyGlossaryLink locale={locale} slug="themes-xenia">
          xenia（主客之道）
        </OdysseyGlossaryLink>
        （宙斯作为 Xenios 所守护的待客法则，既被求婚者与独目巨人破坏，也被涅斯托尔、墨涅拉奥斯、费埃克斯人践行）、伪装（disguise）、nostos
        之外的归家条件，以及更具象的{" "}
        <OdysseyGlossaryLink locale={locale} slug="symbols-bow">奥德修斯的大弓</OdysseyGlossaryLink>
        （身份与复仇的双重象征，仅合法的主人才能拉开）。
      </p>

      <p>
        <strong>历史与地理：</strong>史诗并非纯粹虚构。了解{" "}
        <OdysseyGlossaryLink locale={locale} slug="history-mycenaean">
          迈锡尼青铜时代的世界
        </OdysseyGlossaryLink>
        （线形文字 B、宫殿经济、赫梯与埃及档案中所见的 Ahhiyawa），以及{" "}
        <OdysseyGlossaryLink locale={locale} slug="history-troy-war">
          特洛伊战争在考古中到底对应什么
        </OdysseyGlossaryLink>
        （Schliemann → Dörpfeld → Blegen 三代人对 Hisarlık 的发掘），会让你读诗时对“战船数目表”“青铜武器”“城墙”等细节有更实感的想象。地理部分则整理了关键地点——故乡{" "}
        <OdysseyGlossaryLink locale={locale} slug="geography-ithaca">伊萨卡</OdysseyGlossaryLink>
        、史诗起点{" "}
        <OdysseyGlossaryLink locale={locale} slug="geography-troy">特洛伊</OdysseyGlossaryLink>
        、中转站{" "}
        <OdysseyGlossaryLink locale={locale} slug="geography-scheria">斯克里亚（Scheria）</OdysseyGlossaryLink>
        ——并提供随文可用的地中海航行地图组件。
      </p>

      <p>
        <strong>文化与阅读：</strong>
        <OdysseyGlossaryLink locale={locale} slug="culture-olympian-gods">
          奥林匹斯信仰与荷马式的诸神
        </OdysseyGlossaryLink>
        （神人同形同性、Zeus 的至上权但有限、献祭与占卜如何运作）；以及在译本方面，{" "}
        <OdysseyGlossaryLink locale={locale} slug="reading-guide-editions">
          译本推荐
        </OdysseyGlossaryLink>{" "}
        会对比 Fagles、Fitzgerald、Lattimore、Loeb 希英对照本、Heubeck 评注版等常见版本的风格，帮助你挑一册顺手的作为案头书。
      </p>

      <p>
        这个站点是我自己读英文原著过程中边查边写的笔记，也希望成为你读到任何位置时，可以随手跳回来的索引与上下文。如果还不知道从哪里进入，推荐顺序：作品简介 → 故事脉络（Nostos）→ Book 1 &amp; Book 5 → 四位核心人物 → xenia 主题 → 再顺着你感兴趣的卷和人物一路展开。按{" "}
        <Badge
          variant="secondary"
          className="text-muted-foreground border-none py-1 select-none"
        >
          <CommandIcon className="size-4 -mr-0.5" />K
        </Badge>
        可以随时全局检索任意词条、人名、地名。
      </p>
    </div>
  );
}

export function TheOdysseyHomePage({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = getOdysseyCopy(locale);
  const allEntries = getAllEntries(locale);
  const totalArticles = allEntries.length;
  const totalCategories = ODYSSEY_CATEGORIES.length;
  const booksCovered = getEntriesByCategory("Books", locale).length;

  const charactersEntries = getEntriesByCategory("Characters", locale);
  const booksEntries = getEntriesByCategory("Books", locale);
  const themesEntries = getEntriesByCategory("Themes", locale);
  const symbolsEntries = getEntriesByCategory("Symbols", locale);
  const historyEntries = getEntriesByCategory("History & Archaeology", locale);
  const geographyEntries = getEntriesByCategory("Geography & Places", locale);
  const cultureEntries = getEntriesByCategory("Culture & Society", locale);
  const readingEntries = getEntriesByCategory("Reading Guide", locale);
  const plotEntries = getEntriesByCategory("Plot Summary", locale);

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
      <section className="page-top-margin w-full border-b border-neutral-200/70 pb-10 sm:pb-14">
        <div className="flex flex-col items-start gap-6">
          <div className="w-full flex flex-col gap-4">
            <h1
              className={cn(
                "soft-70 soft-60 text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl",
                fraunces.className
              )}
            >
              <span className="odyssey-gradient-linear">The Odyssey</span>
              <span className="mt-1 block font-light text-neutral-900">Walkthrough</span>
            </h1>
            <p
              className={cn(
                "max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl",
                fraunces.className
              )}
            >
              {copy.homeHeroLead}
            </p>
          </div>

          <OdysseyCommandTrigger locale={locale} className="w-full max-w-md" />

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[11px]">
              {totalArticles} {copy.articleCategoryEntries}
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              {totalCategories} {copy.articleThemeCategories}
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              {copy.booksCovered} {booksCovered} / 24
            </Badge>
          </div>
        </div>
      </section>

      <section className="w-full py-12 sm:py-16" id="overview">
        <div className="w-full max-w-none">
          <OdysseyHomeOverview locale={locale} />
        </div>
      </section>

      <section className="w-full py-12 sm:py-16" id="map">
        <OdysseyMapCard center={[24.2142, 38.4556]} zoom={5.28} />
      </section>

      <section className="w-full pb-16 sm:pb-20" id="themes">
        <div className="w-full">
          <div className="mb-8 flex flex-col gap-2 sm:mb-10">
            <h2
              className={cn(
                "soft-50 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl",
                fraunces.className
              )}
            >
              {copy.followUpTitle}
            </h2>
            <p className={cn("text-base text-muted-foreground sm:text-lg", fraunces.className)}>
              {copy.followUpDescription}
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {followUpCategories.map((category) => {
              const meta = CATEGORY_META[category];
              const entries: OdysseyEntry[] = (() => {
                switch (category) {
                  case "Plot Summary":
                    return plotEntries;
                  case "Characters":
                    return charactersEntries;
                  case "Books":
                    return booksEntries;
                  case "Themes":
                    return themesEntries;
                  case "Symbols":
                    return symbolsEntries;
                  case "History & Archaeology":
                    return historyEntries;
                  case "Geography & Places":
                    return geographyEntries;
                  case "Culture & Society":
                    return cultureEntries;
                  case "Reading Guide":
                    return readingEntries;
                  default:
                    return getEntriesByCategory(category, locale);
                }
              })();
              const Icon = meta.icon;
              if (entries.length === 0) return null;

              return (
                <div
                  key={category}
                  className="rounded-2xl border border-neutral-200/70 bg-white/60 p-5 sm:p-7"
                >
                  <div className="mb-4 flex items-start justify-between gap-4 sm:mb-6">
                    <div className="flex min-w-0 items-start gap-3">
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
                            "mb-1 text-xl font-semibold text-neutral-900 sm:text-2xl",
                            fraunces.className
                          )}
                        >
                          {getOdysseyCategoryLabel(category, locale)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getOdysseyCategoryDescription(category, locale)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px] sm:text-[11px]">
                      {entries.length} {copy.entriesLabel}
                    </Badge>
                  </div>

                  <ul className="space-y-1">
                    {entries.map((entry, idx) => (
                      <li key={entry._meta.path} className="list-none">
                        <Link
                          href={getOdysseyEntryHref(locale, entry)}
                          className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-100/80"
                        >
                          <span className="w-7 shrink-0 pt-0.5 text-right font-mono text-[11px] tabular-nums text-neutral-400">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div
                              className={cn(
                                "truncate text-base font-medium text-neutral-900 transition-colors group-hover:text-odyssey sm:text-[17px]",
                                fraunces.className
                              )}
                            >
                              {getOdysseyEntryTitle(entry, locale)}
                            </div>
                            {getOdysseyEntrySummary(entry, locale) && (
                              <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                {getOdysseyEntrySummary(entry, locale)}
                              </p>
                            )}
                          </div>
                          <ArrowUpRight className="mt-1.5 size-4 shrink-0 text-neutral-300 transition-colors group-hover:text-odyssey" />
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

export default function TheOdysseyHomePageDefault() {
  return <TheOdysseyHomePage locale={DEFAULT_LOCALE} />;
}
