import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
} from "nuqs/server"

export const ordersSearchParams = {
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  page_size: parseAsInteger.withDefault(20),
  statuses: parseAsArrayOf(parseAsString).withDefault([]),
  vendor_id: parseAsArrayOf(parseAsString).withDefault([]),
  geocode_status: parseAsString,
  from_: parseAsIsoDate,
  to: parseAsIsoDate,
} as const

export const serializeOrdersSearchParams = createSerializer(ordersSearchParams)

export const loadSearchParams = createLoader(ordersSearchParams)

// Infer the parsed type from nuqs loader
export type OrdersSearchParams = Awaited<ReturnType<typeof loadSearchParams>>
