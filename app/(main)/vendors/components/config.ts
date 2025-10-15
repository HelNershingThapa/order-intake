import { CheckCircle, MapPin, FileEdit } from "lucide-react";

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
