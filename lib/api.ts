export const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export interface User {
  id: number;
  displayName: string;
}

export class ApiClient {
  private readonly getAccessToken: () => Promise<string>;

  constructor(options: { auth: () => Promise<string> }) {
    this.getAccessToken = options.auth;
  }

  async getCurrentUser({ signal }: { signal?: AbortSignal }): Promise<User> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/users/me`,
      {
        signal,
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return res.json();
  }
}
