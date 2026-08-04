"use client";

import type { BiographyPersonData, PersonFormDraft, PersonNode } from "../_types/graph";

function trimToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function normalizeYearValue(raw?: string) {
  if (!raw) {
    return "";
  }

  const trimmed = raw.trim();

  if (!trimmed) {
    return "";
  }

  if (/^\d{1,4}$/.test(trimmed)) {
    return trimmed;
  }

  const isoDateMatch = trimmed.match(/^(\d{1,4})[-/]\d{1,2}[-/]\d{1,2}$/);
  if (isoDateMatch) {
    return isoDateMatch[1];
  }

  return trimmed;
}

export function sanitizeBadgeList(badges: string[]) {
  const normalizedBadges: string[] = [];
  const seen = new Set<string>();

  badges.forEach((badge) => {
    const trimmedBadge = badge.trim();

    if (!trimmedBadge || seen.has(trimmedBadge)) {
      return;
    }

    seen.add(trimmedBadge);
    normalizedBadges.push(trimmedBadge);
  });

  return normalizedBadges;
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
    birthDate: normalizeYearValue(person?.birthDate),
    deathDate: normalizeYearValue(person?.deathDate),
    category: person?.category ?? "other",
    title: person?.title ?? "",
    badges: sanitizeBadgeList(person?.badges ?? []),
    bioSummary: person?.bioSummary ?? "",
  };
}

export function sanitizePersonDraft(draft: PersonFormDraft): PersonFormDraft {
  return {
    ...draft,
    name: draft.name.trim(),
    title: draft.title.trim(),
    birthDate: normalizeYearValue(draft.birthDate),
    deathDate: normalizeYearValue(draft.deathDate),
    badges: sanitizeBadgeList(draft.badges),
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
      badges: sanitized.badges,
      bioSummary: trimToUndefined(sanitized.bioSummary),
    },
  };
}
