import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { fraunces } from "@/lib/fonts";
import {
  getOdysseyEntrySummary,
  getOdysseyEntryTitle,
  type OdysseyEntry,
} from "@/lib/odyssey";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getOdysseyCategoryLabel, getOdysseyEntryHref } from "@/lib/odyssey-i18n";

interface OdysseyRelatedProps {
  entries: OdysseyEntry[];
  className?: string;
  locale?: Locale;
}

export function OdysseyRelated({ entries, className, locale = DEFAULT_LOCALE }: OdysseyRelatedProps) {
  if (entries.length === 0) return null;

  return (
    <section className={cn("border-t border-neutral-200/70 pt-10", className)}>
      <h2
        className={cn(
          "text-2xl font-semibold text-neutral-900 mb-6",
          fraunces.className
        )}
      >
        Related Reading
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => {
          const title = getOdysseyEntryTitle(entry, locale);
          const summary = getOdysseyEntrySummary(entry, locale);

          return (
            <Link
              key={entry._meta.path}
              href={getOdysseyEntryHref(locale, entry)}
              className={cn(
                "group block rounded-xl border border-neutral-200/70 bg-white",
                "p-5 transition-all hover:border-neutral-300 hover:shadow-sm"
              )}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <Badge variant="secondary" className="text-[10px]">
                  {getOdysseyCategoryLabel(entry.category, locale)}
                </Badge>
                <ArrowUpRight className="size-4 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-600" />
              </div>
              <h3
                className={cn(
                  "mb-2 line-clamp-2 text-lg font-medium text-neutral-900",
                  fraunces.className
                )}
              >
                {title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {summary}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
