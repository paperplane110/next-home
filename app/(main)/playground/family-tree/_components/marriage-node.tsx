"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import type { MarriageNodeData } from "../_types/graph";

export function MarriageNode({ data }: NodeProps) {
  const marriage = data as MarriageNodeData;

  return (
    <div className="grid place-items-center">
      <Handle
        type="target"
        position={Position.Top}
        className="h-2.5! w-2.5! border-0! bg-stone-400!"
      />
      <div className="size-10 border rounded-full flex justify-center items-center bg-muted">
        {marriage.label ? (
          <span className="text-[10px] text-muted-foreground">
            {marriage.label}
          </span>
        ) : null}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2.5! w-2.5! border-0! bg-stone-400!"
      />
    </div>
  );
}
