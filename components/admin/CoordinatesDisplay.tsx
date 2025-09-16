// components/CoordinatesDisplay.tsx
"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface CoordinatesDisplayProps {
  lat: string;
  lon: string;
}

export default function CoordinatesDisplay({
  lat,
  lon,
}: CoordinatesDisplayProps) {
  return (
    <div className="space-y-4">
      <Input
        name="pickup_lat"
        placeholder="Pickup Latitude"
        value={lat}
        readOnly
        className="bg-gray-50"
      />
      <Input
        name="pickup_lon"
        placeholder="Pickup Longitude"
        value={lon}
        readOnly
        className="bg-gray-50"
      />
    </div>
  );
}
