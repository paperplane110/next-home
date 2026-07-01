"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

import { cn } from "@/lib/utils";

import type { RelationshipEdgeData, RelationshipType } from "../_types/graph";
import { getEdgeDisplayLabel } from "../_utils/edge-meta";

const relationStyles: Record<
  RelationshipType,
  { stroke: string; labelClassName: string; strokeWidth?: number; dashArray?: string }
> = {
  blood: {
    stroke: "#57534e",
    labelClassName: "border-stone-200 bg-white text-stone-600",
    strokeWidth: 1.8,
  },
  adoption: {
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
    stroke: "#0369a1",
    labelClassName: "border-sky-200 bg-sky-50 text-sky-700",
    dashArray: "6 4",
  },
  ally: {
    stroke: "#7c3aed",
    labelClassName: "border-purple-200 bg-purple-50 text-purple-700",
  },
  mentor: {
    stroke: "#f59e0b",
    labelClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
  friendship: {
    stroke: "#047857",
    labelClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dashArray: "4 4",
  },
  other: {
    stroke: "#000",
    labelClassName: "border-black bg-white text-black",
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
  selected,
}: EdgeProps) {
  const edgeData = data as RelationshipEdgeData;
  const relationStyle = relationStyles[edgeData.relationshipType];
  const displayLabel = getEdgeDisplayLabel(edgeData);

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
          strokeWidth: (relationStyle.strokeWidth ?? 2) + (selected ? 1.2 : 0),
          strokeDasharray: relationStyle.dashArray,
          filter: selected ? "drop-shadow(0 0 6px rgba(15, 23, 42, 0.15))" : undefined,
        }}
      />
      {displayLabel ? (
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
            {displayLabel}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
