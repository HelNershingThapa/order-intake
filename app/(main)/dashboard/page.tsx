import { getDailyStats, getStatsOverview } from "@/app/actions"
import { SectionCards } from "./components/section-cards"
import { DailyStatsAreaChart } from "./components/daily-stats-area-chart"
import { DateRangeSelector } from "./components/date-range-selector"
import { format } from "date-fns"
import { dateRanges } from "./components/config"

export default async function VendorDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ from: string; to: string }>
}) {
  const { from, to } = (await searchParams) || {}

  const range = {
    fromDate: (() => {
      if (from === "all") {
        return undefined
      }
      if (from) {
        return format(new Date(from), "yyyy-MM-dd")
      }
      return dateRanges["7D"].from
    })(),
    toDate: to ? format(new Date(to), "yyyy-MM-dd") : dateRanges["7D"].to,
  }
  const [statsOverview] = await Promise.all([
    getStatsOverview(range),
    // getDailyStats(),
  ])

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <DateRangeSelector />
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards
          statsOverview={statsOverview}
          // statsSummary={statsSummary}
        />
        {/* <DailyStatsAreaChart dailyStats={dailyStats} /> */}
      </div>
    </div>
  )
}
