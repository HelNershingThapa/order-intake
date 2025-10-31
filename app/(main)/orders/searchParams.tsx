import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
} from "nuqs/server"

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const ordersSearchParams = {
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  page_size: parseAsInteger.withDefault(20),
  statuses: parseAsArrayOf(parseAsString).withDefault([]),
  vendor_id: parseAsArrayOf(parseAsString).withDefault([]),
  from_: parseAsIsoDate,
  to: parseAsIsoDate,
}

export const serializeOrdersSearchParams = createSerializer(ordersSearchParams)

export const loadSearchParams = createLoader(ordersSearchParams)
