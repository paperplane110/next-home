"use client";

import type { Edge, Node } from "@xyflow/react";

export type GraphViewMode = "family" | "star";

export type PersonCategory =
  | "family"
  | "professional"
  | "media"
  | "political"
  | "business"
  | "social"
  | "other";

export type StarRing = "center" | "inner" | "outer";

export interface FamilyTreeMeta {
  generation: number;
  position: {
    x: number;
    y: number;
  };
}

export interface StarNetworkMeta {
  ring: StarRing;
  order: number;
}

export interface BiographyPersonData extends Record<string, unknown> {
  name: string;
  birthDeath?: string;
  category: PersonCategory;
  title?: string;
  badges?: string[];
  bioSummary?: string;
  viewMeta: {
    familyTree?: FamilyTreeMeta;
    starNetwork?: StarNetworkMeta;
  };
}

export interface MarriageNodeData extends Record<string, unknown> {
  label?: string;
  husbandId: string;
  wifeId: string;
  viewMeta: {
    familyTree?: {
      position: {
        x: number;
        y: number;
      };
    };
  };
}

export type PersonNode = Node<BiographyPersonData, "biographyPersonNode">;
export type MarriageNode = Node<MarriageNodeData, "marriageNode">;
export type CustomNode = PersonNode | MarriageNode;

export type RelationshipType =
  | "blood"
  | "marriage"
  | "employ"
  | "peer"
  | "ally"
  | "mentor"
  | "friendship";

export interface RelationshipEdgeData extends Record<string, unknown> {
  relationshipType: RelationshipType;
  label?: string;
  description?: string;
  views: GraphViewMode[];
}

export type CustomEdge = Edge<RelationshipEdgeData, "customRelationEdge">;

export interface GraphDataset {
  nodes: CustomNode[];
  edges: CustomEdge[];
}
