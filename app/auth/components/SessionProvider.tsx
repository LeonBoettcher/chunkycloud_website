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
import { ApiClient } from "../../../lib/api";

interface SessionProviderContextValue {
  isLoggedIn: boolean;
  getAccessToken: () => Promise<string>;
  logout: () => Promise<void>;
  apiClient: ApiClient;
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

  const refreshToken = useCallback(async () => {
    const res = await fetch("/auth/refresh", { method: "POST" });
    if (res.ok) {
      const { accessToken: newAccessToken }: { accessToken: string } =
        await res.json();
      setAccessToken(newAccessToken);
      return newAccessToken;
    }
    setAccessToken(undefined);
    throw new Error(`Token refresh failed (${res.status})`);
  }, []);

  const logout = useCallback(async () => {
    const res = await fetch("/auth/logout", { method: "POST" });
    if (!res.ok) {
      throw new Error(`Logout failed (${res.status})`);
    }
    setAccessToken(undefined);
  }, []);

  const isLoggedIn = !!accessToken;
  const context = useMemo(() => {
    const getAccessToken = async () => {
      let token = validateJwt(lastAccessToken.current);
      if (!token) {
        token = await refreshToken();
      }
      return token;
    };
    return {
      isLoggedIn,
      getAccessToken,
      logout,
      apiClient: new ApiClient({ auth: getAccessToken }),
    };
  }, [isLoggedIn]);

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
    if (decoded.exp ?? 0 < Date.now() / 1000 + 60) {
      return null;
    }
    return token;
  } catch {
    return null;
  }
}
