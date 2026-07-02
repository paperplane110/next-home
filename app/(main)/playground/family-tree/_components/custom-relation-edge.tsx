"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

import { cn } from "@/lib/utils";

import type { RelationshipEdgeData } from "../_types/graph";
import { getEdgeDisplayLabel } from "../_utils/edge-meta";
import { useFamilyTreeTheme } from "./family-tree-theme-provider";

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
  const { edgeRelationshipMeta } = useFamilyTreeTheme();
  const relationStyle = edgeRelationshipMeta[edgeData.relationshipType].style;
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
