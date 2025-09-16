"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { type GeocodedRow } from "./steps";

interface GeocodeErrorsStepProps {
  geocodeRows: GeocodedRow[];
  failedGeocodes: GeocodedRow[];
  stats: { total: number; success: number; failed: number; pending: number };
  geocodeInProgress: boolean;
  openPickerForRow: (rowId: number) => void;
  setRowLatLng: (
    rowId: number,
    field: "lat" | "lng",
    value: number | null,
  ) => void;
}

export function GeocodeErrorsStep({
  geocodeRows,
  failedGeocodes,
  stats,
  geocodeInProgress,
  openPickerForRow,
  setRowLatLng,
}: GeocodeErrorsStepProps) {
  const { success, failed, pending, total } = stats;
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">Fix Geocoding Errors</h3>
        <p className="text-xs text-muted-foreground">
          We attempted to geocode each order. Provide coordinates for rows that
          failed. This step will advance automatically once all rows have valid
          coordinates.
        </p>
      </div>
      <div className="text-xs flex flex-wrap gap-4 rounded-md border p-3 bg-muted/30">
        <span>
          Total: {total} | Success: {success} | Failed: {failed} | Pending:{" "}
          {pending}
        </span>
        {geocodeInProgress && (
          <span className="text-blue-600">Geocoding in progress...</span>
        )}
      </div>
      {failed === 0 && geocodeRows.length > 0 && (
        <div className="text-sm text-green-600 font-medium flex items-center gap-2">
          <Check className="h-4 w-4" /> All rows geocoded. Advancing shortly...
        </div>
      )}
      {failed > 0 && (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="w-40">Latitude</TableHead>
                <TableHead className="w-40">Longitude</TableHead>
                <TableHead className="w-40">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failedGeocodes.map((r) => {
                const recName = r.mapped.recipient_name || "(missing)";
                const addr = r.mapped.delivery_address_text || "";
                return (
                  <TableRow key={r.id} className="text-sm">
                    <TableCell>{r.id + 1}</TableCell>
                    <TableCell
                      className="max-w-[160px] truncate"
                      title={recName}
                    >
                      {recName}
                    </TableCell>
                    <TableCell className="max-w-[240px] truncate" title={addr}>
                      {addr}
                    </TableCell>
                    <TableCell>
                      <Input
                        defaultValue={r.lat ?? ""}
                        placeholder="Lat"
                        className="h-8 text-xs"
                        onChange={(e) => {
                          const v = e.target.value;
                          setRowLatLng(r.id, "lat", v ? parseFloat(v) : null);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        defaultValue={r.lng ?? ""}
                        placeholder="Lng"
                        className="h-8 text-xs"
                        onChange={(e) => {
                          const v = e.target.value;
                          setRowLatLng(r.id, "lng", v ? parseFloat(v) : null);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px]"
                          onClick={() => openPickerForRow(r.id)}
                        >
                          Pick on Map
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
