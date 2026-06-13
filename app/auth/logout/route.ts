import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { revokeRefreshToken } from "../../../lib/api-client";
import { serverApiClient } from "../../../lib/serverApiClient";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (refreshToken) {
    await revokeRefreshToken({
      client: serverApiClient,
      body: { refreshToken },
    }).catch((e) => {
      console.error("A refresh token could not be revoked for logout", e);
    });
  }
  cookieStore.delete("refresh_token");
  cookieStore.delete("access_token");
  return new NextResponse(null, { status: 204 });
}
