"use client";

import React, { useState, useTransition } from "react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VendorForm from "@/components/admin/VendorForm";
import CoordinatesDisplay from "@/components/admin/CoordinatesDisplay";
import LocationMap from "@/components/map/LocationMap";
import SubmitSection from "@/components/admin/SubmitSection";
import {
  createVendorAction,
  type CreateVendorState,
} from "@/app/(main)/admin/create-vendor/actions";

interface VendorFormData {
  name: string;
  contact_name: string;
  contact_phone: string;
  pickup_address_text: string;
  pickup_window_start: string;
  pickup_window_end: string;
}

export default function CreateVendorFormClient() {
  const [form, setForm] = useState<VendorFormData>({
    name: "",
    contact_name: "",
    contact_phone: "",
    pickup_address_text: "",
    pickup_window_start: "",
    pickup_window_end: "",
  });

  const [marker, setMarker] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [coords, setCoords] = useState({ lat: "", lon: "" });

  // Hook up the server action
  const [state, formAction, pending] = useActionState<
    CreateVendorState,
    FormData
  >(createVendorAction, {});

  // Toast feedback from server action result
  useEffect(() => {
    if (state?.ok && state.vendor) {
      toast.success("Vendor created successfully!", {
        description: `Vendor ID: ${state.vendor.id}`,
        duration: 5000,
      });
    } else if (state?.error) {
      toast.error("Failed to create vendor", {
        description: <div className="whitespace-pre-line">{state.error}</div>,
        duration: 8000,
      });
    }
  }, [state]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationSelect = (lat: number, lon: number, address?: string) => {
    setMarker({ lat, lon });
    setCoords({ lat: lat.toFixed(6), lon: lon.toFixed(6) });
    if (address) {
      setForm((prev) => ({ ...prev, pickup_address_text: address }));
    }
  };

  const handleMapClick = (lat: number, lon: number) => {
    setMarker({ lat, lon });
    setCoords({ lat: lat.toFixed(6), lon: lon.toFixed(6) });
  };

  // Optional light client-side validation (kept from your original)
  const preSubmitValidate = () => {
    if (!form.name.trim() || form.name.length < 3 || form.name.length > 100)
      return "Vendor name must be between 3 and 100 characters";
    if (
      !form.contact_name.trim() ||
      form.contact_name.length < 2 ||
      form.contact_name.length > 100
    )
      return "Contact name must be between 2 and 100 characters";
    if (!/^\+?\d{9,15}$/.test(form.contact_phone.trim()))
      return "Contact phone must be a valid number (9–15 digits, optional +)";
    if (
      !form.pickup_address_text.trim() ||
      form.pickup_address_text.length < 5 ||
      form.pickup_address_text.length > 300
    )
      return "Pickup address must be between 5 and 300 characters";
    if (!coords.lat || !coords.lon)
      return "Please select a location on the map";
    if (!form.pickup_window_start || !form.pickup_window_end)
      return "Pickup window start and end times are required";
    return null;
  };

  // We submit the real <form> below. This handler just prevents
  // avoidable round-trips when the client validation obviously fails.
  const onClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const err = preSubmitValidate();
    if (err) {
      e.preventDefault();
      toast.error(err);
    }
    // else allow submit → server action runs
  };

  return (
    <Card className="w-full max-w-lg shadow-lg p-6">
      {/* IMPORTANT: real <form> with action bound to server action */}
      <form action={formAction} onSubmit={onClientSubmit} noValidate>
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Create Vendor</h2>

          {/* Controlled inputs still work; values will be included in form submit */}
          <VendorForm form={form} onChange={handleFormChange} />

          {/* Hidden inputs to ensure lat/lon are posted */}
          <input type="hidden" name="pickup_lat" value={coords.lat} />
          <input type="hidden" name="pickup_lon" value={coords.lon} />

          {/* Map with search */}
          <div className="mt-4">
            <LocationMap
              marker={marker}
              onMapClick={handleMapClick}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Read-only display (optional UI only) */}
          <CoordinatesDisplay lat={coords.lat} lon={coords.lon} />

          {/* Submit section — make button type="submit" */}
          <SubmitSection
            loading={pending}
            response={
              state?.ok && state.vendor
                ? { id: state.vendor.id, apiKey: state.vendor.apiKey }
                : null
            }
            onSubmit={() => {
              /* not used; submit handled by <form> */
            }}
          />
        </CardContent>
      </form>
    </Card>
  );
}
