"use client";

import type { BiographyPersonData, RelationshipType } from "../_types/graph";

export type PersonCategoryTheme = {
  border: string;
  bg: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
};

export type PersonCategoryMeta = Record<
  BiographyPersonData["category"],
  { label: string; theme: PersonCategoryTheme }
>;

export type EdgeRelationshipStyle = {
  stroke: string;
  labelClassName: string;
  strokeWidth?: number;
  dashArray?: string;
};

export type EdgeRelationshipMeta = Record<
  RelationshipType,
  { label: string; style: EdgeRelationshipStyle }
>;

export const DEFAULT_PERSON_CATEGORY_META: PersonCategoryMeta = {
  family: {
    label: "家族",
    theme: {
      border: "border-amber-300",
      bg: "bg-amber-50/90",
      text: "text-amber-900",
      badgeBg: "bg-amber-100/80",
      badgeText: "text-amber-800",
      ring: "ring-amber-400/70",
    },
  },
  professional: {
    label: "职业",
    theme: {
      border: "border-slate-300",
      bg: "bg-slate-50",
      text: "text-slate-900",
      badgeBg: "bg-slate-100/90",
      badgeText: "text-slate-700",
      ring: "ring-slate-400/70",
    },
  },
  media: {
    label: "媒体",
    theme: {
      border: "border-sky-300",
      bg: "bg-sky-50/90",
      text: "text-sky-900",
      badgeBg: "bg-sky-100/85",
      badgeText: "text-sky-800",
      ring: "ring-sky-400/70",
    },
  },
  political: {
    label: "政治",
    theme: {
      border: "border-violet-300",
      bg: "bg-violet-50/90",
      text: "text-violet-900",
      badgeBg: "bg-violet-100/85",
      badgeText: "text-violet-800",
      ring: "ring-violet-400/70",
    },
  },
  business: {
    label: "商业",
    theme: {
      border: "border-emerald-300",
      bg: "bg-emerald-50/90",
      text: "text-emerald-900",
      badgeBg: "bg-emerald-100/85",
      badgeText: "text-emerald-800",
      ring: "ring-emerald-400/70",
    },
  },
  social: {
    label: "社交",
    theme: {
      border: "border-rose-300",
      bg: "bg-rose-50/90",
      text: "text-rose-900",
      badgeBg: "bg-rose-100/85",
      badgeText: "text-rose-800",
      ring: "ring-rose-400/70",
    },
  },
  other: {
    label: "其他",
    theme: {
      border: "border-zinc-300",
      bg: "bg-zinc-50/90",
      text: "text-zinc-900",
      badgeBg: "bg-zinc-100/90",
      badgeText: "text-zinc-700",
      ring: "ring-zinc-400/70",
    },
  },
};

export const DEFAULT_EDGE_RELATIONSHIP_META: EdgeRelationshipMeta = {
  blood: {
    label: "血缘",
    style: {
      stroke: "#57534e",
      labelClassName: "border-stone-200 bg-white text-stone-600",
      strokeWidth: 1,
    },
  },
  adoption: {
    label: "收养",
    style: {
      stroke: "#57534e",
      labelClassName: "border-stone-200 bg-white text-stone-600",
      strokeWidth: 1,
    },
  },
  marriage: {
    label: "夫妻",
    style: {
      stroke: "#0f172a",
      labelClassName: "border-stone-200 bg-stone-900 text-stone-50",
      strokeWidth: 1.2,
    },
  },
  employ: {
    label: "雇佣关系",
    style: {
      stroke: "#0369a1",
      labelClassName: "border-sky-200 bg-sky-50 text-sky-700",
      dashArray: "7 5",
    },
  },
  peer: {
    label: "同龄人",
    style: {
      stroke: "#0369a1",
      labelClassName: "border-sky-200 bg-sky-50 text-sky-700",
      dashArray: "6 4",
    },
  },
  ally: {
    label: "盟友",
    style: {
      stroke: "#7c3aed",
      labelClassName: "border-purple-200 bg-purple-50 text-purple-700",
    },
  },
  mentor: {
    label: "导师",
    style: {
      stroke: "#f59e0b",
      labelClassName: "border-amber-200 bg-amber-50 text-amber-700",
    },
  },
  friendship: {
    label: "朋友",
    style: {
      stroke: "#047857",
      labelClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dashArray: "4 4",
    },
  },
  other: {
    label: "",
    style: {
      stroke: "#000",
      labelClassName: "border-black bg-white text-black",
    },
  },
};

export const PERSON_CATEGORY_META = DEFAULT_PERSON_CATEGORY_META;

export const RELATIONSHIP_TYPE_STYLE: Record<RelationshipType, EdgeRelationshipStyle> =
  Object.fromEntries(
    Object.entries(DEFAULT_EDGE_RELATIONSHIP_META).map(([relationshipType, meta]) => [
      relationshipType,
      meta.style,
    ]),
  ) as Record<RelationshipType, EdgeRelationshipStyle>;
