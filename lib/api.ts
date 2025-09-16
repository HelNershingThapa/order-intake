/** Client-side fetch (only when necessary). Prefer serverFetch on the server. */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const url = path.startsWith("http")
    ? path
    : `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const method = (options.method ?? "GET").toString().toUpperCase();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  // Do NOT read localStorage. Cookies (httpOnly) are used by the server. If you must call from client,
  // rely on backend sessions or expose a minimal route handler that proxies with cookies.
  if (method !== "GET" && method !== "HEAD")
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";

  const res = await fetch(url, { ...options, headers, credentials: "include" });
  if (!res.ok) {
    let body: any = undefined;
    try {
      body = await res.json();
    } catch {}
    const err = new Error(
      body?.detail || body?.message || `Request failed: ${res.status}`
    ) as Error & { status?: number; body?: any };
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return (await res.json()) as T;
}
