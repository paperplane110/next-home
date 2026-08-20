"use client";

import { SearchIcon } from "lucide-react";
import { useSetAtom } from "jotai";
import { Badge } from "@/components/ui/badge";
import { helperCommandOpenAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";

interface OdysseyCommandTriggerProps {
  onClick?: () => void;
  className?: string;
}

export function OdysseyCommandTrigger({ onClick, className }: OdysseyCommandTriggerProps) {
  const setHelperOpen = useSetAtom(helperCommandOpenAtom);

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
      <span className="flex-1 text-left">Search Odyssey</span>
      <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-mono font-normal">
        ⌘K
      </Badge>
    </button>
  );
}
