import { serverFetch } from "./serverFetch";
import { OrderListResponse, OrderFilters, OrderDetails } from "@/types/order";

export async function getOrders(
  filters: OrderFilters = {},
): Promise<OrderListResponse> {
  const {
    search,
    status = "all",
    geocode_status = "all",
    page = 1,
    page_size = 20,
  } = filters;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("page_size", page_size.toString());

  if (search?.trim()) params.set("search", search.trim());
  if (status !== "all") params.set("status", status);
  if (geocode_status !== "all") params.set("geocode_status", geocode_status);

  return serverFetch<OrderListResponse>(`/orders?${params.toString()}`);
}

export async function getOrder(orderId: string): Promise<OrderDetails> {
  return serverFetch<OrderDetails>(`/orders/${orderId}`);
}

export async function createOrder(data: any): Promise<OrderDetails> {
  return serverFetch<OrderDetails>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOrder(
  orderId: string,
  data: any,
): Promise<OrderDetails> {
  return serverFetch<OrderDetails>(`/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteOrder(orderId: string): Promise<void> {
  return serverFetch(`/orders/${orderId}`, { method: "DELETE" });
}
