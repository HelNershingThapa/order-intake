"use client";

import { useCallback, useEffect, useState } from "react";
import { search, places } from "@/app/vendor/actions";
import {
  optionalKeys,
  requiredKeys,
  type GeocodedRow,
  type CanonicalKey,
} from "./steps";
import { type CsvRow } from "@/utils/csv-parser";

interface UseGeocodingArgs {
  data: CsvRow[];
  mapping: Record<CanonicalKey, string>;
}

export function useGeocoding({ data, mapping }: UseGeocodingArgs) {
  const [geocodeRows, setGeocodeRows] = useState<GeocodedRow[]>([]);
  const [geocodeInProgress, setGeocodeInProgress] = useState(false);
  const [geocodeStarted, setGeocodeStarted] = useState(false);

  // Map picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerRowId, setPickerRowId] = useState<number | null>(null);

  /**
   * Geocode an address using Baato search + places API via server actions.
   * 1. search(query) -> take first result placeId
   * 2. places(placeId) -> centroid { lat, lon }
   * Returns { lat, lng } or null if not found / error.
   */
  const geocodeAddress = useCallback(async (address: string) => {
    const query = address?.trim();
    if (!query) return null;
    const searchRes = await search(query);
    const first = searchRes?.data?.[0];
    if (!first) return null;
    const placeRes = await places(String(first.placeId));
    const place = placeRes?.data?.[0];
    const lat = place?.centroid?.lat;
    const lon = place?.centroid?.lon;
    if (typeof lat === "number" && typeof lon === "number") {
      return { lat, lng: lon };
    }
    return null;
  }, []);

  function transformRow(
    r: GeocodedRow,
    rowId: number,
    result: { lat: number; lng: number } | null,
  ): GeocodedRow {
    if (r.id !== rowId) return r;
    if (result)
      return {
        ...r,
        lat: result.lat,
        lng: result.lng,
        status: "success",
        error: undefined,
      };
    return { ...r, status: "failed", error: "Could not geocode" };
  }

  const initializeGeocodeRows = useCallback(() => {
    const rows: GeocodedRow[] = data.map((row, idx) => {
      const mapped: Record<string, any> = {};
      [...requiredKeys, ...optionalKeys].forEach((k) => {
        const source = mapping[k];
        if (source && source in row) mapped[k] = row[source];
      });
      let lat: number | null = null;
      let lng: number | null = null;
      if (mapped.lat !== undefined) {
        const v = parseFloat(mapped.lat);
        if (!isNaN(v)) lat = v;
      }
      if (mapped.lng !== undefined) {
        const v = parseFloat(mapped.lng);
        if (!isNaN(v)) lng = v;
      }
      const hasCoords = lat !== null && lng !== null;
      return {
        id: idx,
        original: row,
        mapped,
        lat,
        lng,
        status: hasCoords ? "success" : "pending",
      };
    });
    setGeocodeRows(rows);
  }, [data, mapping]);

  const startGeocoding = useCallback(() => {
    if (!data.length) return;
    setGeocodeStarted(true);
    initializeGeocodeRows();
  }, [data.length, initializeGeocodeRows]);

  useEffect(() => {
    const pending = geocodeRows.filter((r) => r.status === "pending");
    if (!geocodeStarted || !pending.length) return;
    let cancelled = false;
    setGeocodeInProgress(true);
    const run = async () => {
      // Geocode all pending rows concurrently
      const tasks = pending.map(async (row, index) => {
        const addr = (row.mapped.delivery_address_text || "").toString();
        const res = await geocodeAddress(addr).catch(() => null);
        return {
          rowId: row.id,
          result: res as { lat: number; lng: number } | null,
        };
      });
      const results = await Promise.all(tasks);
      if (cancelled) return;

      // Build a lookup and update all affected rows in one pass
      const byId = new Map<number, { lat: number; lng: number } | null>();
      for (const r of results) byId.set(r.rowId, r.result);
      setGeocodeRows((prev) =>
        prev.map((r) =>
          byId.has(r.id) ? transformRow(r, r.id, byId.get(r.id) ?? null) : r,
        ),
      );
      setGeocodeInProgress(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [geocodeRows, geocodeStarted, geocodeAddress]);

  const failedGeocodes = geocodeRows.filter((r) => r.status === "failed");
  const pendingGeocodes = geocodeRows.filter(
    (r) => r.status === "pending",
  ).length;
  const successfulGeocodes = geocodeRows.filter(
    (r) => r.status === "success",
  ).length;

  const openPickerForRow = (rowId: number) => {
    setPickerRowId(rowId);
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setPickerRowId(null);
  };

  const savePickedPoint = (lat: number, lng: number) => {
    if (pickerRowId == null) return;
    setGeocodeRows((prev) =>
      prev.map((r) =>
        r.id === pickerRowId
          ? { ...r, lat, lng, status: "success", error: undefined }
          : r,
      ),
    );
    closePicker();
  };

  const setRowLatLng = (
    rowId: number,
    field: "lat" | "lng",
    value: number | null,
  ) => {
    setGeocodeRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const next: GeocodedRow = { ...r, [field]: value } as GeocodedRow;
        const hasBoth = next.lat != null && next.lng != null;
        if (hasBoth) next.status = "success";
        return next;
      }),
    );
  };

  return {
    geocodeRows,
    startGeocoding,
    geocodeInProgress,
    geocodeStarted,
    failedGeocodes,
    stats: {
      failed: failedGeocodes.length,
      pending: pendingGeocodes,
      success: successfulGeocodes,
      total: geocodeRows.length,
    },
    openPickerForRow,
    pickerState: {
      open: pickerOpen,
      rowId: pickerRowId,
      currentPoint: (() => {
        if (pickerRowId == null) return null;
        const row = geocodeRows.find((r) => r.id === pickerRowId);
        if (!row) return null;
        if (row.lat == null || row.lng == null) return null;
        return { lat: row.lat, lng: row.lng };
      })(),
      close: closePicker,
      save: savePickedPoint,
    },
    setRowLatLng,
  };
}
