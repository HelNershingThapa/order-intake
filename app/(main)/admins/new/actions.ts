import { serverFetch } from "@/lib/serverFetch"

import { AdminFormData } from "./components/admin-form"

type AdminCreationResponse = {
  message: string
  user_id: string
}

export async function createAdmin(data: AdminFormData) {
  return serverFetch<AdminCreationResponse>("/admin/create-admin", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
