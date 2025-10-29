import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileEdit,
  Package,
  PackageCheck,
  Truck,
  X,
} from "lucide-react";

import type { OrderStatus } from "@/types/order";

export const orderStatuses = [
  {
    value: "order_placed",
    label: "Order Placed",
    icon: FileEdit,
  },
  {
    value: "order_confirmed",
    label: "Order Confirmed",
    icon: CheckCircle,
  },
  {
    value: "pickup_assigned",
    label: "Pickup Assigned",
    icon: Package,
  },
  {
    value: "pickup_cancelled",
    label: "Pickup Cancelled",
    icon: X,
  },
  {
    value: "pickup_collected",
    label: "Pickup Collected",
    icon: PackageCheck,
  },
  {
    value: "ready_for_delivery",
    label: "Ready for Delivery",
    icon: Clock,
  },
  {
    value: "delivery_assigned",
    label: "Delivery Assigned",
    icon: Truck,
  },
  {
    value: "delivery_successfull",
    label: "Delivery Successful",
    icon: CheckCircle,
  },
  {
    value: "delivery_failed",
    label: "Delivery Failed",
    icon: AlertTriangle,
  },
] satisfies { value: OrderStatus; label: string; icon: typeof FileEdit }[];
