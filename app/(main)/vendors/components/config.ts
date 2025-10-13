import {
  CheckCircle,
  MapPin,
  FileEdit,
  AlertTriangle,
  Timer,
} from "lucide-react";

export const orderStatuses = [
  {
    value: "draft",
    label: "Draft",
    icon: FileEdit,
  },
  {
    value: "needs_geocode",
    label: "Needs Geocode",
    icon: MapPin,
  },
  {
    value: "ready",
    label: "Ready",
    icon: CheckCircle,
  },
];

export const geocodeStatuses = [
  {
    value: "pending",
    label: "Pending",
    icon: Timer,
  },
  {
    value: "ok",
    label: "OK",
    icon: CheckCircle,
  },
  {
    value: "failed",
    label: "Failed",
    icon: AlertTriangle,
  },
];
