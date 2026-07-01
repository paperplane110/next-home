"use client";

import type {
  EdgeFormDraft,
  GraphViewMode,
  RelationshipEdgeData,
  RelationshipType,
} from "../_types/graph";

export const RELATIONSHIP_TYPE_META: Record<
  RelationshipType,
  {
    label: string;
    description?: string;
  }
> = {
  blood: { label: "血缘" },
  adoption: { label: "收养" },
  marriage: { label: "夫妻" },
  employ: { label: "雇佣关系" },
  peer: { label: "同龄人" },
  ally: { label: "盟友" },
  mentor: { label: "导师" },
  friendship: { label: "朋友" },
  other: { label: "" },
};

export const ALL_RELATIONSHIP_TYPES = Object.keys(RELATIONSHIP_TYPE_META) as RelationshipType[];
export const FAMILY_RELATIONSHIP_TYPES: RelationshipType[] = ["blood", "adoption"];
export const MARRIAGE_ONLY_RELATIONSHIP_TYPES: RelationshipType[] = ["marriage"];

export function createEdgeFormDraft(edge?: RelationshipEdgeData | null): EdgeFormDraft {
  return {
    relationshipType: edge?.relationshipType ?? "other",
    label: edge?.label ?? "",
    description: edge?.description ?? "",
  };
}

export function sanitizeEdgeFormDraft(draft: EdgeFormDraft): EdgeFormDraft {
  return {
    relationshipType: draft.relationshipType,
    label: draft.label.trim(),
    description: draft.description.trim(),
  };
}

export function getEdgeDisplayLabel(edge: Pick<RelationshipEdgeData, "relationshipType" | "label">) {
  return edge.label?.trim() || RELATIONSHIP_TYPE_META[edge.relationshipType].label;
}

export function createDefaultRelationshipEdgeData(
  viewMode: GraphViewMode,
  relationshipType: RelationshipType = "other",
): RelationshipEdgeData {
  return {
    relationshipType,
    label: "",
    description: "",
    views: [viewMode],
  };
}
