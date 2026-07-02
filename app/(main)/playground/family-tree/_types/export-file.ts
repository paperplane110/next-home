"use client";

import type { GraphDataset } from "./graph";
import type { EdgeRelationshipMeta, PersonCategoryMeta } from "../_utils/theme-meta";

export type FamilyTreeExportMeta = {
  bookTitle: string;
  author: string;
  description: string;
};

export type FamilyTreeExportTheme = {
  personCategory: PersonCategoryMeta;
  edgeRelationship: EdgeRelationshipMeta;
};

export type FamilyTreeExportFile = {
  schemaVersion: 1;
  savedAt: string;
  meta: FamilyTreeExportMeta;
  theme: FamilyTreeExportTheme;
  graph: GraphDataset;
};
