"use client";

import React, { useEffect, useState } from "react";
import { Map, Marker } from "react-map-gl/maplibre";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import "maplibre-gl/dist/maplibre-gl.css";

interface CoordinatePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPoint?: { lat: number; lng: number } | null;
  onSave: (point: { lat: number; lng: number }) => void;
  title?: string;
  rowLabel?: string;
}

export const CoordinatePickerDialog: React.FC<CoordinatePickerDialogProps> = ({
  open,
  onOpenChange,
  initialPoint,
  onSave,
  title = "Select Coordinates",
  rowLabel,
}) => {
  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const MAP_STYLE = MAPTILER_KEY
    ? `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (open) {
      setPoint(initialPoint ?? null);
    } else {
      setPoint(null);
    }
  }, [open, initialPoint]);

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.lngLat;
    setPoint({ lat, lng });
  };

  const handleSave = () => {
    if (point) onSave(point);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription className="text-xs">
            Click anywhere on the map to choose latitude & longitude for this
            order.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="h-[420px] w-full rounded-md overflow-hidden border relative">
            {open && (
              <Map
                initialViewState={{
                  latitude: point?.lat ?? 27.7,
                  longitude: point?.lng ?? 85.3,
                  zoom: point ? 13 : 6,
                }}
                mapStyle={MAP_STYLE}
                style={{ width: "100%", height: "100%" }}
                dragRotate={false}
                attributionControl={false}
                onClick={handleMapClick}
              >
                {point && (
                  <Marker
                    latitude={point.lat}
                    longitude={point.lng}
                    anchor="bottom"
                  >
                    <div className="w-4 h-4 -translate-y-1 rounded-full bg-primary border-2 border-background shadow" />
                  </Marker>
                )}
              </Map>
            )}
            {!point && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-3 py-1 rounded text-xs border shadow">
                Click map to select a point
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div>
              <span className="font-medium">Latitude:</span>{" "}
              {point?.lat.toFixed?.(6) ?? "—"}
            </div>
            <div>
              <span className="font-medium">Longitude:</span>{" "}
              {point?.lng.toFixed?.(6) ?? "—"}
            </div>
            {rowLabel && (
              <div className="text-muted-foreground">{rowLabel}</div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" disabled={!point} onClick={handleSave}>
            Save Point
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
