"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { BiographyPersonData } from "../_types/graph";

const categoryStyles: Record<BiographyPersonData["category"], string> = {
  family: "border-amber-300 bg-amber-50/90",
  professional: "border-slate-300 bg-slate-50",
  media: "border-sky-300 bg-sky-50/90",
  political: "border-violet-300 bg-violet-50/90",
  business: "border-emerald-300 bg-emerald-50/90",
  social: "border-rose-300 bg-rose-50/90",
  other: "border-zinc-300 bg-zinc-50/90",
};

export function PersonNode({ data, selected }: NodeProps) {
  const person = data as BiographyPersonData;

  return (
    <div
      className={cn(
        "min-w-[220px] max-w-[240px] rounded-2xl border px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-colors",
        categoryStyles[person.category],
        selected && "ring-2 ring-primary/30",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "none", border: "none", width: 8, height: 8 }}
      >
        <div className={cn("size-2 border rounded-full", categoryStyles[person.category])}></div>
      </Handle>
      <div className="flex flex-wrap gap-1">
        {person.badges?.map((badge) => (
          <Badge
            key={badge}
            variant="secondary"
            className="rounded-full text-[10px] text-muted-foreground"
          >
            {badge}
          </Badge>
        ))}
      </div>
      <div className="mt-2 text-base font-semibold text-accent-foreground">{person.name}</div>
      {/* {person.birthDeath ? (
        <div className="mt-0.5 text-xs text-stone-500">{person.birthDeath}</div>
      ) : null} */}
      {person.title ? (
        <div className="mt-2 text-sm leading-5 text-muted-foreground">{person.title}</div>
      ) : null}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "none", border: "none", width: 8, height: 8 }}
      >
        <div className={cn("size-2 border rounded-full", categoryStyles[person.category])}></div>
      </Handle>
    </div>
  );
}
