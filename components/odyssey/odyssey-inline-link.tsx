"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_META } from "@/lib/odyssey";
import { cn } from "@/lib/utils";
import type { OdysseyEntry } from "@/lib/odyssey";

type Props = {
  href: string;
  children: React.ReactNode;
  entry?: OdysseyEntry;
};

function OdysseyInlineCard({ entry }: { entry: OdysseyEntry }) {
  const Icon = CATEGORY_META[entry.category]?.icon;
  const accent = CATEGORY_META[entry.category]?.accent ?? "text-neutral-700";
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
              "flex-none w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden shrink-0",
              "bg-linear-to-br from-odyssey-50 via-white to-odyssey-100/60 border border-odyssey-100/80 shadow-sm"
            )}
            aria-hidden
          >
            {entry.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={entry.cover}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              Icon ? (
                <Icon className={cn("w-7 h-7", accent)} />
              ) : null
            )}
          </div>
        ) : null}

        <div className="flex-1 min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <div className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral-900">
              {entry.shortTitle ?? entry.title}
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "h-4 shrink-0 px-1.5 py-0 text-[10px] font-normal",
                accent
              )}
            >
              {entry.category}
            </Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {entry.title}
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-neutral-700">
        {entry.summary}
      </p>
    </div>
  );
}

export default function OdysseyInlineLink({ href, children, entry }: Props) {
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
        "font-medium text-odyssey underline decoration-odyssey/30 underline-offset-4 transition-colors hover:decoration-odyssey hover:text-odyssey/90 outline-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-odyssey/60 focus-visible:ring-offset-2 focus-visible:rounded-sm"
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
        <OdysseyInlineCard entry={entry} />
      </PopoverContent>
    </Popover>
  );
}
