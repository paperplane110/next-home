"use client";

import type { GraphDataset, GraphViewMode, MarriageNode, PersonNode } from "../_types/graph";

const STAR_CENTER = { x: 0, y: 0 };
export const FAMILY_SCALE = 2;
const STAR_RING_RADIUS = {
  center: 0,
  inner: 280,
  outer: 460,
} as const;

function toRadians(degree: number) {
  return (degree * Math.PI) / 180;
}

function getStarPosition(order: number, total: number, radius: number) {
  if (!total || radius === 0) {
    return STAR_CENTER;
  }

  const angle = -90 + (360 / total) * order;
  const radian = toRadians(angle);

  return {
    x: Math.round(Math.cos(radian) * radius),
    y: Math.round(Math.sin(radian) * radius),
  };
}

export function scaleFamilyPosition(position: { x: number; y: number }) {
  return {
    x: position.x * FAMILY_SCALE,
    y: position.y * FAMILY_SCALE,
  };
}

export function toFamilyDraftPosition(position: { x: number; y: number }) {
  return {
    x: Math.round(position.x / FAMILY_SCALE),
    y: Math.round(position.y / FAMILY_SCALE),
  };
}

export function buildViewGraph(dataset: GraphDataset, mode: GraphViewMode): GraphDataset {
  const personNodes = dataset.nodes.filter(
    (node): node is PersonNode => node.type === "biographyPersonNode",
  );
  const marriageNodes = dataset.nodes.filter(
    (node): node is MarriageNode => node.type === "marriageNode",
  );

  if (mode === "family") {
    const familyEdges = dataset.edges.filter((edge) => edge.data?.views.includes("family"));
    const visibleNodeIds = new Set(
      familyEdges.flatMap((edge) => [edge.source, edge.target]),
    );
    const standaloneFamilyNodes = dataset.nodes.filter(
      (node) =>
        node.type === "biographyPersonNode" && Boolean(node.data.viewMeta.familyTree),
    );

    return {
      nodes: dataset.nodes
        .filter(
          (node) =>
            visibleNodeIds.has(node.id) ||
            standaloneFamilyNodes.some((familyNode) => familyNode.id === node.id),
        )
        .map((node) => {
          if (node.type === "biographyPersonNode") {
            return {
              ...node,
              position: scaleFamilyPosition(
                node.data.viewMeta.familyTree?.position ?? node.position,
              ),
            };
          }

          return {
            ...node,
            position: scaleFamilyPosition(
              node.data.viewMeta.familyTree?.position ?? node.position,
            ),
          };
        }),
      edges: familyEdges,
    };
  }

  const innerNodes = personNodes.filter(
    (node) => node.data.viewMeta.starNetwork?.ring === "inner",
  );
  const outerNodes = personNodes.filter(
    (node) => node.data.viewMeta.starNetwork?.ring === "outer",
  );

  const starPersonNodes = personNodes.map((node) => {
    const starMeta = node.data.viewMeta.starNetwork;

    if (starMeta?.position) {
      return {
        ...node,
        position: starMeta.position,
      };
    }

    if (!starMeta || starMeta.ring === "center") {
      return {
        ...node,
        position: STAR_CENTER,
      };
    }

    const pool = starMeta.ring === "inner" ? innerNodes : outerNodes;
    const position = getStarPosition(
      starMeta.order,
      pool.length,
      STAR_RING_RADIUS[starMeta.ring],
    );

    return {
      ...node,
      position,
    };
  });

  return {
    nodes: [...starPersonNodes, ...marriageNodes.map((node) => ({ ...node, hidden: true }))],
    edges: dataset.edges.filter((edge) => edge.data?.views.includes("star")),
  };
}
