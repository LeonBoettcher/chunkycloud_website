"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function GetApiToken() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: session, status } = useSession();
  useEffect(() => {
    async function fetchToken() {
      //check for activ sessiomn
      if (!session?.user?.email) return;

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/apitoken?email=${encodeURIComponent(session?.user?.email)}`
      );

      const data = await res.json();
      setToken(data.apiToken);
    }

    fetchToken();
  });

  return <>{token}</>;
}
