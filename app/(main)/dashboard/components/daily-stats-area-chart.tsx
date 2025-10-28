"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
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

export const description = "Daily orders area chart"

const chartConfig = {
  created: {
    label: "Created",
    color: "var(--chart-2)",
  },
  ready: {
    label: "Ready",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type Props = {
  dailyStats: StatsDaily
}

export function DailyStatsAreaChart({ dailyStats }: Props) {
  const isMobile = useIsMobile()
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
          <AreaChart data={items}>
            <defs>
              <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-created)"
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-created)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillReady" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ready)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ready)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <YAxis />
            <Area
              dataKey="by_status.order_placed"
              type="natural"
              fill="url(#fillCreated)"
              stroke="var(--color-created)"
            />
            <Area
              dataKey="by_status.order_confirmed"
              type="natural"
              fill="url(#fillReady)"
              stroke="var(--color-ready)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
