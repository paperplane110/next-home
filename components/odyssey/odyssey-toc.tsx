"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getOdysseyCopy } from "@/lib/odyssey-i18n";
import { cn } from "@/lib/utils";

interface Heading {
  level: number;
  text: string;
  slug: string;
}

interface OdysseyTocProps {
  headings: Heading[];
  className?: string;
  locale?: Locale;
}

export function OdysseyToc({
  headings,
  className,
  locale = DEFAULT_LOCALE,
}: OdysseyTocProps) {
  const [activeSlugs, setActiveSlugs] = useState<Set<string>>(() => new Set());
  const copy = getOdysseyCopy(locale);

  useEffect(() => {
    if (headings.length === 0) return;

    // 观察带：从 sticky header 下方一直延伸到视口底部，
    // 所有出现在正文可见区域内的 heading 都会同时高亮
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        setActiveSlugs(new Set(visible));
      },
      {
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0,
      }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.slug);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={cn("w-full", className)}
    >
      <p className="text-sm font-semibold mb-3">
        {copy.tocLabel}
      </p>
      <ul className="space-y-1 flex flex-col gap-1">
        {headings.map((heading) => (
          <li className="list-none" key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              className={cn(
                "text-sm transition-colors",
                heading.level === 2 && "pl-0",
                heading.level === 3 && "pl-3",
                heading.level >= 4 && "pl-6",
                activeSlugs.has(heading.slug)
                  ? "text-odyssey font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.slug);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              {/* <Hash
                className={cn(
                  "size-3.5 shrink-0 mt-0.5 opacity-0 transition-opacity group-hover:opacity-50",
                  activeSlug === heading.slug && "opacity-100"
                )}
              /> */}
              <span className="leading-snug">{heading.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
