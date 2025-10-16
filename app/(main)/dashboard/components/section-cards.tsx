import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsOverview, StatsSummary } from "@/types/stats";

type SectionCardsProps = {
  statsOverview: StatsOverview;
  statsSummary: StatsSummary;
};

export function SectionCards({
  statsOverview,
  statsSummary,
}: SectionCardsProps) {
  const totalOrders = statsSummary.total_orders ?? 0;
  const readyOrders = statsSummary.ready ?? 0;
  const needsGeocode = statsSummary.needs_geocode ?? 0;
  const totalWeight = statsSummary.total_weight ?? 0;

  const readyPct =
    totalOrders > 0 ? Math.round((readyOrders / totalOrders) * 100) : 0;
  const geocodedPct =
    Math.round((statsOverview.totals?.geocoded_pct ?? 0) * 10) / 10;
  const geocodedTodayPct =
    Math.round((statsOverview.today?.geocoded_pct ?? 0) * 10) / 10;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Orders */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOrders.toLocaleString()}
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
          <CardDescription>Ready Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {readyOrders.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {(statsOverview.today?.ready ?? 0) > 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              Today {statsOverview.today.ready}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {statsOverview.today.ready > 0
              ? "Processing ongoing"
              : "No ready orders today"}
            {statsOverview.today.ready > 0 ? (
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
  );
}
