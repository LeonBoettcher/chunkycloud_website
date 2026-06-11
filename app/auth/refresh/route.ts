import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "../../../lib/api";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ accessToken: null }, { status: 401 });
  }

  const res = await fetch(`${apiUrl}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    return NextResponse.json({ accessToken: null }, { status: 401 });
  }

  const credentials = await res.json();
  cookieStore.set("refresh_token", credentials.refreshToken.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(credentials.refreshToken.expiresAt),
  });
  cookieStore.set("access_token", credentials.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return NextResponse.json({
    accessToken: credentials.accessToken,
  });
}
