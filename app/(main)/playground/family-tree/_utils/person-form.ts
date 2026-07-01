"use client";

import type { BiographyPersonData, PersonFormDraft, PersonNode } from "../_types/graph";

function trimToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function buildBirthDeathLabel(birthDate?: string, deathDate?: string) {
  if (!birthDate && !deathDate) {
    return undefined;
  }

  if (birthDate && deathDate) {
    return `${birthDate}-${deathDate}`;
  }

  if (birthDate) {
    return `${birthDate}-`;
  }

  return `?-${deathDate}`;
}

export function createPersonFormDraft(person?: BiographyPersonData | null): PersonFormDraft {
  return {
    name: person?.name ?? "",
    gender: person?.gender ?? "unknown",
    birthDate: person?.birthDate ?? "",
    deathDate: person?.deathDate ?? "",
    category: person?.category ?? "other",
    title: person?.title ?? "",
    bioSummary: person?.bioSummary ?? "",
  };
}

export function sanitizePersonDraft(draft: PersonFormDraft): PersonFormDraft {
  return {
    ...draft,
    name: draft.name.trim(),
    title: draft.title.trim(),
    birthDate: draft.birthDate.trim(),
    deathDate: draft.deathDate.trim(),
    bioSummary: draft.bioSummary.trim(),
  };
}

export function mergePersonDraftIntoNode(node: PersonNode, draft: PersonFormDraft): PersonNode {
  const sanitized = sanitizePersonDraft(draft);
  const birthDate = trimToUndefined(sanitized.birthDate);
  const deathDate = trimToUndefined(sanitized.deathDate);

  return {
    ...node,
    data: {
      ...node.data,
      name: sanitized.name || "未命名人物",
      gender: sanitized.gender,
      birthDate,
      deathDate,
      birthDeath: buildBirthDeathLabel(birthDate, deathDate),
      category: sanitized.category,
      title: trimToUndefined(sanitized.title),
      bioSummary: trimToUndefined(sanitized.bioSummary),
    },
  };
}
