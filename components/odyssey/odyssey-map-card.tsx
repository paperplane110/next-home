"use client"

// Reference: 
// Odysseus Journey Map: https://www.worldhistory.org/image/15906/map-of-odysseus-10-year-journey-home/
// Homer's Iliad Map: https://www.worldhistory.org/image/15242/map-of-the-world-of-homers-iliad-c-1200-bce/
// Trojan War Map: https://www.worldhistory.org/image/15243/map-of-the-battlefield-of-the-trojan-war-c-1200-bc/

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Map, MapArc, MapControls, MapMarker, MarkerContent, MarkerLabel, type MapViewport } from "@/components/ui/map";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

type CityGeoInfo = {
  name: string;
  lng: number;
  lat: number;
 
}

const CITY_INFO: Array<CityGeoInfo> = [
  {
    name: "Ithaca",
    lng: 20.43,
    lat: 38.22,
  },
  {
    name: "Troy",
    lng: 26.24,
    lat: 39.96,
  },
  {
    name: "Sparta",
    lng: 22.42,
    lat: 37.07,
  }
]

export function OdysseyMapCard({
  center,
  zoom,
  bearing = 0,
  pitch = 0,
}: {
  center: [number, number];
  zoom: number;
  bearing?: number;
  pitch?: number;
}) {
  const [viewport, setViewPort] = useState<MapViewport>({
    center,
    zoom,
    bearing,
    pitch,
  })

  const handleReset = () => {
    setViewPort({
      center,
      zoom,
      bearing,
      pitch,
    })
  }

  return (
    <Card className="relative h-[320px] p-0 overflow-hidden" data-lenis-prevent>
      <Map
        viewport={viewport}
        onViewportChange={setViewPort}
        projection={{ type: "globe" }}

      >
        {CITY_INFO.map((city) => (
          <MapMarker key={city.name} longitude={city.lng} latitude={city.lat}>
            <MarkerContent>
              <div className="size-3 cursor-pointer rounded-full border-2 border-white bg-odyssey-500 shadow-lg transition-transform hover:scale-110" />
              <MarkerLabel position="bottom">{city.name}</MarkerLabel>
            </MarkerContent>
          </MapMarker>
        ))}
        <MapArc 
          data={[
            {
              id: "troy-to-ithaca",
              from: [CITY_INFO[1].lng, CITY_INFO[1].lat],
              to: [CITY_INFO[0].lng, CITY_INFO[0].lat],
            },
          ]}
          paint={{
            "line-color": "#3b82f6",
            "line-dasharray": [2, 2],
          }}

        />
        <MapControls showZoom={false} showCopy={false} />
      </Map>

      <Button size="icon-sm" variant="ghost" onClick={handleReset} className="absolute top-2 right-2 z-10 bg-odyssey-500/10 backdrop-blur-xs hover:bg-odyssey-500/20 cursor-pointer">
        <RefreshCcw className="size-3.5 text-muted-foreground" />
      </Button>
      {/* <div className="bg-background/80 absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 rounded border px-2 py-1.5 font-mono text-xs backdrop-blur">
        <span>
          <span className="text-muted-foreground">lng:</span>{" "}
          {viewport.center[0].toFixed(3)}
        </span>
        <span>
          <span className="text-muted-foreground">lat:</span>{" "}
          {viewport.center[1].toFixed(3)}
        </span>
        <span>
          <span className="text-muted-foreground">zoom:</span>{" "}
          {viewport.zoom.toFixed(1)}
        </span>
        <span>
          <span className="text-muted-foreground">bearing:</span>{" "}
          {viewport.bearing.toFixed(1)}°
        </span>
        <span>
          <span className="text-muted-foreground">pitch:</span>{" "}
          {viewport.pitch.toFixed(1)}°
        </span>
      </div> */}
    </Card>
  )
}