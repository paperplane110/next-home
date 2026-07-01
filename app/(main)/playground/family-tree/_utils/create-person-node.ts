"use client";

import type { PersonNode } from "../_types/graph";
import { toFamilyDraftPosition } from "./layout-calc";

function createNodeId() {
  return `person-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createPersonNode(position: { x: number; y: number }, outerOrder: number): PersonNode {
  const familyPosition = toFamilyDraftPosition(position);

  return {
    id: createNodeId(),
    type: "biographyPersonNode",
    position,
    data: {
      name: "未命名人物",
      gender: "unknown",
      category: "other",
      title: "",
      badges: [],
      bioSummary: "",
      views: ["family", "star"],
      viewMeta: {
        familyTree: {
          generation: 1,
          position: familyPosition,
        },
        starNetwork: {
          ring: "outer",
          order: outerOrder,
          position,
        },
      },
    },
  };
}
