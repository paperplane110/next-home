"use client";

import type { Edge, Node } from "@xyflow/react";

export type GraphViewMode = "family" | "star";
export type PersonGender = "male" | "female" | "unknown";

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
  position?: {
    x: number;
    y: number;
  };
}

export interface PersonNodeActions {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface BiographyPersonData extends Record<string, unknown> {
  name: string;
  birthDeath?: string;
  gender?: PersonGender;
  birthDate?: string;
  deathDate?: string;
  category: PersonCategory;
  title?: string;
  badges?: string[];
  bioSummary?: string;
  views?: GraphViewMode[];
  actions?: PersonNodeActions;
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
  | "adoption"
  | "marriage"
  | "employ"
  | "peer"
  | "ally"
  | "mentor"
  | "friendship"
  | "other";

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

export interface PersonFormDraft {
  name: string;
  gender: PersonGender;
  birthDate: string;
  deathDate: string;
  category: PersonCategory;
  title: string;
  bioSummary: string;
}

export type PersonEditorMode = "create" | "edit";

export interface PersonEditorState {
  open: boolean;
  mode: PersonEditorMode;
  personId: string | null;
}

export interface EdgeFormDraft {
  relationshipType: RelationshipType;
  label: string;
  description: string;
}

export interface EdgeEditorState {
  open: boolean;
  edgeId: string | null;
}
