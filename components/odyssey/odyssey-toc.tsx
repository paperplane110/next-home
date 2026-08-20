"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  level: number;
  text: string;
  slug: string;
}

interface OdysseyTocProps {
  headings: Heading[];
  className?: string;
}

export function OdysseyToc({ headings, className }: OdysseyTocProps) {
  const [activeSlug, setActiveSlug] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveSlug(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
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
        On this page
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
                activeSlug === heading.slug
                  ? "text-odyssey font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.slug);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveSlug(heading.slug);
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
