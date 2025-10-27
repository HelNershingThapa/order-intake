import { format, subDays, subMonths, subYears } from "date-fns"

export const dateRanges = {
  "7D": {
    from: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  },
  "30D": {
    from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  },
  "3M": {
    from: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  },
  "1Y": {
    from: format(subYears(new Date(), 1), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  },
  ALL: { from: "all", to: format(new Date(), "yyyy-MM-dd") },
}

export type TimeRange = keyof typeof dateRanges | "custom"

export const timeRangeText: Record<TimeRange, string> = {
  "7D": "7 days",
  "30D": "30 days",
  "3M": "3 months",
  "1Y": "1 year",
  ALL: "all time",
  custom: "custom range",
}
