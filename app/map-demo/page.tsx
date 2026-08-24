"use client";

import { Map, MapControls } from "@/components/ui/map";

export default function MapDemoPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-1 font-serif text-2xl font-bold">mapcn Example</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Default tiled basemap with zoom controls, rendered inside a sized
        container.
      </p>
      <div className="h-[420px] w-full overflow-hidden rounded-lg border">
        <Map center={[-74.006, 40.7128]} zoom={11}>
          <MapControls />
        </Map>
      </div>
    </main>
  );
}
