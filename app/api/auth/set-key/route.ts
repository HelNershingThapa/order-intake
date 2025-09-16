import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { apiKey, maxAgeDays = 30 } = await req.json();
  if (!apiKey)
    return NextResponse.json({ error: "apiKey required" }, { status: 400 });

  (await cookies()).set({
    name: "api_key",
    value: apiKey,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeDays * 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ ok: true });
}
