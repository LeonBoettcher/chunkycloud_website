import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { apiUrl } from "../../../lib/api";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");

  if (!state) {
    return NextResponse.json(
      { error: "Missing state parameter" },
      { status: 400 },
    );
  }
  if (!code) {
    return NextResponse.json(
      { error: "Missing state parameter" },
      { status: 400 },
    );
  }

  // Get the nonce cookie
  const cookieStore = await cookies();
  const nonceCookie = cookieStore.get("auth_nonce")?.value;

  if (!nonceCookie) {
    return NextResponse.json(
      { error: "Missing nonce cookie" },
      { status: 400 },
    );
  }

  // Compare nonce cookie with decoded state nonce
  if (state !== nonceCookie) {
    return NextResponse.json({ error: "Nonce mismatch" }, { status: 403 });
  }

  // Clear the nonce cookie
  cookieStore.delete("auth_nonce");

  // TODO: Handle successful authentication, i.e. get credentials from code
  const credentials = await fetch(`${apiUrl}/auth/exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  }).then((res) => {
    if (!res.ok) {
      return NextResponse.json(
        { error: "Token exchange failed" },
        { status: 500 },
      );
    }
    return res.json();
  });

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

  redirect("/");
}
