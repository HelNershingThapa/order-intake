// Bulk import shared constants & types
import { type CsvRow } from '@/utils/csv-parser'

export const steps = [
  { title: 'Upload File', value: 'upload' },
  { title: 'Map Header Columns', value: 'map' },
  { title: 'Fix Geocoding Errors', value: 'errors' },
  { title: 'Review Locations', value: 'review' },
] as const

export const requiredKeys = [
  'recipient_name',
  'recipient_phone',
  'delivery_address_text',
  'parcel_weight',
  'reference_id',
  'cod_amount',
] as const

export const optionalKeys = [
  'municipality',
  'ward',
  'tole',
  'landmark',
  'lat',
  'lng',
  'dimensions',
] as const

export type CanonicalKey =
  | (typeof requiredKeys)[number]
  | (typeof optionalKeys)[number]

export type GeocodeStatus = 'pending' | 'success' | 'failed'

export interface GeocodedRow {
  id: number
  original: CsvRow
  mapped: Record<string, any>
  lat: number | null
  lng: number | null
  status: GeocodeStatus
  error?: string
}

export const createEmptyMapping = (): Record<CanonicalKey, string> => ({
  recipient_name: '',
  recipient_phone: '',
  delivery_address_text: '',
  parcel_weight: '',
  reference_id: '',
  municipality: '',
  ward: '',
  tole: '',
  landmark: '',
  lat: '',
  lng: '',
  dimensions: '',
  cod_amount: '',
})
