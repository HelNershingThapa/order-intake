import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("api_key");
  return NextResponse.json({ ok: true });
}
