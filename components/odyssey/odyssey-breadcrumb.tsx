import Link from "next/link";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { ChevronRight } from "lucide-react";
import type { OdysseyCategory } from "@/lib/odyssey";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getOdysseyCategoryLabel, getOdysseyHomeHref } from "@/lib/odyssey-i18n";

interface OdysseyBreadcrumbProps {
  category: OdysseyCategory;
  title: string;
  className?: string;
  locale?: Locale;
}

export function OdysseyBreadcrumb({ category, title, className, locale = DEFAULT_LOCALE }: OdysseyBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1 text-muted-foreground",
        fraunces.className,
        className
      )}
    >

      <Link
        href={getOdysseyHomeHref(locale)}
        className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        {/* <BookOpen className="size-3.5" /> */}
        <span>The Odyssey</span>
      </Link>
      <ChevronRight className="size-3.5 text-neutral-400" />
      <Link
        href={`${getOdysseyHomeHref(locale)}#category-${category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")}`}
        className="transition-colors hover:text-foreground"
      >
        {getOdysseyCategoryLabel(category, locale)}
      </Link>
      <ChevronRight className="size-3.5 text-neutral-400" />
      <span className="text-foreground font-medium line-clamp-1">{title}</span>
    </nav>
  );
}
