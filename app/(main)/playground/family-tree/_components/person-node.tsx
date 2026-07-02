"use client";

import type { MouseEvent } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { BiographyPersonData } from "../_types/graph";
import { useFamilyTreeTheme } from "./family-tree-theme-provider";

export function PersonNode({ id, data, selected }: NodeProps) {
  const person = data as BiographyPersonData;
  const { personCategoryMeta } = useFamilyTreeTheme();
  const theme = personCategoryMeta[person.category].theme;

  function stopNodeActionEvent(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  return (
    <div
      className={cn(
        "relative min-w-[180px] max-w-[240px] rounded-2xl border px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-colors",
        theme.border,
        theme.bg,
        selected && "ring-1",
        selected && theme.ring,
      )}
    >
      {/* 操作按钮 */}
      {selected ? (
        <div className="pointer-events-auto absolute right-0 -top-10 z-10 flex items-center gap-1">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="text-stone-600 hover:bg-stone-600/10"
            aria-label={`编辑 ${person.name}`}
            onMouseDown={stopNodeActionEvent}
            onClick={(event) => {
              stopNodeActionEvent(event);
              person.actions?.onEdit?.(id);
            }}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label={`删除 ${person.name}`}
            onMouseDown={stopNodeActionEvent}
            onClick={(event) => {
              stopNodeActionEvent(event);
              person.actions?.onDelete?.(id);
            }}
          >
            <Trash2 />
          </Button>
        </div>
      ) : null}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "none", border: "none", width: 8, height: 8 }}
      >
        <div className={cn("size-2 border rounded-full", theme.border, theme.bg)}></div>
      </Handle>
      <div className={cn(
        "flex flex-wrap gap-1",
        person.badges?.length !== 0 && "mb-2"
      )}>
        {person.badges?.map((badge) => (
          <Badge
            key={badge}
            variant="secondary"
            className={cn("rounded-full text-[10px]", theme.badgeBg, theme.badgeText)}
          >
            {badge}
          </Badge>
        ))}
      </div>
      <div className="text-sm font-semibold text-accent-foreground">{person.name}</div>
      {/* {person.birthDeath ? (
        <div className="mt-0.5 text-xs text-stone-500">{person.birthDeath}</div>
      ) : null} */}
      {person.title ? (
        <div className="mt-1 text-xs leading-5 text-muted-foreground">{person.title}</div>
      ) : null}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "none", border: "none", width: 8, height: 8 }}
      >
        <div className={cn("size-2 border rounded-full", theme.border, theme.bg)}></div>
      </Handle>
    </div>
  );
}
