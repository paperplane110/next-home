"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

import { cn } from "@/lib/utils";

import type { RelationshipEdgeData, RelationshipType } from "../_types/graph";

const relationStyles: Record<
  RelationshipType,
  { stroke: string; labelClassName: string; strokeWidth?: number; dashArray?: string }
> = {
  blood: {
    stroke: "#57534e",
    labelClassName: "border-stone-200 bg-white text-stone-600",
    strokeWidth: 1.8,
  },
  marriage: {
    stroke: "#0f172a",
    labelClassName: "border-stone-200 bg-stone-900 text-stone-50",
    strokeWidth: 2.2,
  },
  employ: {
    stroke: "#0369a1",
    labelClassName: "border-sky-200 bg-sky-50 text-sky-700",
    dashArray: "7 5",
  },
  peer: {
    stroke: "#7c3aed",
    labelClassName: "border-violet-200 bg-violet-50 text-violet-700",
    dashArray: "6 4",
  },
  ally: {
    stroke: "#be123c",
    labelClassName: "border-rose-200 bg-rose-50 text-rose-700",
  },
  mentor: {
    stroke: "#047857",
    labelClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  friendship: {
    stroke: "#f59e0b",
    labelClassName: "border-amber-200 bg-amber-50 text-amber-700",
    dashArray: "4 4",
  },
};

export function CustomRelationEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const edgeData = data as RelationshipEdgeData;
  const relationStyle = relationStyles[edgeData.relationshipType];

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: relationStyle.stroke,
          strokeWidth: relationStyle.strokeWidth ?? 2,
          strokeDasharray: relationStyle.dashArray,
        }}
      />
      {edgeData.label ? (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            className={cn(
              "rounded-full border px-2 py-1 text-[11px] font-medium shadow-sm",
              relationStyle.labelClassName,
            )}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
