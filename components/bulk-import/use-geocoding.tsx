"use client";
import { useCallback, useEffect, useState } from "react";
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

  const simulateGeocodeAPI = (
    address: string,
  ): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      const delay = 150 + Math.random() * 450;
      setTimeout(() => {
        if (address && address.trim().length > 3 && Math.random() < 0.7) {
          const lat = 26.4 + Math.random() * (30.4 - 26.4);
          const lng = 80 + Math.random() * (88.2 - 80);
          resolve({
            lat: parseFloat(lat.toFixed(5)),
            lng: parseFloat(lng.toFixed(5)),
          });
        } else {
          resolve(null);
        }
      }, delay);
    });
  };

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
    const updateRow = (
      rowId: number,
      result: { lat: number; lng: number } | null,
    ) => {
      setGeocodeRows((prev) => {
        const updated: GeocodedRow[] = [];
        for (const r of prev) {
          updated.push(transformRow(r, rowId, result));
        }
        return updated;
      });
    };
    const run = async () => {
      for (const row of pending) {
        if (cancelled) return;
        const addr = (row.mapped.delivery_address_text || "").toString();
        const result = await simulateGeocodeAPI(addr);
        updateRow(row.id, result);
      }
      setGeocodeInProgress(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [geocodeRows, geocodeStarted]);

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
