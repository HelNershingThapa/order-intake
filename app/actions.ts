"use server"

import { serverFetch } from "@/lib/serverFetch"
import type { CurrentUser } from "@/types/miscellaneous"
import type { StatsOverview, StatsDaily } from "@/types/stats"

export const getStatsOverview = async (range: {
  fromDate?: string
  toDate?: string
}) => {
  const params = new URLSearchParams()
  if (range.fromDate) {
    params.append("from_", range.fromDate)
  }
  if (range.toDate) {
    params.append("to", range.toDate)
  }
  const res = await serverFetch(`/stats/overview?${params.toString()}`, {
    next: {
      tags: ["stats-overview", range.fromDate, range.toDate].filter(
        (t): t is string => typeof t === "string"
      ),
    },
  })
  return res as Promise<StatsOverview>
}

export const getDailyStats = async (range: {
  fromDate?: string
  toDate?: string
}) => {
  const params = new URLSearchParams()
  if (range.fromDate) {
    params.append("from_", range.fromDate)
  }
  if (range.toDate) {
    params.append("to", range.toDate)
  }
  const res = await serverFetch(`/stats/daily?${params.toString()}`, {
    next: {
      tags: ["daily-stats", range.fromDate, range.toDate].filter(
        (t): t is string => typeof t === "string"
      ),
    },
  })
  return res as Promise<StatsDaily>
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return serverFetch<CurrentUser>(`/auth/me`)
}
