"use client";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoordinatePickerDialog } from "@/components/map/coordinate-picker-dialog";
import {
  steps,
  createEmptyMapping,
  requiredKeys,
  type CanonicalKey,
} from "@/components/bulk-import/steps";
import { UploadFileStep } from "@/components/bulk-import/upload-file-step";
import { MapColumnsStep } from "@/components/bulk-import/map-columns-step";
import { GeocodeErrorsStep } from "@/components/bulk-import/geocode-errors-step";
import { useGeocoding } from "@/components/bulk-import/use-geocoding";
import { type CsvRow } from "@/utils/csv-parser";

export default function Page() {
  const [currentStep, setCurrentStep] = useState<
    (typeof steps)[number]["value"]
  >(steps[0].value);
  const [data, setData] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState(createEmptyMapping());

  const updateMapping = (key: CanonicalKey, value: string) =>
    setMapping((m) => ({ ...m, [key]: value }));

  const geocode = useGeocoding({ data, mapping });

  // Auto advance to duplicates when all geocoded
  useEffect(() => {
    if (
      currentStep === "errors" &&
      geocode.geocodeRows.length &&
      geocode.geocodeRows.every((r) => r.status === "success")
    ) {
      const t = setTimeout(() => setCurrentStep("duplicates"), 500);
      return () => clearTimeout(t);
    }
  }, [currentStep, geocode.geocodeRows]);

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
            setData(rows);
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
