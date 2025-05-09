"use client";

import { useEffect, useState } from "react";

type ApiTokenProps = {
  email: string;
};

export default function GetApiToken({ email }: ApiTokenProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch(
          `http://localhost:3213/api/apitoken?email=${encodeURIComponent(
            email
          )}`
        );
        if (!res.ok) {
          setError("Failed to fetch token");
          return;
        }

        const data = await res.json();
        setToken(data.apiToken);
      } catch (err) {
        setError("Error contacting API");
        console.error(err);
      }
    }

    fetchToken();
  }, [email]);

  return <>{token}</>;
}
