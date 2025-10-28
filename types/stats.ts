import type { OrderStatus } from "./order"

type ISODateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`

interface StatsRange {
  from: ISODateString
  to: ISODateString
}

interface StatsTotals {
  orders: number
  total_weight_kg: number
  by_status: Record<OrderStatus, number>
}

export interface StatsOverview {
  range: StatsRange
  totals: StatsTotals
  today: StatsTotals
}

interface StatsDailyItem {
  date: ISODateString
  total_orders: number
  total_weight_kg: number
  by_status: Record<OrderStatus, number>
}

export interface StatsDaily {
  items: StatsDailyItem[]
}
