"use server";

import { VendorFormData } from "@/components/admin/vendor-form";
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

type VendorCreationResponse = {
  message: string;
  vendor_id: string;
  user_id: string;
};

export async function createVendor(
  data: VendorFormData,
): Promise<VendorCreationResponse> {
  return serverFetch<VendorCreationResponse>(
    "/admin/create-vendor",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}
