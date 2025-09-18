"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { type GeocodedRow } from "./steps";
import { Map, Source, Layer, type MapMouseEvent } from "react-map-gl/maplibre";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from "./layers";
import type { GeoJSONSource } from "maplibre-gl";
interface ReviewStepProps {
  rows: GeocodedRow[]; // includes all; we will filter to successful
  onBack?: () => void;
  onContinue?: () => void;
}

type Feature = GeoJSON.Feature<GeoJSON.Point, { id: number; label?: string }>;

function toGeoJSON(rows: GeocodedRow[]): GeoJSON.FeatureCollection {
  const feats: Feature[] = rows
    .filter((r) => r.status === "success" && r.lat != null && r.lng != null)
    .map((r) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [r.lng as number, r.lat as number],
      },
      properties: {
        id: r.id,
        label: String(
          r.mapped.reference_id ?? r.mapped.recipient_name ?? r.id + 1,
        ),
      },
    }));
  return { type: "FeatureCollection", features: feats };
}

export function ReviewStep({ rows, onBack, onContinue }: ReviewStepProps) {
  const geojson = useMemo(() => toGeoJSON(rows), [rows]);
  const mapRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const MAP_STYLE = MAPTILER_KEY
    ? `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  const successRows = useMemo(
    () =>
      rows.filter(
        (r) => r.status === "success" && r.lat != null && r.lng != null,
      ),
    [rows],
  );

  // Compute map bounds from successful rows
  const mapBounds = useMemo(() => {
    if (!successRows.length) {
      // Fallback: use provided hardcoded bounds (minLng, minLat, maxLng, maxLat)
      return [
        [85.276729, 27.655014],
        [85.372076, 27.751516],
      ] as const;
    }

    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;
    for (const r of successRows) {
      if (r.lng == null || r.lat == null) continue;
      if (r.lng < minLng) minLng = r.lng;
      if (r.lng > maxLng) maxLng = r.lng;
      if (r.lat < minLat) minLat = r.lat;
      if (r.lat > maxLat) maxLat = r.lat;
    }

    if (
      !isFinite(minLng) ||
      !isFinite(minLat) ||
      !isFinite(maxLng) ||
      !isFinite(maxLat)
    ) {
      // Fallback if something went wrong: use provided hardcoded bounds
      return [
        [85.276729, 27.655014],
        [85.372076, 27.751516],
      ] as const;
    }

    // If all points are identical, create a tiny padded box
    if (minLng === maxLng && minLat === maxLat) {
      // Return degenerate bounds at the identical point (no padding)
      return [
        [minLng, minLat],
        [maxLng, maxLat],
      ] as const;
    }

    return [
      [minLng, minLat],
      [maxLng, maxLat],
    ] as const;
  }, [successRows]);

  const handleMapClick = async (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) {
      return;
    }
    if (feature.properties.cluster) {
      const clusterId = feature.properties.cluster_id;

      const geojsonSource: GeoJSONSource = mapRef.current.getSource("orders");

      const zoom = await geojsonSource.getClusterExpansionZoom(clusterId);

      mapRef.current.easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500,
      });
    } else {
      const id = (feature.properties as any)?.id;
      mapRef.current.setFeatureState(
        { source: "orders", id: selectedId },
        { selected: false },
      );
      mapRef.current.setFeatureState(
        { source: "orders", id: id },
        { selected: true },
      );
      setSelectedId(id);
    }

    // Single point
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Sidebar list */}
      <div className="lg:col-span-4 border rounded-md">
        <div className="p-3">
          <h3 className="text-sm font-medium">
            Review {successRows.length} Locations
          </h3>
          <p className="text-xs text-muted-foreground">
            Click a row to focus on the map. Ensure all points look correct.
          </p>
        </div>
        <Separator />
        <ScrollArea className="h-[420px]">
          <ul className="divide-y">
            {successRows.map((r, idx) => {
              const selected = r.id === selectedId;
              const title = String(
                r.mapped.reference_id ??
                  r.mapped.recipient_name ??
                  "Row " + (r.id + 1),
              );
              const address = String(r.mapped.delivery_address_text ?? "");
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left p-3 flex gap-3 items-start hover:bg-muted/50",
                      selected && "bg-primary/5",
                    )}
                    onClick={() => {
                      setSelectedId(r.id);
                      const map = mapRef.current;
                      if (map && r.lat != null && r.lng != null)
                        map.easeTo({ center: [r.lng, r.lat], zoom: 14 });
                    }}
                  >
                    <span className="inline-flex items-center justify-center size-6 rounded bg-muted text-xs font-medium">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span
                        className="block text-xs font-medium truncate"
                        title={title}
                      >
                        {title}
                      </span>
                      {address && (
                        <span
                          className="block text-[11px] text-muted-foreground truncate"
                          title={address}
                        >
                          {address}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
            {successRows.length === 0 && (
              <li className="p-3 text-xs text-muted-foreground">
                No rows with coordinates to review.
              </li>
            )}
          </ul>
        </ScrollArea>
        <Separator />
        <div className="p-3 flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {successRows.length} of {rows.length} rows have coordinates
          </div>
          <div className="flex gap-2">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onBack}
              >
                Back
              </Button>
            )}
            {onContinue && (
              <Button
                type="button"
                size="sm"
                onClick={onContinue}
                disabled={!successRows.length}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="lg:col-span-8 border rounded-md overflow-hidden">
        <div className="h-[540px]">
          <Map
            ref={mapRef}
            // @ts-expect-error - bounds is supported by maplibre but not typed in react-map-gl
            bounds={mapBounds}
            fitBoundsOptions={{ padding: 15 }}
            mapStyle={MAP_STYLE}
            interactiveLayerIds={[clusterLayer.id!, "unclustered-point"]}
            onClick={handleMapClick}
          >
            <Source
              id="orders"
              type="geojson"
              data={geojson as any}
              cluster
              clusterMaxZoom={14}
              clusterRadius={40}
              promoteId={"id"}
            >
              <Layer {...clusterLayer} />
              <Layer {...clusterCountLayer} />
              <Layer {...unclusteredPointLayer} />
            </Source>
          </Map>
        </div>
      </div>
    </div>
  );
}
