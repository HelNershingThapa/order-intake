import { format } from "date-fns"

import type { Order, OrderFilters, OrderListResponse } from "@/types/order"

import { serverFetch } from "./serverFetch"

export async function getOrders(
  filters: OrderFilters = {}
): Promise<OrderListResponse> {
  const { search, statuses, geocode_status, page = 1, page_size = 10 } = filters

  const params = new URLSearchParams()
  params.set("page", page.toString())
  params.set("page_size", page_size.toString())

  if (search?.trim()) params.set("search", search.trim())
  if (statuses && statuses.length > 0) {
    statuses.forEach((status) => {
      params.append("statuses", status)
    })
  }
  if (geocode_status && geocode_status !== "all")
    params.set("geocode_status", geocode_status)
  if (filters.from_) {
    params.set("from_", format(filters.from_, "yyyy-MM-dd"))
  }
  if (filters.to) {
    params.set("to", format(filters.to, "yyyy-MM-dd"))
  }
  return serverFetch<OrderListResponse>(`/orders?${params.toString()}`, {
    next: {
      tags: ["orders", params.toString()],
    },
  })
}

export async function getOrder(orderId: string): Promise<Order> {
  return serverFetch<Order>(`/orders/${orderId}`)
}

export async function createOrder(data: any): Promise<Order> {
  return serverFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateOrder(orderId: string, data: any): Promise<Order> {
  return serverFetch<Order>(`/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteOrder(orderId: string): Promise<void> {
  return serverFetch(`/orders/${orderId}`, { method: "DELETE" })
}
