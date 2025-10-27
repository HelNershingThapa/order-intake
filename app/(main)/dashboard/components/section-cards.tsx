import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { StatsOverview } from "@/types/stats"

type SectionCardsProps = {
  statsOverview: StatsOverview
}

export function SectionCards({ statsOverview }: SectionCardsProps) {
  const totalOrders = statsOverview.totals.orders ?? 0
  const confirmedOrderCount =
    statsOverview.totals.by_status.order_confirmed ?? 0
  const totalWeight = statsOverview.totals.total_weight_kg ?? 0

  // Calculate orders needing geocoding (pending geocode status)
  // This would need to be added to the stats if tracking geocode status
  const needsGeocode = 0 // Placeholder - would need backend support

  const readyPct =
    totalOrders > 0 ? Math.round((confirmedOrderCount / totalOrders) * 100) : 0

  // Calculate geocoding percentage (placeholder - would need backend support)
  const geocodedPct = 0
  const geocodedTodayPct = 0

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Orders */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOrders}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {readyPct >= 50 ? <IconTrendingUp /> : <IconTrendingDown />}
              Ready {readyPct}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {readyPct >= 50 ? "Good throughput" : "Throughput needs attention"}
            {readyPct >= 50 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Across current range {statsOverview.range.from} →{" "}
            {statsOverview.range.to}
          </div>
        </CardFooter>
      </Card>

      {/* Ready Orders */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Confirmed Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {confirmedOrderCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {(statsOverview.today?.by_status.ready_for_delivery ?? 0) > 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              Today {statsOverview.today.by_status.ready_for_delivery ?? 0}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(statsOverview.today.by_status.ready_for_delivery ?? 0) > 0
              ? "Processing ongoing"
              : "No ready orders today"}
            {(statsOverview.today.by_status.ready_for_delivery ?? 0) > 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Ready vs total: {readyPct}%
          </div>
        </CardFooter>
      </Card>

      {/* Needs Geocoding */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Needs Geocoding</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {needsGeocode.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {needsGeocode > 0 ? <IconTrendingDown /> : <IconTrendingUp />}
              {needsGeocode > 0 ? "Outstanding" : "All set"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {needsGeocode > 0 ? "Addresses pending" : "Fully geocoded"}
            {needsGeocode > 0 ? (
              <IconTrendingDown className="size-4" />
            ) : (
              <IconTrendingUp className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">From summary snapshot</div>
        </CardFooter>
      </Card>

      {/* Geocoding Coverage */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Geocoding Coverage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {geocodedPct}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {geocodedTodayPct >= geocodedPct ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              Today {geocodedTodayPct}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {geocodedTodayPct >= geocodedPct
              ? "Improving coverage"
              : "Coverage down today"}
            {geocodedTodayPct >= geocodedPct ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Total weight: {totalWeight.toLocaleString()} kg
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
