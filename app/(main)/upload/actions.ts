"use server";

import { serverFetch } from "@/lib/serverFetch";
import type { BulkUploadResponse, RawOrder } from "@/types/order";

export async function uploadOrders(
  orders: RawOrder[],
): Promise<BulkUploadResponse> {
  return serverFetch<BulkUploadResponse>("/orders/bulk", {
    method: "POST",
    body: JSON.stringify({ items: orders }),
  });
}
