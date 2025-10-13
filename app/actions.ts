"use server";

import { VendorFormData } from "@/components/admin/VendorFormClient";
import { serverFetch } from "@/lib/serverFetch";
import type { CurrentUser } from "@/types/miscellaneous";
import type { StatsOverview, StatsSummary, StatsDaily } from "@/types/stats";

export const getStatsOverview = async () => {
  const res = await fetch(`${process.env.API_BASE_URL}/stats/overview`);
  return (await res.json()) as Promise<StatsOverview>;
};

export const getDailyStats = async () => {
  const res = await fetch(`${process.env.API_BASE_URL}/stats/daily`);
  return (await res.json()) as Promise<StatsDaily>;
};

export const getStatsSummary = async () => {
  const res = await fetch(`${process.env.API_BASE_URL}/stats/summary`);
  return (await res.json()) as Promise<StatsSummary>;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  return serverFetch<CurrentUser>(`/auth/me`);
}

export async function createVendor(
  data: VendorFormData,
): Promise<VendorFormData> {
  return serverFetch<VendorFormData>(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}
