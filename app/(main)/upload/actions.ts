"use server"

import type { OrderFormData } from "@/components/orders/order-schema"
import { serverFetch } from "@/lib/serverFetch"
import type { BulkUploadResponse } from "@/types/order"

export async function uploadOrders(
  orders: OrderFormData[]
): Promise<BulkUploadResponse> {
  return serverFetch<BulkUploadResponse>("/orders/bulk", {
    method: "POST",
    body: JSON.stringify({ items: orders }),
  })
}
