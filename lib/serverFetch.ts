"use server"

import { cookies } from "next/headers"

import { decrypt } from "./session"

const API_BASE = process.env.API_BASE_URL!

export async function serverFetch<T = any>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const session = (await cookies()).get("session")?.value
  const payload = await decrypt(session)
  const url = `${API_BASE.replace(/\/$/, "")}${
    path.startsWith("/") ? path : `/${path}`
  }`

  const res = await fetch(url, {
    method: init?.method ?? "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${payload?.access_token}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    body: init?.body,
    next: init?.next,
  })

  if (!res.ok) {
    const msg = await safeMsg(res)
    const err = new Error(
      msg || `Request failed with status: ${res.status}`
    ) as any
    err.status = res.status
    err.body = msg
    throw err
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

async function safeMsg(res: Response) {
  try {
    const body = await res.json()
    return body?.detail || body?.message || JSON.stringify(body)
  } catch {
    return ""
  }
}
