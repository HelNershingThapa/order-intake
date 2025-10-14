"use server";

import { serverFetch } from "@/lib/serverFetch";
import type { VendorFormData } from "./components/vendor-profile-form";

export async function updateVendor(data: VendorFormData) {
  return serverFetch(`/vendor/me/profile`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
