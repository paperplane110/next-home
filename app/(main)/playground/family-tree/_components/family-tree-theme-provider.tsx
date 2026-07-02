"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { EdgeRelationshipMeta, PersonCategoryMeta } from "../_utils/theme-meta";
import {
  DEFAULT_EDGE_RELATIONSHIP_META,
  DEFAULT_PERSON_CATEGORY_META,
} from "../_utils/theme-meta";

interface FamilyTreeThemeContextValue {
  personCategoryMeta: PersonCategoryMeta;
  edgeRelationshipMeta: EdgeRelationshipMeta;
}

const FamilyTreeThemeContext = createContext<FamilyTreeThemeContextValue>({
  personCategoryMeta: DEFAULT_PERSON_CATEGORY_META,
  edgeRelationshipMeta: DEFAULT_EDGE_RELATIONSHIP_META,
});

interface FamilyTreeThemeProviderProps {
  value: FamilyTreeThemeContextValue;
  children: ReactNode;
}

export function FamilyTreeThemeProvider({ value, children }: FamilyTreeThemeProviderProps) {
  return (
    <FamilyTreeThemeContext.Provider value={value}>
      {children}
    </FamilyTreeThemeContext.Provider>
  );
}

export function useFamilyTreeTheme() {
  return useContext(FamilyTreeThemeContext);
}

