import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { refreshToken } from "../../../lib/api-client";
import { serverApiClient } from "../../../lib/serverApiClient";

export async function POST() {
  const cookieStore = await cookies();
  const currentRefreshToken = cookieStore.get("refresh_token")?.value;

  if (!currentRefreshToken) {
    return NextResponse.json({ accessToken: null }, { status: 401 });
  }

  const { response, data: credentials } = await refreshToken({
    client: serverApiClient,
    body: { refreshToken: currentRefreshToken },
    throwOnError: false,
  });
  if (!response?.ok || !credentials) {
    return NextResponse.json({ accessToken: null }, { status: 401 });
  }

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
