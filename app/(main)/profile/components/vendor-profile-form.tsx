"use client";

import React from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { convertLocalTimeToUTC, convertUTCToLocalTime } from "@/utils/timezone";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PickupLocationMap } from "./pickup-location-map";
import type { CurrentUser } from "@/types/miscellaneous";
import { updateVendor } from "../actions";

const vendorSchema = z.object({
  contact_name: z.string().min(2).max(100),
  contact_phone: z
    .string()
    .regex(
      /^\+?\d{9,15}$/,
      "Contact phone must be a valid number (9–15 digits, optional +)",
    ),
  pickup_address_text: z.string().min(5).max(300),
  pickup_window_start: z.string().min(1, "Required"),
  pickup_window_end: z.string().min(1, "Required"),
  pickup_lat: z.number(),
  pickup_lon: z.number(),
});

export type VendorFormData = z.infer<typeof vendorSchema>;

export default function VendorProfileForm({
  vendor,
}: {
  vendor: CurrentUser["vendor"];
}) {
  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      contact_name: vendor?.contact_name || "",
      contact_phone: vendor?.contact_phone || "",
      pickup_lat: vendor?.pickup_lat || undefined,
      pickup_lon: vendor?.pickup_lon || undefined,
      pickup_address_text: vendor?.pickup_address_text || "",
      pickup_window_start: vendor?.pickup_window_start
        ? convertUTCToLocalTime(vendor.pickup_window_start)
        : "",
      pickup_window_end: vendor?.pickup_window_end
        ? convertUTCToLocalTime(vendor.pickup_window_end)
        : "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: VendorFormData) => updateVendor(data),
    onSuccess: (data) => {
      toast.success("Vendor created successfully!", {
        description: `Vendor ID: ${data.vendor.id}`,
        duration: 5000,
      });
    },
    onError: (error) => {
      toast.error("Failed to create vendor", {
        description: <div className="whitespace-pre-line">{error.message}</div>,
        duration: 8000,
      });
    },
  });

  function onSubmit(values: VendorFormData) {
    // Convert local times to UTC before submitting
    const dataToSubmit = {
      ...values,
      pickup_window_start: convertLocalTimeToUTC(values.pickup_window_start),
      pickup_window_end: convertLocalTimeToUTC(values.pickup_window_end),
    };

    mutation.mutate(dataToSubmit);
  }

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Phone" {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pickup_address_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Pickup Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickup_window_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Window Start (Local Time)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pickup Window Start"
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pickup_window_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Window End (Local Time)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pickup Window End"
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <PickupLocationMap />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickup_lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="27.7172"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pickup_lon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="85.3240"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Submit</Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
