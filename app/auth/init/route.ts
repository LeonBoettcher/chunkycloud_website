import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { apiUrl } from "../../../lib/config";

export async function GET(request: NextRequest) {
  // Generate a random nonce (this is used later to prevent csrf attacks where
  // the attacker would send their callback url to the victim to log them into
  // the attacker's account)
  const nonce = randomBytes(32).toString("hex");

  // Get cookies object
  const cookieStore = await cookies();

  // Set the nonce cookie with the specified options
  cookieStore.set("auth_nonce", nonce, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes in seconds
  });

  // Redirect to the Discord auth endpoint
  const redirectUrl = `${apiUrl}/auth/discord?returnTo=${apiUrl.includes("localhost") ? "localhost" : "website"}&state=${nonce}`;
  return NextResponse.redirect(redirectUrl);
}
