"use server"

import type { CreateRunRequest } from "@/types/order"
import type { Run, RunListResponse } from "@/types/vrs"

export async function generateRun({
  apiKey,
  ...payload
}: CreateRunRequest): Promise<void> {
  const url = "https://route360.au/api/v1/run/generate"
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Token": apiKey,
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  // if (!res.ok) {
  //   let msg = "";
  //   try {
  //     const body = await res.json();
  //     console.log("Error body:", body);
  //     msg = body?.detail || body?.message || JSON.stringify(body);
  //   } catch {
  //     console.log("Error body:");
  //   }
  //   const err: any = new Error(
  //     msg || `Request failed with status: ${res.status}`,
  //   );
  //   err.status = res.status;
  //   if (msg) err.body = msg;
  //   throw err;
  // }

  // Endpoint may return a body; callers currently ignore it and expect void
  return data
}

export async function getRuns(apiKey: string): Promise<Run[]> {
  const res = await fetch("https://route360.au/api/v1/run/run-list", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Token": apiKey,
    },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch runs, status: ${res.status}`)
  }
  const { data } = (await res.json()) as RunListResponse
  return data
}
