export type OrderStatus = "draft" | "needs_geocode" | "ready";
export type GeocodeStatus = "pending" | "ok" | "failed";

export type OrderSummary = {
  order_id: string;
  status: OrderStatus;
  geocode_status: GeocodeStatus;
  ready_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Order = OrderSummary & {
  recipient_name: string;
  recipient_phone: string;
  delivery_address_text: string;
  municipality?: string;
  ward?: string;
  tole?: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  weight_kg: number;
  dimensions?: {
    l: number;
    w: number;
    h: number;
  };
};

export type OrderDetails = OrderSummary & Order;

export type OrderListResponse = {
  items: OrderSummary[];
  page: number;
  page_size: number;
  total: number;
};

export type OrderFilters = {
  search?: string;
  status?: "all" | OrderStatus;
  geocode_status?: "all" | GeocodeStatus;
  page?: number;
  page_size?: number;
};

// Bulk upload response shape returned by backend
export type BulkUploadResponse = {
  created: OrderSummary[];
  failed: { index: number; error: string }[];
};

export type RunBooking = {
  orderId: string;
  priority: number;
  quantity: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  customerName: string;
  contactNumber: string;
  address: string;
};

export type CreateRunRequest = {
  businessNumber: string;
  runStartTime: string;
  runEndTime: string;
  readyToPickupTime: string;
  runName: string;
  runBookings: RunBooking[];
  apiKey: string;
};
