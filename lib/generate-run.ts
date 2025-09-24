"use server";

import type { CreateRunRequest } from "@/types/order";

export async function generateRun({
  apiKey,
  ...payload
}: CreateRunRequest): Promise<void> {
  const url = "https://vrs.baato.io/api/v1/run/generate";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Token": apiKey,
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const data = await res.json();
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
  return data;
}
