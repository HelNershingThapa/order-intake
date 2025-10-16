import AppBarChart from "@/components/AppBarChart"
import CardList from "@/components/CardList"
import AppPieChart from "@/components/AppPieChart"
import TodoList from "@/components/TodoList"
import AppAreaChart from "@/components/AppAreaChart"
import { getDailyStats, getStatsOverview, getStatsSummary } from "@/app/actions"
import { SectionCards } from "./components/section-cards"
import { DailyStatsAreaChart } from "./components/daily-stats-area-chart"

export default async function VendorDashboardPage() {
  const [statsOverview, dailyStats, statsSummary] = await Promise.all([
    getStatsOverview(),
    getDailyStats(),
    getStatsSummary(),
  ])

  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            statsOverview={statsOverview}
            statsSummary={statsSummary}
          />
          <DailyStatsAreaChart dailyStats={dailyStats} />
        </div>
      </div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        <div className="bg- bg-primary-foreground p-4 rounded-lg lg:col-span-2 ">
          <AppBarChart />
        </div>
        <div className="bg- bg-primary-foreground p-4 rounded-lg">
          <CardList title="Latest Transactions" />
        </div>
        <div className="bg- bg-primary-foreground p-4 rounded-lg">
          <AppPieChart />
        </div>
        <div className="bg- bg-primary-foreground p-4 rounded-lg">
          <TodoList />
        </div>
        <div className="bg- bg-primary-foreground p-4 rounded-lg lg:col-span-2">
          <AppAreaChart />
        </div>
        <div className="bg- bg-primary-foreground p-4 rounded-lg">
          <CardList title="Popular Content" />
        </div>
      </div> */}
    </>
  )
}
