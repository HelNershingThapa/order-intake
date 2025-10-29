import { cookies } from "next/headers";
import { decodeJwt, jwtVerify,SignJWT } from "jose";

import type { LoginResponse } from "@/types/miscellaneous";

import "server-only";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(loginRes: LoginResponse) {
  const claims = decodeJwt(loginRes.access_token);
  const session = await encrypt({ ...loginRes, expiresAt: claims.exp! });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: claims.exp! * 1000,
    sameSite: "lax",
    path: "/",
  });
}

export async function encrypt(payload: LoginResponse & { expiresAt: number }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
