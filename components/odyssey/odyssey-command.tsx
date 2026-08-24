"use client";

import { CommandIcon, SearchIcon } from "lucide-react";
import { useSetAtom } from "jotai";
import { Badge } from "@/components/ui/badge";
import { helperCommandOpenAtom } from "@/lib/atoms";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getOdysseyCopy } from "@/lib/odyssey-i18n";
import { cn } from "@/lib/utils";

interface OdysseyCommandTriggerProps {
  onClick?: () => void;
  className?: string;
  locale?: Locale;
}

export function OdysseyCommandTrigger({
  onClick,
  className,
  locale = DEFAULT_LOCALE,
}: OdysseyCommandTriggerProps) {
  const setHelperOpen = useSetAtom(helperCommandOpenAtom);
  const copy = getOdysseyCopy(locale);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setHelperOpen(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      <SearchIcon className="size-4" />
      <span className="flex-1 text-left">{copy.searchLabel}</span>
      <Badge
        variant="secondary"
        className="text-muted-foreground border-none py-1 select-none cursor-pointer"
      >
        <CommandIcon className="size-4 -mr-0.5" />K
      </Badge>
    </button>
  );
}
