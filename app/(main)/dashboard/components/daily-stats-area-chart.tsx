"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { StatsDaily } from "@/types/stats"

const chartConfig = {
  total_orders: {
    label: "Placed",
    color: "var(--chart-4)",
  },
  confirmed: {
    label: "Confirmed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type Props = {
  dailyStats: StatsDaily
}

export function DailyStatsAreaChart({ dailyStats }: Props) {
  const items = dailyStats?.items ?? []

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Daily Orders</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Totals over the selected period
          </span>
          <span className="@[540px]/card:hidden">Selected period</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={items}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <YAxis />
            <Bar
              dataKey="total_orders"
              fill={`var(--color-total_orders)`}
              name="total_orders"
            />
            <Bar
              dataKey="by_status.order_confirmed"
              fill="var(--color-confirmed)"
              name="confirmed"
            />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
