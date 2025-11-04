export type OrderStatus =
  | "order_placed"
  | "order_confirmed"
  | "pickup_assigned"
  | "pickup_cancelled"
  | "pickup_collected"
  | "ready_for_delivery"
  | "delivery_assigned"
  | "delivery_successfull"
  | "delivery_failed"

export type GeocodeStatus = "pending" | "ok" | "failed"

export type OrderSummary = {
  order_id: string
  status: OrderStatus
  geocode_status: GeocodeStatus
  ready_at: string | null
  created_at: string
  updated_at: string
}

export type Order = OrderSummary & {
  recipient_name: string
  recipient_phone: string
  delivery_address_text: string
  municipality?: string
  ward?: string
  tole?: string
  landmark?: string
  lat?: number
  lng?: number
  weight_kg: number
  dimensions?: {
    l: number
    w: number
    h: number
  }
  vendor_id: string
  vendor_name: string
}

export type OrderDetails = OrderSummary & Order

export type OrderListResponse = {
  items: Order[]
  page: number
  page_size: number
  total: number
}

// Bulk upload response shape returned by backend
export type BulkUploadResponse = {
  created: OrderSummary[]
  failed: { index: number; error: string }[]
}

export type RunBooking = {
  orderId: string
  priority: number
  quantity: number
  weight: number
  length: number
  width: number
  height: number
  customerName: string
  contactNumber: string
  address: string
}

export type CreateRunRequest = {
  runStartTime: string
  runEndTime: string
  readyToPickupTime: string
  runName: string
  runBookings: RunBooking[]
  runType: "pickup" | "delivery"
  apiKey: string
}
