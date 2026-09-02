import Link from "next/link";
import { MDXContent } from "@content-collections/mdx/react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allOdysseys } from "content-collections";

import { OdysseyToc } from "@/components/odyssey/odyssey-toc";
import { OdysseyRelated } from "@/components/odyssey/odyssey-related";
import {
  getEntryBySlug,
  getOdysseyEntrySummary,
  getOdysseyEntryTags,
  getOdysseyEntryTitle,
  getRelatedEntries,
  type OdysseyEntry,
} from "@/lib/odyssey";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import {
  getOdysseyCategoryLabel,
  getOdysseyCopy,
  getOdysseyEntryHref,
  getOdysseyHomeHref,
} from "@/lib/odyssey-i18n";
import { Badge } from "@/components/ui/badge";
import { BlockQuote } from "@/components/mdx/block-quote";
import { OdysseyA } from "@/components/mdx/odyssey-a";
import { Tips } from "@/components/mdx/tips";
import { CharacterCard } from "@/components/mdx/character-card";
import { OdysseyMap } from "@/components/mdx/odyssey-map";
import type { CharacterCardProps } from "@/components/mdx/character-card";
import type { OdysseyMapProps } from "@/components/mdx/odyssey-map";
import { cn } from "@/lib/utils";
import { fraunces, crimsonPro } from "@/lib/fonts";
import { BookMarked } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function generateStaticParams() {
  return Array.from(new Set(allOdysseys.map((entry) => entry._meta.path.replace(/^(?:zh|en)\//, "")))).map((slug) => ({ slug }));
}

export async function buildOdysseyEntryMetadata({
  params,
  locale = DEFAULT_LOCALE,
}: {
  params: Promise<{ slug: string }>;
  locale?: Locale;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug(slug, locale);

  if (!entry) {
    return {};
  }

  const href = getOdysseyEntryHref(locale, slug);
  const url = `https://tyyuan.me${href}`;

  return {
    title: getOdysseyEntryTitle(entry, locale),
    description: getOdysseyEntrySummary(entry, locale),
    alternates: { canonical: href },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title: getOdysseyEntryTitle(entry, locale),
      description: getOdysseyEntrySummary(entry, locale),
      url,
      tags: getOdysseyEntryTags(entry, locale),
      section: getOdysseyCategoryLabel(entry.category, locale),
    },
    twitter: {
      card: "summary_large_image",
      title: getOdysseyEntryTitle(entry, locale),
      description: getOdysseyEntrySummary(entry, locale),
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return buildOdysseyEntryMetadata({ params });
}

function ArticleContent({
  entry,
  locale = DEFAULT_LOCALE,
}: {
  entry: OdysseyEntry;
  locale?: Locale;
}) {
  const headings = entry.headings || [];
  const hasHeadings = headings.length > 0;
  const relatedEntries = getRelatedEntries(entry.related || [], locale);
  const copy = getOdysseyCopy(locale);
  const title = getOdysseyEntryTitle(entry, locale);
  const summary = getOdysseyEntrySummary(entry, locale);
  const tags = getOdysseyEntryTags(entry, locale);

  return (
    <article className="w-full">

      <div className="w-full flex">
        <div className={cn(
          "w-full flex flex-col items-center",
          "2xl:items-start 2xl:pl-36"
          )}>
          <div className="pt-8 pb-16 sm:pb-20 px-6 md:max-w-[calc(768px-3rem)]">

            <header className="mb-10 sm:mb-12">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="text-[11px]">
                  {getOdysseyCategoryLabel(entry.category, locale)}
                </Badge>
              </div>
              <h1
                className={cn(
                  "text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1] mb-6",
                  "odyssey-gradient-linear",
                  crimsonPro.className
                )}
              >
                {title}
              </h1>
              <p
                className={cn(
                  "text-lg sm:text-[1.05rem] text-muted-foreground leading-relaxed mb-6"
                )}
              >
                {summary}
              </p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link key={tag} href={getOdysseyHomeHref(locale)}>
                      <Badge
                        variant="outline"
                        className="text-[11px] transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* TOC card when screen < xl */}
            {hasHeadings && (
              <div className="block xl:hidden rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-4 sm:p-5 mb-10">
                <OdysseyToc headings={headings} locale={locale} />
              </div>
            )}

            <div className="mdx-content">
              <MDXContent
                code={entry.mdx}
                components={{
                  blockquote: BlockQuote,
                  a: (props: ComponentProps<"a">) => <OdysseyA {...props} locale={locale} />,
                  Tips: ({
                    children,
                    title,
                  }: {
                    children: ReactNode;
                    title?: string;
                  }) => <Tips title={title}>{children}</Tips>,
                  CharacterCard: (props: CharacterCardProps) => <CharacterCard {...props} locale={locale} />,
                  OdysseyMap: (props: OdysseyMapProps) => (
                    <OdysseyMap
                      {...props}
                      points={entry.map?.points}
                      routes={entry.map?.routes}
                      geo={entry.geo}
                      locale={locale}
                    />
                  ),
                }}
              />
            </div>

            {entry.references && entry.references.length > 0 && (
              <section className="mt-16 sm:mt-20 border-t border-neutral-200/70 pt-10">
                <h2
                  className={cn(
                    "text-2xl font-semibold text-neutral-900 mb-6 flex items-center gap-2",
                    fraunces.className
                  )}
                >
                  <BookMarked className="size-5 text-neutral-500" />
                  {copy.referencesTitle}
                </h2>
                <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                  {entry.references.map((ref, idx) => (
                    <li key={idx} className="pl-1 leading-relaxed">
                      {ref}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <div className="mt-16 sm:mt-20">
              <OdysseyRelated entries={relatedEntries} locale={locale} />
            </div>
          </div>
        </div>

        {hasHeadings && (
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-24 max-h-[calc(100dvh-6rem)] overflow-y-auto py-6 pl-6 border-l border-neutral-200/70">
              <OdysseyToc headings={headings} locale={locale} />
            </div>
          </aside>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: summary,
            articleSection: getOdysseyCategoryLabel(entry.category, locale),
            keywords: tags.join(", "),
            author: { "@type": "Person", name: "Tianyu" },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://tyyuan.me${getOdysseyEntryHref(locale, entry._meta.path)}`,
            },
          }),
        }}
      />
    </article>
  );
}

export async function TheOdysseyEntryPage({
  params,
  locale = DEFAULT_LOCALE,
}: {
  params: Promise<{ slug: string }>;
  locale?: Locale;
}) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug, locale);

  if (!entry) {
    notFound();
  }

  return <ArticleContent entry={entry} locale={locale} />;
}

export default async function TheOdysseyEntryPageDefault({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return TheOdysseyEntryPage({ params, locale: DEFAULT_LOCALE });
}
