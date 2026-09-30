"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "../../app/auth/components/SessionProvider";
import { getCurrentUser } from "../../lib/api-client";

import type { UserResponse } from "../../lib/api-client";

const LoginButton = () => {
  const { isLoggedIn, client } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setAvatarUrl(null);
      setCredits(null);
      return;
    }

    const ac = new AbortController();

    getCurrentUser({ client, signal: ac.signal })
      .then((user) => {
        const data = user.data as UserResponse;
        setAvatarUrl(data.avatarUrl ?? null);

        setCredits(
          data.credits != null ? parseInt(data.credits) / 100000 : null,
        );
      })

      .catch((error) => {
        if (ac.signal.aborted) return;
        console.error("Failed to load current user avatar", error);
      });

    return () => ac.abort();
  }, [client, isLoggedIn]);

  if (isLoggedIn) {
    return (
      <>
        {credits != null && (
          <div
            className="badge badge-neutral mr-5 hidden sm:inline-flex"
            title={`Equivalent to ~${credits / 2074} HD renders at 1000 spp with ray depth 3`}
          >
            {credits.toLocaleString()} Credits
          </div>
        )}
        <Link href="/account" className="btn btn-ghost btn-circle avatar mr-2">
          <div className="w-10 rounded-full overflow-hidden bg-gray-400">
            {avatarUrl && <img alt="Avatar" src={avatarUrl} />}
          </div>
        </Link>
      </>
    );
  }

  return (
    <a className="btn" href="/auth/init">
      Login
    </a>
  );
};

export default LoginButton;
