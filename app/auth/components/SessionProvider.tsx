"use client";

import { decode as decodeJwt } from "jsonwebtoken";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Client, createClient } from "../../../lib/api-client/client";
import { apiUrl } from "../../../lib/config";

interface SessionProviderContextValue {
  isLoggedIn: boolean;
  userId?: number;
  getAccessToken: () => Promise<string>;
  logout: () => Promise<void>;
  client: Client;
  publicClient: Client;
}

const SessionProviderContext = createContext<
  SessionProviderContextValue | undefined
>(undefined);

export function useSession() {
  const value = useContext(SessionProviderContext);
  if (!value) {
    throw new Error("useSession needs a SessionProvider");
  }
  return value;
}

export default function SessionProvider({
  children,
  initialAccessToken,
}: {
  children: ReactNode;
  initialAccessToken?: string;
}) {
  const [accessToken, setAccessToken] = useState(initialAccessToken);
  const lastAccessToken = useRef(accessToken);
  if (accessToken !== lastAccessToken.current) {
    lastAccessToken.current = accessToken;
  }
  const userId = useMemo(() => {
    if (accessToken) {
      return JSON.parse(atob(accessToken.split(".")[1])).sub;
    }
    return undefined;
  }, [accessToken]);

  const refreshPromise = useRef<Promise<string> | null>(null);

  const refreshToken = useCallback(async (): Promise<string> => {
    if (refreshPromise.current) {
      // do not start a new refresh if one is already in progress
      return refreshPromise.current;
    }

    refreshPromise.current = (async () => {
      try {
        const res = await fetch("/auth/refresh", { method: "POST" });

        if (!res.ok) {
          setAccessToken(undefined);
          throw new Error(`Token refresh failed (${res.status})`);
        }

        const { accessToken: newAccessToken }: { accessToken: string } =
          await res.json();

        setAccessToken(newAccessToken);
        return newAccessToken;
      } finally {
        // clear the promise so that a new refresh can be started next time
        refreshPromise.current = null;
      }
    })();

    return refreshPromise.current;
  }, []);

  const logout = useCallback(async () => {
    const res = await fetch("/auth/logout", { method: "POST" });
    if (!res.ok) {
      throw new Error(`Logout failed (${res.status})`);
    }
    setAccessToken(undefined);
  }, []);

  const getAccessToken = useCallback(async () => {
    let token = validateJwt(lastAccessToken.current);
    if (!token) {
      token = await refreshToken();
    }
    return token;
  }, [refreshToken]);

  const getOptionalAccessToken = useCallback(async () => {
    if (!lastAccessToken.current) {
      return undefined;
    }
    let token = validateJwt(lastAccessToken.current);
    if (!token) {
      token = await refreshToken().catch(() => null);
    }
    return token;
  }, [refreshToken]);

  const isLoggedIn = !!accessToken;
  const context = useMemo(() => {
    return {
      isLoggedIn,
      userId,
      getAccessToken,
      logout,
      client: createClient({
        auth: getAccessToken,
        baseUrl: apiUrl,
      }),
      publicClient: createClient({
        auth: getOptionalAccessToken,
        baseUrl: apiUrl,
      }),
    };
  }, [isLoggedIn, userId, getAccessToken, getOptionalAccessToken, logout]);

  return (
    <SessionProviderContext value={context}>{children}</SessionProviderContext>
  );
}

function validateJwt(token: string | null | undefined): string | null {
  try {
    if (!token) {
      return null;
    }
    const decoded = decodeJwt(token);
    if (!decoded || typeof decoded !== "object") {
      return null;
    }
    // force token refresh if it expires in under a minute
    if ((decoded.exp ?? 0) < Date.now() / 1000 + 60) {
      return null;
    }
    return token;
  } catch {
    return null;
  }
}
