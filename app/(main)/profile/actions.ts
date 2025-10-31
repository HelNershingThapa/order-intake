"use server"

import { serverFetch } from "@/lib/serverFetch"

import type { TimeWindow } from "../settings/components/schema"
import type { VendorFormData } from "./components/vendor-profile-form"

export async function updateVendor(data: VendorFormData) {
  return serverFetch(`/vendor/me/profile`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function getPickupWindows() {
  return serverFetch<TimeWindow[]>("/me/pickup-windows", {
    method: "GET",
  })
}
