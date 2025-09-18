"use client";

import { useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoordinatePickerDialog } from "@/components/map/coordinate-picker-dialog";
import {
  steps,
  createEmptyMapping,
  requiredKeys,
  type CanonicalKey,
  type GeocodedRow,
} from "@/components/bulk-import/steps";
import { UploadFileStep } from "@/components/bulk-import/upload-file-step";
import { MapColumnsStep } from "@/components/bulk-import/map-columns-step";
import { GeocodeErrorsStep } from "@/components/bulk-import/geocode-errors-step";
import { ReviewStep } from "@/components/bulk-import/review-step";
import { useGeocoding } from "@/components/bulk-import/use-geocoding";
import { type CsvRow } from "@/utils/csv-parser";

export default function Page() {
  // --- Persistence (localStorage) ---
  const STORAGE_KEY = "bulk-import-state-v1";
  interface PersistedState {
    step: (typeof steps)[number]["value"]; // current step value
    orders: CsvRow[];
    headers: string[];
    mapping: ReturnType<typeof createEmptyMapping>;
    geocoding?: {
      rows: GeocodedRow[];
      started: boolean;
    };
  }
  // Guard to avoid persisting immediately on first hydration restore
  const hydratedRef = useRef(false);
  const [currentStep, setCurrentStep] = useState<
    (typeof steps)[number]["value"]
  >(steps[0].value);
  const [orders, setOrders] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState(createEmptyMapping());

  const updateMapping = (key: CanonicalKey, value: string) =>
    setMapping((m) => ({ ...m, [key]: value }));

  const geocode = useGeocoding({ data: orders, mapping });

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PersistedState> | null;
      if (!parsed) return;
      // Basic validation
      if (parsed.headers && Array.isArray(parsed.headers))
        setHeaders(parsed.headers);
      if (parsed.orders && Array.isArray(parsed.orders))
        setOrders(parsed.orders as CsvRow[]);
      if (parsed.mapping && typeof parsed.mapping === "object")
        setMapping(parsed.mapping);
      if (parsed.step && steps.some((s) => s.value === parsed.step))
        setCurrentStep(parsed.step);
      // Hydrate geocoding rows if present
      if (
        parsed.geocoding &&
        Array.isArray(parsed.geocoding.rows) &&
        parsed.geocoding.rows.length
      ) {
        geocode.hydrateFromPersisted(
          parsed.geocoding.rows as any[],
          Boolean(parsed.geocoding.started),
        );
      }
    } catch (e) {
      console.warn("Failed to hydrate bulk import state", e);
    } finally {
      hydratedRef.current = true;
    }
  }, []);

  // Persist whenever relevant state changes (after hydration)
  useEffect(() => {
    if (!hydratedRef.current) return; // skip initial render before hydration
    if (typeof window === "undefined") return;
    try {
      if (!orders.length) {
        // If no orders, clear persisted state to avoid stale data.
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const data: PersistedState = {
        step: currentStep,
        orders,
        headers,
        mapping,
        geocoding: {
          rows: geocode.geocodeRows,
          started: geocode.geocodeStarted,
        },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to persist bulk import state", e);
    }
  }, [
    orders,
    headers,
    mapping,
    currentStep,
    geocode.geocodeRows,
    geocode.geocodeStarted,
  ]);

  // Auto advance to duplicates when all geocoded
  useEffect(() => {
    if (
      currentStep === "errors" &&
      geocode.geocodeRows.length &&
      geocode.geocodeRows.every((r) => r.status === "success")
    ) {
      const t = setTimeout(() => setCurrentStep("review"), 500);
      return () => clearTimeout(t);
    }
  }, [currentStep, geocode.geocodeRows]);

  // If user refreshes while on errors step before geocoding started, resume automatically
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (
      currentStep === "errors" &&
      orders.length &&
      !geocode.geocodeRows.length
    ) {
      geocode.startGeocoding();
    }
  }, [currentStep, orders.length, geocode.geocodeRows.length]);

  return (
    <div className="space-y-6">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Bulk Import
      </h2>
      <div className="space-y-1">
        <ol className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
          {steps.map((step, idx) => {
            const currentIndex = steps.findIndex(
              (s) => s.value === currentStep,
            );
            const status =
              idx < currentIndex
                ? "completed"
                : idx === currentIndex
                ? "current"
                : "upcoming";
            return (
              <li key={step.value} className="flex items-center">
                <div className="flex items-center gap-2">
                  {status === "completed" && (
                    <span className="flex size-4 items-center justify-center rounded-full border border-green-600 bg-green-50 text-green-600">
                      <Check className="size-3.5" />
                    </span>
                  )}
                  {status === "current" && (
                    <span className="flex size-4 items-center justify-center rounded-full border border-primary text-[11px] font-medium">
                      {idx + 1}
                    </span>
                  )}
                  {status === "upcoming" && (
                    <span className="size-4 rounded-full border border-muted-foreground/30"></span>
                  )}
                  <span
                    className={cn(
                      status === "current" && "font-semibold",
                      status === "upcoming" && "text-muted-foreground",
                      status === "completed" && "text-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <span className="mx-2 text-muted-foreground">&gt;</span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-muted-foreground">
          Step {steps.findIndex((s) => s.value === currentStep) + 1} of{" "}
          {steps.length}
        </p>
      </div>
      <Separator />
      {currentStep === "upload" && (
        <UploadFileStep
          onParsed={({ headers, rows }) => {
            setHeaders(headers);
            setOrders(rows);
            setCurrentStep("map");
          }}
        />
      )}
      {currentStep === "map" && headers.length > 0 && (
        <MapColumnsStep
          headers={headers}
          mapping={mapping}
          updateMapping={updateMapping}
          onReset={() => setMapping(createEmptyMapping())}
          onContinue={() => {
            setCurrentStep("errors");
            geocode.startGeocoding();
          }}
        />
      )}
      {currentStep === "errors" && (
        <GeocodeErrorsStep
          geocodeRows={geocode.geocodeRows}
          failedGeocodes={geocode.failedGeocodes}
          stats={{
            total: geocode.stats.total,
            success: geocode.stats.success,
            failed: geocode.stats.failed,
            pending: geocode.stats.pending,
          }}
          geocodeInProgress={geocode.geocodeInProgress}
          openPickerForRow={geocode.openPickerForRow}
          setRowLatLng={geocode.setRowLatLng}
        />
      )}
      {currentStep === "review" && (
        <ReviewStep
          rows={geocode.geocodeRows}
          onBack={() => setCurrentStep("errors")}
          onContinue={() => setCurrentStep("folder")}
        />
      )}
      <CoordinatePickerDialog
        open={geocode.pickerState.open}
        onOpenChange={(o) => {
          if (!o) geocode.pickerState.close();
        }}
        initialPoint={geocode.pickerState.currentPoint || undefined}
        rowLabel={
          geocode.pickerState.rowId != null
            ? `Row #${geocode.pickerState.rowId + 1}`
            : undefined
        }
        onSave={(p) => geocode.pickerState.save(p.lat, p.lng)}
      />
    </div>
  );
}
