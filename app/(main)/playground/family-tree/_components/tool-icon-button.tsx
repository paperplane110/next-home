"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolIconButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export function ToolIconButton({
  label,
  active = false,
  onClick,
  disabled = false,
  children,
}: ToolIconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={label}
            aria-disabled={disabled}
            onClick={disabled ? undefined : onClick}
            className={cn(
              "rounded-[18px] border border-transparent text-stone-600 shadow-none transition-colors",
              active
                ? "bg-stone-900 text-white hover:bg-stone-900/90 hover:text-white"
                : "hover:bg-stone-100",
              disabled && "cursor-not-allowed opacity-55",
            )}
          >
            {children}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
