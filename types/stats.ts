type ISODateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

interface StatsRange {
  from: ISODateString;
  to: ISODateString;
}

interface StatsTotals {
  orders: number;
  ready: number;
  needs_address: number;
  geocoded_pct: number;
  total_weight_kg: number;
}

export interface StatsOverview {
  range: StatsRange;
  totals: StatsTotals;
  today: StatsTotals;
}

interface StatsDailyItem {
  date: ISODateString;
  created: number;
  ready: number;
}

export interface StatsDaily {
  items: StatsDailyItem[];
}

export interface StatsSummary {
  total_orders: number;
  ready: number;
  needs_geocode: number;
  error: number;
  total_weight: number;
}
