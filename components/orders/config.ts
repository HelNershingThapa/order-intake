import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader,
  type LucideIcon,
  OctagonAlert,
  Package,
  PackageCheck,
  Truck,
  X,
} from "lucide-react"

import type { OrderStatus } from "@/types/order"

export const orderStatuses = [
  {
    value: "order_placed",
    label: "Pending Confirmation",
    icon: Loader,
    variant: "warning",
  },
  {
    value: "order_confirmed",
    label: "Order Confirmed",
    icon: CheckCircle,
    variant: "secondary",
  },
  {
    value: "pickup_assigned",
    label: "Pickup Assigned",
    icon: Package,
    variant: "default",
  },
  {
    value: "pickup_cancelled",
    label: "Pickup Cancelled",
    icon: X,
    variant: "destructive",
  },
  {
    value: "pickup_collected",
    label: "Pickup Collected",
    icon: PackageCheck,
    variant: "secondary",
  },
  {
    value: "ready_for_delivery",
    label: "Ready for Delivery",
    icon: Clock,
    variant: "outline",
  },
  {
    value: "delivery_assigned",
    label: "Delivery Assigned",
    icon: Truck,
    variant: "default",
  },
  {
    value: "delivery_successfull",
    label: "Delivery Successful",
    icon: CheckCircle,
    variant: "secondary",
  },
  {
    value: "delivery_failed",
    label: "Delivery Failed",
    icon: AlertTriangle,
    variant: "destructive",
  },
  {
    value: "order_unassigned",
    label: "Could Not Assign",
    icon: OctagonAlert,
    variant: "destructive",
  },
] satisfies {
  value: OrderStatus
  label: string
  icon: LucideIcon
  variant: "default" | "secondary" | "destructive" | "warning" | "outline"
}[]
