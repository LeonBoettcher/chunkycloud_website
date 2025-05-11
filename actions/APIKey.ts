"use server"

import { cookies } from 'next/headers'

export async function getAPIKey(): Promise<string | null> {
  return (await cookies()).get('api_key')?.value ?? null
}

export async function setAPIKeyCookie(key: string) {
  (await cookies()).set('api_key', key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 Tag
  })
}

export async function fetchAPIkey(email: string): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/apitoken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch API token");
    }

    const data = await response.json();

    setAPIKeyCookie(data.apiToken);

    return data.apiToken ?? null;
  } catch (error) {
    console.error("Error fetching API token:", error);
    return null;
  }
}
