"use server";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function serverFetch<T = any>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const apiKey = (await cookies()).get("api_key")?.value ?? "";
  const url = `${API_BASE.replace(/\/$/, "")}${
    path.startsWith("/") ? path : `/${path}`
  }`;

  const res = await fetch(url, {
    method: init?.method ?? "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(apiKey ? { "X-API-Key": apiKey } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    body: init?.body as any,
  });

  if (!res.ok) {
    const msg = await safeMsg(res);
    const err = new Error(
      msg || `Request failed with status: ${res.status}`
    ) as any;
    err.status = res.status;
    err.body = msg;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

async function safeMsg(res: Response) {
  try {
    const body = await res.json();
    return body?.detail || body?.message || JSON.stringify(body);
  } catch {
    return "";
  }
}
