"use server";

import type { BulkUploadResponse, RawOrder } from "@/types/order";
import { serverFetch } from "@/lib/serverFetch";

export async function uploadOrders(
  orders: RawOrder[],
): Promise<BulkUploadResponse> {
  return serverFetch<BulkUploadResponse>("/orders/bulk", {
    method: "POST",
    body: JSON.stringify({ items: orders }),
  });
}
