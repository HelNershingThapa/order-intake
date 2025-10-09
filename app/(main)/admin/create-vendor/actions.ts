"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/serverFetch";

export type CreateVendorState = {
  ok?: boolean;
  error?: string;
  vendor?: { id: string; apiKey: string };
};

export async function createVendorAction(
  _prev: CreateVendorState,
  formData: FormData,
): Promise<CreateVendorState> {
  // Read fields from formData
  const name = formData.get("name")?.toString().trim() || "";
  const contact_name = formData.get("contact_name")?.toString().trim() || "";
  const contact_phone = formData.get("contact_phone")?.toString().trim() || "";
  const pickup_address_text =
    formData.get("pickup_address_text")?.toString().trim() || "";
  const pickup_window_start =
    formData.get("pickup_window_start")?.toString() || "";
  const pickup_window_end = formData.get("pickup_window_end")?.toString() || "";
  const pickup_lat = Number(formData.get("pickup_lat") || "");
  const pickup_lon = Number(formData.get("pickup_lon") || "");

  // (Optional) light server-side validation mirroring your client checks
  if (name.length < 3 || name.length > 100) {
    return { error: "Vendor name must be between 3 and 100 characters" };
  }
  if (contact_name.length < 2 || contact_name.length > 100) {
    return { error: "Contact name must be between 2 and 100 characters" };
  }
  if (!/^\+?\d{9,15}$/.test(contact_phone)) {
    return {
      error: "Contact phone must be a valid number (9–15 digits, optional +)",
    };
  }
  if (pickup_address_text.length < 5 || pickup_address_text.length > 300) {
    return { error: "Pickup address must be between 5 and 300 characters" };
  }
  if (!Number.isFinite(pickup_lat) || !Number.isFinite(pickup_lon)) {
    return { error: "Please select a location on the map" };
  }
  if (!pickup_window_start || !pickup_window_end) {
    return { error: "Pickup window start and end times are required" };
  }

  try {
    // Call backend with admin key
    const res = await serverFetch<{ id: string; apiKey: string }>(
      "/admin/vendors",
      {
        method: "POST",
        useAdminKey: true,
        body: JSON.stringify({
          name,
          contact_name,
          contact_phone,
          pickup_address_text,
          pickup_lat,
          pickup_lon,
          pickup_window_start,
          pickup_window_end,
        }),
      },
    );

    revalidatePath("/admin"); // up to you
    return { ok: true, vendor: res };
  } catch (e: any) {
    const msg =
      e?.body?.detail ||
      e?.message ||
      (Array.isArray(e?.body?.detail)
        ? e.body.detail
            .map((d: any) => `${d.loc?.join(".")}: ${d.msg}`)
            .join("\n")
        : "Failed to create vendor");
    return { error: msg };
  }
}
