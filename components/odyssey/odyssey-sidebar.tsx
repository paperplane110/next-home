"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ODYSSEY_CATEGORIES,
  CATEGORY_META,
  getEntriesByCategory,
  getCategoryCounts,
  type OdysseyCategory,
  type OdysseyEntry,
} from "@/lib/odyssey";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

function buildEntryHref(entry: OdysseyEntry): string {
  return `/the-odyssey/${entry._meta.path}`;
}

function findCategoryFromPathname(
  pathname: string
): OdysseyCategory | null {
  const slug = pathname.replace(/^\/the-odyssey\//, "");
  for (const category of ODYSSEY_CATEGORIES) {
    const entries = getEntriesByCategory(category);
    if (entries.some((e) => e._meta.path === slug)) {
      return category;
    }
  }
  return null;
}

export function OdysseySidebar() {
  const pathname = usePathname();
  const categoryCounts = useMemo(() => getCategoryCounts(), []);
  const activeCategory = useMemo(
    () => findCategoryFromPathname(pathname),
    [pathname]
  );

  const [openCategories, setOpenCategories] = useState<
    Set<OdysseyCategory>
  >(new Set(ODYSSEY_CATEGORIES));

  useEffect(() => {
    if (activeCategory) {
      setOpenCategories((prev) => {
        if (prev.has(activeCategory)) return prev;
        const next = new Set(prev);
        next.add(activeCategory);
        return next;
      });
    }
  }, [activeCategory]);

  const toggleCategory = (category: OdysseyCategory) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const currentSlug = pathname.replace(/^\/the-odyssey\//, "");

  return (
    <div className="w-full h-full min-h-0 flex flex-col" data-lenis-prevent data-lenis-prevent-wheel>
      <ScrollArea className="relative flex-1 h-0 min-h-0 w-full **:data-[slot=scroll-area-scrollbar]:hidden">

        {/* Top Transparent Mask */}
        <div className="absolute z-10 top-0 left-0 w-full h-10 bg-linear-to-t from-transparent to-white pointer-events-none" />
        {/* Bottom Transparent Mask */}
        <div className="absolute z-10 bottom-0 left-0 w-full h-10 bg-linear-to-b from-transparent to-white pointer-events-none" />

        {/* Sidebar Content */}
        <div className="h-full lg:w-58">
          <div className="h-5" />
          <Link href="/the-odyssey">
            <div className={cn(
              "w-full flex items-center gap-2 px-2 py-2 rounded-md text-left",
              "transition-colors hover:bg-neutral-100/80",
              "font-serif soft-70 font-bold"
            )}>
              The Odyssey
            </div>
          </Link>
          {ODYSSEY_CATEGORIES.map((category) => {
            const entries = getEntriesByCategory(category);
            const meta = CATEGORY_META[category];
            const isOpen = openCategories.has(category);
            const isActiveCat = activeCategory === category;

            return (
              <Collapsible
                key={category}
                open={isOpen}
                onOpenChange={() => toggleCategory(category)}
                className="mb-1"
              >
                <CollapsibleTrigger
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-md text-left",
                    "transition-colors hover:bg-neutral-100/80",
                    "group",
                    isActiveCat && "bg-neutral-50"
                  )}
                >
                  <ChevronRight
                    className={cn(
                      "size-4 shrink-0 text-neutral-400 transition-transform duration-200",
                      isOpen && "rotate-90",
                      isActiveCat && "text-odyssey"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium truncate",
                        isActiveCat ? "text-neutral-900" : "text-neutral-700"
                      )}
                    >
                      {category}
                    </div>
                    {/* <div className="hidden lg:block text-[11px] text-neutral-500 truncate">
                      {meta.description}
                    </div> */}
                  </div>

                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                  <div className="pl-6 pr-2 py-1 flex flex-col">
                    {entries.map((entry) => {
                      const href = buildEntryHref(entry);
                      const isActiveEntry = entry._meta.path === currentSlug;
                      const displayTitle = entry.shortTitle?.trim() || entry.title;

                      return (
                        <Link
                          key={entry._meta.path}
                          href={href}
                          title={
                            entry.shortTitle && entry.shortTitle.trim() !== entry.title
                              ? entry.title
                              : undefined
                          }
                          className={cn(
                            "block px-2 py-1.5 rounded-md text-sm transition-colors",
                            "truncate text-xs",
                            isActiveEntry
                              ? "bg-odyssey/10 text-odyssey font-medium"
                              : "text-neutral-600 hover:bg-neutral-100/60 hover:text-neutral-900"
                          )}
                        >
                          {displayTitle}
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
        <div className="h-10" />
      </ScrollArea>
    </div>
  );
}
