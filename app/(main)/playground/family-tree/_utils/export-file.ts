"use client";

import type { GraphDataset, RelationshipType } from "../_types/graph";
import type { FamilyTreeExportFile } from "../_types/export-file";
import { ALL_RELATIONSHIP_TYPES } from "./edge-meta";
import {
  DEFAULT_EDGE_RELATIONSHIP_META,
  DEFAULT_PERSON_CATEGORY_META,
} from "./theme-meta";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPosition(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.x === "number" &&
    Number.isFinite(value.x) &&
    typeof value.y === "number" &&
    Number.isFinite(value.y)
  );
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function sanitizeGraphDraftForExport(graphDraft: GraphDataset): GraphDataset {
  return {
    nodes: graphDraft.nodes.map((node) => {
      if (node.type !== "biographyPersonNode") {
        return node;
      }

      const { actions, ...rest } = node.data;
      void actions;

      return {
        ...node,
        data: rest,
      };
    }),
    edges: graphDraft.edges,
  };
}

export function createFamilyTreeExportFile(params: {
  graphDraft: GraphDataset;
  meta: FamilyTreeExportFile["meta"];
  theme: FamilyTreeExportFile["theme"];
}): FamilyTreeExportFile {
  return {
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    meta: params.meta,
    theme: params.theme,
    graph: sanitizeGraphDraftForExport(params.graphDraft),
  };
}

function validateTheme(value: unknown): FamilyTreeExportFile["theme"] {
  assert(isRecord(value), "图谱主题配置缺失");
  const personCategory = value.personCategory;
  const edgeRelationship = value.edgeRelationship;

  assert(isRecord(personCategory), "人物主题配置缺失");
  assert(isRecord(edgeRelationship), "关系主题配置缺失");

  for (const category of Object.keys(DEFAULT_PERSON_CATEGORY_META)) {
    const meta = personCategory[category];
    assert(isRecord(meta), `人物主题缺少 ${category}`);
    assert(typeof meta.label === "string", `人物主题 ${category} 的 label 格式不正确`);
    assert(isRecord(meta.theme), `人物主题 ${category} 的 theme 缺失`);
  }

  for (const relationshipType of Object.keys(DEFAULT_EDGE_RELATIONSHIP_META)) {
    const meta = edgeRelationship[relationshipType];
    assert(isRecord(meta), `关系主题缺少 ${relationshipType}`);
    assert(typeof meta.label === "string", `关系主题 ${relationshipType} 的 label 格式不正确`);
    assert(isRecord(meta.style), `关系主题 ${relationshipType} 的 style 缺失`);
  }

  return value as FamilyTreeExportFile["theme"];
}

function validateGraph(value: unknown): GraphDataset {
  assert(isRecord(value), "图谱数据缺失");
  const nodes = value.nodes;
  const edges = value.edges;

  assert(Array.isArray(nodes), "图谱 nodes 格式不正确");
  assert(Array.isArray(edges), "图谱 edges 格式不正确");

  const nodeIds = new Set<string>();

  nodes.forEach((node) => {
    assert(isRecord(node), "节点格式不正确");
    assert(typeof node.id === "string" && node.id.length > 0, "节点 id 缺失");
    assert(
      node.type === "biographyPersonNode" || node.type === "marriageNode",
      `不支持的节点类型: ${String(node.type)}`,
    );
    assert(isPosition(node.position), `节点 ${node.id} 的 position 格式不正确`);
    assert(isRecord(node.data), `节点 ${node.id} 的 data 缺失`);

    if (node.type === "biographyPersonNode") {
      assert(typeof node.data.category === "string", `节点 ${node.id} 的 category 缺失`);
      assert(
        Object.hasOwn(DEFAULT_PERSON_CATEGORY_META, node.data.category),
        `节点 ${node.id} 的 category 不受支持`,
      );
    }

    if (node.type === "marriageNode") {
      assert(typeof node.data.husbandId === "string", `婚姻节点 ${node.id} 的 husbandId 缺失`);
      assert(typeof node.data.wifeId === "string", `婚姻节点 ${node.id} 的 wifeId 缺失`);
    }

    nodeIds.add(node.id);
  });

  edges.forEach((edge) => {
    assert(isRecord(edge), "边格式不正确");
    assert(typeof edge.id === "string" && edge.id.length > 0, "边 id 缺失");
    assert(edge.type === "customRelationEdge", `不支持的边类型: ${String(edge.type)}`);
    assert(typeof edge.source === "string" && nodeIds.has(edge.source), `边 ${edge.id} 的 source 无效`);
    assert(typeof edge.target === "string" && nodeIds.has(edge.target), `边 ${edge.id} 的 target 无效`);
    assert(isRecord(edge.data), `边 ${edge.id} 的 data 缺失`);
    assert(
      typeof edge.data.relationshipType === "string" &&
        ALL_RELATIONSHIP_TYPES.includes(edge.data.relationshipType as RelationshipType),
      `边 ${edge.id} 的 relationshipType 不受支持`,
    );
  });

  return value as unknown as GraphDataset;
}

export function parseFamilyTreeImportFile(rawText: string): FamilyTreeExportFile {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("文件格式不正确");
  }

  assert(isRecord(parsed), "文件格式不正确");
  assert(typeof parsed.savedAt === "string", "图谱文件缺少保存时间");
  assert(isRecord(parsed.meta), "图谱文件缺少 meta");
  assert(typeof parsed.meta.bookTitle === "string", "图谱文件缺少书名");
  assert(typeof parsed.meta.author === "string", "图谱文件缺少作者字段");
  assert(typeof parsed.meta.description === "string", "图谱文件缺少简介字段");

  return {
    schemaVersion: 1,
    savedAt: parsed.savedAt,
    meta: {
      bookTitle: parsed.meta.bookTitle,
      author: parsed.meta.author,
      description: parsed.meta.description,
    },
    theme: validateTheme(parsed.theme),
    graph: validateGraph(parsed.graph),
  };
}

export function downloadJsonFile(fileName: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function createExportFileName(bookTitle: string) {
  const safeTitle = bookTitle.trim().replace(/[^\w\u4e00-\u9fa5]+/g, "-").slice(0, 42) || "family-tree";
  const now = new Date();
  const pad2 = (value: number) => value.toString().padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}-${pad2(now.getHours())}${pad2(now.getMinutes())}`;

  return `family-tree-${safeTitle}-${stamp}.json`;
}
