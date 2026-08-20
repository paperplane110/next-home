import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { fraunces } from "@/lib/fonts";
import type { OdysseyEntry } from "@/lib/odyssey";

interface OdysseyRelatedProps {
  entries: OdysseyEntry[];
  className?: string;
}

export function OdysseyRelated({ entries, className }: OdysseyRelatedProps) {
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
        {entries.map((entry) => (
          <Link
            key={entry._meta.path}
            href={`/the-odyssey/${entry._meta.path}`}
            className={cn(
              "group block rounded-xl border border-neutral-200/70 bg-white",
              "p-5 transition-all hover:border-neutral-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <Badge variant="secondary" className="text-[10px]">
                {entry.category}
              </Badge>
              <ArrowUpRight className="size-4 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-600" />
            </div>
            <h3
              className={cn(
                "text-lg font-medium text-neutral-900 mb-2 line-clamp-2",
                fraunces.className
              )}
            >
              {entry.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {entry.summary}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
