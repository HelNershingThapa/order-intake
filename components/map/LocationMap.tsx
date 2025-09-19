// components/LocationMap.tsx
"use client";

import React, { useRef } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import MapSearch from "./MapSearch"; // Your existing MapSearch component

const MAP_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY as string;

interface LocationMapProps {
  marker: { lat: number; lon: number } | null;
  onMapClick: (lat: number, lon: number) => void;
  onLocationSelect: (lat: number, lon: number, address?: string) => void;
}

export default function LocationMap({
  marker,
  onMapClick,
  onLocationSelect,
}: LocationMapProps) {
  const mapRef = useRef<any>(null);

  // Helper to read lat/lon from event
  const getLatLonFromEvent = (e: any) => {
    const lngLat = e?.lngLat;
    if (!lngLat) return null;
    const lat =
      typeof lngLat.lat === "number"
        ? lngLat.lat
        : Array.isArray(lngLat)
        ? lngLat[1]
        : undefined;
    const lon =
      typeof lngLat.lng === "number"
        ? lngLat.lng
        : Array.isArray(lngLat)
        ? lngLat[0]
        : undefined;
    if (typeof lat === "number" && typeof lon === "number") return { lat, lon };
    return null;
  };

  const handleMapClick = (e: any) => {
    const coords = getLatLonFromEvent(e);
    if (!coords) return;
    onMapClick(coords.lat, coords.lon);
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    onLocationSelect(lat, lon);

    // Fly the map to the chosen location
    try {
      const mapInstance = mapRef.current?.getMap?.() ?? mapRef.current;
      if (mapInstance?.flyTo) {
        mapInstance.flyTo({ center: [lon, lat], zoom: 14 });
      }
    } catch (err) {
      console.warn("flyTo not available on map ref", err);
    }
  };

  return (
    <div className="relative">
      {/* Your existing MapSearch component */}
      <MapSearch onSelect={handleLocationSelect} />

      {/* The map */}
      <div className="border rounded-md overflow-hidden">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 85.3151,
            latitude: 27.6906,
            zoom: 12,
          }}
          style={{ width: "100%", height: 300 }}
          mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAP_KEY}`}
          attributionControl={false}
          onClick={handleMapClick}
        >
          <NavigationControl position="top-right" />
          {marker && (
            <Marker
              latitude={marker.lat}
              longitude={marker.lon}
              anchor="bottom"
            >
              <div className="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg" />
            </Marker>
          )}
        </Map>
      </div>

      {/* Show selected coordinates */}
      {marker && (
        <p className="mt-2 text-sm text-gray-700">
          Selected: {marker.lat.toFixed(6)}, {marker.lon.toFixed(6)}
        </p>
      )}
    </div>
  );
}
