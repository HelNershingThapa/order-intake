"use client";

import { useEffect, useRef,useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { GeocodeErrorsStep } from "@/components/bulk-import/geocode-errors-step";
import { MapColumnsStep } from "@/components/bulk-import/map-columns-step";
import { ReviewStep } from "@/components/bulk-import/review-step";
import {
  type CanonicalKey,
  createEmptyMapping,
  type GeocodedRow,
  requiredKeys,
  steps,
} from "@/components/bulk-import/steps";
import { UploadFileStep } from "@/components/bulk-import/upload-file-step";
import { useGeocoding } from "@/components/bulk-import/use-geocoding";
import { CoordinatePickerDialog } from "@/components/map/coordinate-picker-dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { type CsvRow } from "@/utils/csv-parser";

import { uploadOrders } from "./actions";

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

  const mutation = useMutation({
    mutationFn: uploadOrders,
    onSuccess: (res) => {
      const created = res?.created?.length ?? 0;
      const failed = res?.failed?.length ?? 0;
      toast.success("Bulk upload complete", {
        description: `Created: ${created} • Failed: ${failed}`,
      });
      // Clear persisted state after successful upload
      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {}

      // Reset state in UI
      setOrders([]);
      setHeaders([]);
      setMapping(createEmptyMapping());
      setCurrentStep(steps[0].value);
    },
    onError: (error) => {
      toast.error("Bulk upload failed", {
        description:
          JSON.stringify(error?.message, null, 2) ||
          "An error occurred while uploading orders",
      });
    },
  });

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

  // Build RawOrder[] from successful geocoded rows and submit to backend
  const handleSubmitOrders = async () => {
    if (mutation.isPending) return;
    try {
      const successRows = geocode.geocodeRows.filter(
        (r) => r.status === "success" && r.lat != null && r.lng != null,
      );
      if (!successRows.length) {
        toast.error("No geocoded rows to upload");
        return;
      }

      const parseNumber = (v: any): number | undefined => {
        if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
        const s = String(v ?? "")
          .replace(/,/g, "")
          .trim();
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : undefined;
      };

      const parseDimensions = (
        v: any,
      ): { l: number; w: number; h: number } | undefined => {
        if (v == null) return undefined;
        if (typeof v === "object") {
          const l = parseNumber((v as any).l);
          const w = parseNumber((v as any).w);
          const h = parseNumber((v as any).h);
          if (l && w && h) return { l, w, h };
          return undefined;
        }
        const s = String(v);
        const nums = s
          .split(/[^0-9.]+/)
          .map((x) => parseFloat(x))
          .filter((n) => Number.isFinite(n));
        if (nums.length >= 3) {
          return { l: nums[0], w: nums[1], h: nums[2] };
        }
        return undefined;
      };

      const items = successRows.map((r) => {
        const rawW = parseNumber(r.mapped.parcel_weight);
        let weight_kg: number;
        if (rawW == null || !Number.isFinite(rawW) || rawW <= 0) {
          // enforce > 0 if missing/invalid
          weight_kg = 0.01;
        } else if (rawW > 1000) {
          // cap at 1000 if it exceeds
          weight_kg = 1000;
        } else {
          weight_kg = rawW;
        }
        return {
          recipient_name: String(r.mapped.recipient_name ?? ""),
          recipient_phone: String(r.mapped.recipient_phone ?? ""),
          delivery_address_text: String(r.mapped.delivery_address_text ?? ""),
          municipality: r.mapped.municipality
            ? String(r.mapped.municipality)
            : undefined,
          ward: r.mapped.ward ? String(r.mapped.ward) : undefined,
          tole: r.mapped.tole ? String(r.mapped.tole) : undefined,
          landmark: r.mapped.landmark ? String(r.mapped.landmark) : undefined,
          lat: r.lat ?? undefined,
          lng: r.lng ?? undefined,
          // Ensure weight > 0 and cap at 1000 (assign 1000 if it exceeds)
          weight_kg,
          dimensions: parseDimensions(r.mapped.dimensions),
        };
      });

      mutation.mutate(items);
    } catch (e: any) {
      toast.error("Bulk upload failed", {
        description: e?.message || "An error occurred while uploading orders",
      });
    }
  };

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
          onSubmit={handleSubmitOrders}
          isPending={mutation.isPending}
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
