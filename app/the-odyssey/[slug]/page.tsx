import Link from "next/link";
import { MDXContent } from "@content-collections/mdx/react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allOdysseys } from "content-collections";

import { OdysseyToc } from "@/components/odyssey/odyssey-toc";
import { OdysseyRelated } from "@/components/odyssey/odyssey-related";
import { getRelatedEntries, type OdysseyEntry } from "@/lib/odyssey";
import { Badge } from "@/components/ui/badge";
import { BlockQuote } from "@/components/mdx/block-quote";
import { OdysseyA } from "@/components/mdx/odyssey-a";
import { Tips } from "@/components/mdx/tips";
import { CharacterCard } from "@/components/mdx/character-card";
import { OdysseyMap } from "@/components/mdx/odyssey-map";
import { cn } from "@/lib/utils";
import { fraunces, crimsonPro } from "@/lib/fonts";
import { BookMarked } from "lucide-react";

export function generateStaticParams() {
  return allOdysseys.map((entry) => ({ slug: entry._meta.path }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = allOdysseys.find((e) => e._meta.path === slug);

  if (!entry) {
    return {};
  }

  const url = `https://tyyuan.me/the-odyssey/${slug}`;

  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: `/the-odyssey/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.summary,
      url,
      tags: entry.tags,
      section: entry.category,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.summary,
    },
  };
}

function ArticleContent({ entry }: { entry: OdysseyEntry }) {
  const headings = entry.headings || [];
  const hasHeadings = headings.length > 0;
  // const isShortArticle = headings.filter((h) => h.level <= 3).length < 4;
  const relatedEntries = getRelatedEntries(entry.related || []);

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
                  {entry.category}
                </Badge>
              </div>
              <h1
                className={cn(
                  "text-4xl sm:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.1] mb-6",
                  crimsonPro.className
                )}
              >
                {entry.title}
              </h1>
              <p
                className={cn(
                  "text-lg sm:text-[1.05rem] text-muted-foreground leading-relaxed mb-6"
                )}
              >
                {entry.summary}
              </p>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <Link key={tag} href="/the-odyssey">
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
                <OdysseyToc headings={headings} />
              </div>
            )}

            <div className="mdx-content">
              <MDXContent
                code={entry.mdx}
                components={{
                  blockquote: BlockQuote,
                  a: OdysseyA,
                  Tips: ({
                    children,
                    title,
                  }: {
                    children: React.ReactNode;
                    title?: string;
                  }) => <Tips title={title}>{children}</Tips>,
                  CharacterCard: (props: any) => <CharacterCard {...props} />,
                  OdysseyMap: (props: any) => <OdysseyMap {...props} />,
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
                  References &amp; Sources
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
              <OdysseyRelated entries={relatedEntries} />
            </div>
          </div>
        </div>

        {hasHeadings && (
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-24 max-h-[calc(100dvh-6rem)] overflow-y-auto py-6 pl-6 border-l border-neutral-200/70">
              <OdysseyToc headings={headings} />
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
            headline: entry.title,
            description: entry.summary,
            articleSection: entry.category,
            keywords: (entry.tags || []).join(", "),
            author: { "@type": "Person", name: "Tianyu" },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://tyyuan.me/the-odyssey/${entry._meta.path}`,
            },
          }),
        }}
      />
    </article>
  );
}

export default async function TheOdysseyEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = allOdysseys.find((e) => e._meta.path === slug);

  if (!entry) {
    notFound();
  }

  return <ArticleContent entry={entry} />;
}
