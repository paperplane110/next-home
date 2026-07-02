"use client";

import type { CustomEdge, MarriageNode, PersonNode } from "../_types/graph";

function createStructureId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveFamilyPosition(node: PersonNode) {
  return node.data.viewMeta.familyTree?.position ?? node.position;
}

export function createMarriageStructure(sourceNode: PersonNode, targetNode: PersonNode): {
  marriageNode: MarriageNode;
  marriageEdges: CustomEdge[];
} {
  const sourceFamilyPosition = resolveFamilyPosition(sourceNode);
  const targetFamilyPosition = resolveFamilyPosition(targetNode);

  const marriagePosition = {
    x: Math.round((sourceFamilyPosition.x + targetFamilyPosition.x) / 2),
    y: Math.round(Math.max(sourceFamilyPosition.y, targetFamilyPosition.y) + 24),
  };

  const marriageNodeId = createStructureId("marriage");

  const marriageNode: MarriageNode = {
    id: marriageNodeId,
    type: "marriageNode",
    position: marriagePosition,
    data: {
      husbandId: sourceNode.id,
      wifeId: targetNode.id,
      label: "婚姻",
      viewMeta: {
        familyTree: {
          position: marriagePosition,
        },
      },
    },
  };

  const marriageEdges: CustomEdge[] = [
    {
      id: createStructureId("edge"),
      source: sourceNode.id,
      target: marriageNodeId,
      type: "customRelationEdge",
      data: {
        relationshipType: "marriage",
        label: "",
        description: "",
        views: ["family"],
      },
    },
    {
      id: createStructureId("edge"),
      source: targetNode.id,
      target: marriageNodeId,
      type: "customRelationEdge",
      data: {
        relationshipType: "marriage",
        label: "",
        description: "",
        views: ["family"],
      },
    },
  ];

  return {
    marriageNode,
    marriageEdges,
  };
}
