"use client";

import dynamic from "next/dynamic";

import type { Locale } from "@/lib/i18n";

export interface OdysseyMapRoute {
  from: string;
  to: string;
}

export interface OdysseyMapProps {
  /** frontmatter.map.points：地点 slug 引用（坐标单一来源为地理词条的 geo 字段） */
  points?: string[];
  /** frontmatter.map.routes：航线，端点按 slug 引用 */
  routes?: OdysseyMapRoute[];
  /** frontmatter.geo：词条本身的地点（单点地图） */
  geo?: { lng: number; lat: number };
  locale?: Locale;
  /** 地图容器高度（px），默认 400 */
  height?: number;
  /** 手动指定 zoom，覆盖自动计算（点数 >1 时生效） */
  zoom?: number;
}

/**
 * MDX 内嵌地图的轻量入口：真正的 maplibre 渲染按需加载
 * （词条正文没有 <OdysseyMap /> 时不会拖入地图代码）。
 */
const OdysseyMapCanvas = dynamic(
  () => import("./odyssey-map-canvas").then((mod) => mod.OdysseyMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="h-100 w-full animate-pulse rounded-lg border border-neutral-200/70 bg-neutral-50/50" />
    ),
  }
);

export function OdysseyMap(props: OdysseyMapProps) {
  return <OdysseyMapCanvas {...props} />;
}

export default OdysseyMap;
