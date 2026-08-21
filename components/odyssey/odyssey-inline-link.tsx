"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  getOdysseyEntryCover,
  getOdysseyEntryDisplayTitle,
  getOdysseyEntrySummary,
  getOdysseyEntryTitle,
  CATEGORY_META,
  type OdysseyEntry,
} from "@/lib/odyssey";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getOdysseyCategoryLabel } from "@/lib/odyssey-i18n";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  entry?: OdysseyEntry;
  locale?: Locale;
};

function OdysseyInlineCard({
  entry,
  locale,
}: {
  entry: OdysseyEntry;
  locale: Locale;
}) {
  const Icon = CATEGORY_META[entry.category]?.icon;
  const accent = CATEGORY_META[entry.category]?.accent ?? "text-neutral-700";
  const displayTitle = getOdysseyEntryDisplayTitle(entry, locale);
  const title = getOdysseyEntryTitle(entry, locale);
  const summary = getOdysseyEntrySummary(entry, locale);
  const cover = getOdysseyEntryCover(entry, locale);
  const needsThumb =
    entry.category === "Characters" ||
    entry.category === "Geography & Places" ||
    entry.category === "Symbols";

  return (
    <div className="flex flex-col gap-3 overflow-hidden">
      <div className="flex items-center gap-3">
        {needsThumb ? (
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl",
              "border border-odyssey-100/80 bg-linear-to-br from-odyssey-50 via-white to-odyssey-100/60 shadow-sm"
            )}
            aria-hidden
          >
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : Icon ? (
              <Icon className={cn("h-7 w-7", accent)} />
            ) : null}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <div className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral-900">
              {displayTitle}
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "h-4 shrink-0 px-1.5 py-0 text-[10px] font-normal",
                accent
              )}
            >
              {getOdysseyCategoryLabel(entry.category, locale)}
            </Badge>
          </div>
          <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {title}
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-neutral-700">{summary}</p>
    </div>
  );
}

export default function OdysseyInlineLink({
  href,
  children,
  entry,
  locale = DEFAULT_LOCALE,
}: Props) {
  const [open, setOpen] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimer.current !== null) {
        window.clearTimeout(hoverTimer.current);
      }
      if (leaveTimer.current !== null) {
        window.clearTimeout(leaveTimer.current);
      }
    };
  }, []);

  const cancelClose = () => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const openSoon = () => {
    cancelClose();
    if (hoverTimer.current !== null || open) return;
    hoverTimer.current = window.setTimeout(() => {
      setOpen(true);
      hoverTimer.current = null;
    }, 130);
  };

  const closeSoon = () => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    cancelClose();
    leaveTimer.current = window.setTimeout(() => {
      setOpen(false);
      leaveTimer.current = null;
    }, 180);
  };

  const body = (
    <Link
      href={href}
      className={cn(
        "font-medium text-odyssey underline decoration-odyssey/30 underline-offset-4 transition-colors hover:text-odyssey/90 hover:decoration-odyssey outline-none",
        "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-odyssey/60 focus-visible:ring-offset-2"
      )}
      onPointerEnter={openSoon}
      onPointerLeave={closeSoon}
      onFocus={() => {
        clearTimers();
        setOpen(true);
      }}
      onBlur={() => {
        clearTimers();
        setOpen(false);
      }}
    >
      {children}
    </Link>
  );

  if (!entry) {
    return body;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{body}</PopoverTrigger>
      <PopoverContent
        sideOffset={6}
        align="start"
        collisionPadding={12}
        className="w-[min(20rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-2xl border-neutral-200/90 bg-white/98 p-4 shadow-xl shadow-odyssey-900/5 backdrop-blur-sm"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
        onPointerEnter={() => {
          cancelClose();
        }}
        onPointerLeave={() => {
          closeSoon();
        }}
      >
        <OdysseyInlineCard entry={entry} locale={locale} />
      </PopoverContent>
    </Popover>
  );
}
