"use server";

import { cookies } from "next/headers";
import { schema, State } from "./stats";

export async function loginAction(
  prev: State,
  formData: FormData,
): Promise<State> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    apikey: formData.get("apikey"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ...prev,
      zodErrors: flat.fieldErrors, // { name?: string[], apikey?: string[] }
      backend_error: null,
      message: null,
      data: {
        name: (formData.get("name")?.toString() || "").trim(),
        apikey: "", // don't echo the key back
      },
    };
  }

  const { name, apikey } = parsed.data;

  try {
    const baseUrl = process.env.API_BASE_URL!;
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/vendor/me`, {
      method: "GET",
      headers: { "X-API-Key": apikey, Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      let body: any = null;
      try {
        body = await res.json();
      } catch {}
      const msg = body?.detail || body?.message || "Invalid API key";
      return {
        ...prev,
        zodErrors: null,
        backend_error: msg,
        message: null,
        data: { name, apikey: "" },
      };
    }
  } catch (e: any) {
    return {
      ...prev,
      zodErrors: null,
      backend_error: e?.message || "Failed to reach API",
      message: null,
      data: { name, apikey: "" },
    };
  }

  // success: set cookie
  (await cookies()).set({
    name: "api_key",
    value: apikey,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });

  return {
    zodErrors: null,
    backend_error: null,
    data: { name, apikey },
    message: "Logged in",
  };
}
