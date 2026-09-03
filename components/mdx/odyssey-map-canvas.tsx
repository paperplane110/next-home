"use client";

import { useMemo } from "react";
import Link from "next/link";

import {
  Map,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerTooltip,
} from "@/components/ui/map";
import {
  getEntryBySlug,
  getOdysseyEntryDisplayTitle,
  type OdysseyEntry,
} from "@/lib/odyssey";
import { getOdysseyEntryHref } from "@/lib/odyssey-i18n";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { OdysseyInlineCard } from "@/components/odyssey/odyssey-inline-link";
import type { OdysseyMapProps } from "./odyssey-map";

type ResolvedPoint = {
  slug: string;
  entry: OdysseyEntry;
  lng: number;
  lat: number;
};

export function OdysseyMapCanvas({
  points = [],
  routes = [],
  geo,
  locale = DEFAULT_LOCALE,
  height = 400,
  zoom,
}: OdysseyMapProps) {
  const { placePoints, solo, resolvedRoutes, viewport } = useMemo(() => {
    const placePoints: ResolvedPoint[] = points
      .map((slug) => {
        const entry = getEntryBySlug(slug, locale);
        if (!entry?.geo) return null;
        return { slug, entry, lng: entry.geo.lng, lat: entry.geo.lat };
      })
      .filter((p): p is ResolvedPoint => p !== null);

    const solo = geo ? { lng: geo.lng, lat: geo.lat } : null;

    const resolvedRoutes = routes
      .map((route) => {
        const from = placePoints.find((p) => p.slug === route.from);
        const to = placePoints.find((p) => p.slug === route.to);
        if (!from || !to) return null;
        return {
          from: [from.lng, from.lat] as [number, number],
          to: [to.lng, to.lat] as [number, number],
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    const all = [
      ...placePoints.map((p) => ({ lng: p.lng, lat: p.lat })),
      ...(solo ? [solo] : []),
    ];

    let viewport: { center: [number, number]; zoom: number } | null = null;
    if (all.length > 0) {
      const lngs = all.map((p) => p.lng);
      const lats = all.map((p) => p.lat);
      const center: [number, number] = [
        (Math.min(...lngs) + Math.max(...lngs)) / 2,
        (Math.min(...lats) + Math.max(...lats)) / 2,
      ];
      if (all.length === 1) {
        viewport = { center, zoom: zoom ?? 8 };
      } else {
        const lngSpan = Math.max(0.3, Math.max(...lngs) - Math.min(...lngs));
        const latSpan = Math.max(0.3, Math.max(...lats) - Math.min(...lats));
        if (zoom !== undefined) {
          viewport = { center, zoom };
        } else {
          // 横向与纵向都装得下的最小 zoom；高度 320 常是约束项。
          // 世界宽 512*2^z px：横向 512*2^z/360 px/度，纵向 512*2^z/180 px/度（纬线压缩 cos）。
          const avgLatRad = ((Math.min(...lats) + Math.max(...lats)) / 2) * (Math.PI / 180);
          const zLng = Math.log2((800 * 360) / (512 * lngSpan));
          const zLat = Math.log2((height * 180 * Math.cos(avgLatRad)) / (512 * latSpan));
          const fitZoom = Math.round(Math.min(zLng, zLat) - 0.5);
          viewport = { center, zoom: Math.min(11, Math.max(3, fitZoom)) };
        }
      }
    }

    return { placePoints, solo, resolvedRoutes, viewport };
  }, [points, routes, geo, locale, height, zoom]);

  if (!viewport) return null;

  return (
    <div
      className="my-8 w-full overflow-hidden rounded-lg border border-neutral-200/70"
      style={{ height }}
      data-lenis-prevent
    >
      <Map center={viewport.center} zoom={viewport.zoom}>
        {placePoints.map((p) => {
          const title = getOdysseyEntryDisplayTitle(p.entry, locale);

          return (
            <MapMarker key={p.slug} longitude={p.lng} latitude={p.lat}>
              <MarkerContent>
                {/* 点击 marker 直接跳转词条页 */}
                <Link
                  href={getOdysseyEntryHref(locale, p.slug)}
                  aria-label={title}
                  className="block"
                >
                  <span className="block size-3 cursor-pointer rounded-full border-2 border-white bg-odyssey-500 shadow-lg transition-transform hover:scale-110" />
                </Link>
                <MarkerLabel position="bottom">{title}</MarkerLabel>
              </MarkerContent>
              {/* hover 显示地区详情卡片（样式与文内链接一致） */}
              <MarkerTooltip className="pointer-events-none w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-neutral-200/90 bg-white/98 p-4 text-neutral-900 shadow-xl shadow-odyssey-900/5 backdrop-blur-sm">
                <OdysseyInlineCard entry={p.entry} locale={locale} />
              </MarkerTooltip>
            </MapMarker>
          );
        })}
        {solo && placePoints.length === 0 && (
          <MapMarker longitude={solo.lng} latitude={solo.lat}>
            <MarkerContent>
              <span className="block size-3 cursor-pointer rounded-full border-2 border-white bg-odyssey-500 shadow-lg" />
            </MarkerContent>
          </MapMarker>
        )}
        {resolvedRoutes.map((route, index) => (
          <MapRoute
            key={index}
            coordinates={[route.from, route.to]}
            color="#274E82"
            width={2}
            opacity={0.75}
            dashArray={[2, 2]}
            interactive={false}
          />
        ))}
      </Map>
    </div>
  );
}
