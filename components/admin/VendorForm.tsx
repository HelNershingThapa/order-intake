"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface VendorFormData {
  name: string;
  contact_name: string;
  contact_phone: string;
  pickup_address_text: string;
  pickup_window_start: string;
  pickup_window_end: string;
}

interface VendorFormProps {
  form: VendorFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VendorForm({ form, onChange }: VendorFormProps) {
  return (
    <div className="space-y-4">
      {/* Vendor Name */}
      <div>
        <Label htmlFor="name">Vendor Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Vendor Name"
          type="text"
          value={form.name}
          onChange={onChange}
        />
      </div>

      {/* Contact Name */}
      <div>
        <Label htmlFor="contact_name">Contact Name</Label>
        <Input
          id="contact_name"
          name="contact_name"
          placeholder="Contact Name"
          type="text"
          value={form.contact_name}
          onChange={onChange}
        />
      </div>

      {/* Contact Phone */}
      <div>
        <Label htmlFor="contact_phone">Contact Phone</Label>
        <Input
          id="contact_phone"
          name="contact_phone"
          placeholder="Contact Phone"
          type="tel"
          value={form.contact_phone}
          onChange={onChange}
        />
      </div>

      {/* Pickup Address */}
      <div>
        <Label htmlFor="pickup_address_text">Pickup Address</Label>
        <Input
          id="pickup_address_text"
          name="pickup_address_text"
          placeholder="Pickup Address"
          type="text"
          value={form.pickup_address_text}
          onChange={onChange}
        />
      </div>

      {/* Pickup Window Start */}
      <div>
        <Label htmlFor="pickup_window_start">Pickup Window Start</Label>
        <Input
          id="pickup_window_start"
          name="pickup_window_start"
          type="time"
          value={form.pickup_window_start}
          onChange={onChange}
        />
      </div>

      {/* Pickup Window End */}
      <div>
        <Label htmlFor="pickup_window_end">Pickup Window End</Label>
        <Input
          id="pickup_window_end"
          name="pickup_window_end"
          type="time"
          value={form.pickup_window_end}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
