import { serverFetch } from "@/lib/serverFetch"

import type { AdminProfileData, TimeWindow } from "./components/schema"

export const updateAdminProfile = async (data: AdminProfileData) => {
  return serverFetch("/admin/vendors/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export const getPickupWindows = (isActive?: boolean) => {
  // pass isActive as search param only if it has been passed a value
  const queryParams = new URLSearchParams()
  if (isActive !== undefined) {
    queryParams.append("is_active", String(isActive))
  }
  const queryString = queryParams.toString()
  const path = queryString
    ? `/me/pickup-windows?${queryString}`
    : `/me/pickup-windows`
  return serverFetch<TimeWindow[]>(path)
}
