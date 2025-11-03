import { format } from "date-fns"

import type { OrdersSearchParams } from "@/app/(main)/orders/searchParams"
import type { OrderFormData } from "@/components/orders/order-schema"
import type { Order, OrderListResponse } from "@/types/order"

import { serverFetch } from "./serverFetch"

export async function getOrders(
  filters: Partial<OrdersSearchParams> = {}
): Promise<OrderListResponse> {
  const params = new URLSearchParams()

  params.set("page", (filters.page ?? 1).toString())
  params.set("page_size", (filters.page_size ?? 10).toString())

  // Add optional string params
  if (filters.search) params.set("search", filters.search)
  if (filters.geocode_status) {
    params.set("geocode_status", filters.geocode_status)
  }

  // Add array params
  if (filters.statuses) {
    for (const status of filters.statuses) {
      params.append("statuses", status)
    }
  }
  if (filters.vendor_ids) {
    for (const vendorId of filters.vendor_ids) {
      params.append("vendor_ids", vendorId)
    }
  }
  if (filters.pickup_window) {
    for (const windowId of filters.pickup_window) {
      params.append("pickup_window", windowId)
    }
  }

  if (filters.from_) params.set("from_", format(filters.from_, "yyyy-MM-dd"))
  if (filters.to) params.set("to", format(filters.to, "yyyy-MM-dd"))
  return serverFetch<OrderListResponse>(`/orders?${params.toString()}`, {
    next: {
      tags: ["orders", params.toString()],
    },
  })
}

export async function getOrder(orderId: string): Promise<Order> {
  return serverFetch<Order>(`/orders/${orderId}`)
}

export async function createOrder(data: OrderFormData): Promise<Order> {
  return serverFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateOrder(
  orderId: string,
  data: OrderFormData
): Promise<Order> {
  return serverFetch<Order>(`/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteOrder(orderId: string): Promise<void> {
  return serverFetch(`/orders/${orderId}`, { method: "DELETE" })
}
