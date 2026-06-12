import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete("refresh_token");
  cookieStore.delete("access_token");
  return new NextResponse(null, { status: 204 });
}
