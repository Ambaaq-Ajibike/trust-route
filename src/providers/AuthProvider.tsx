"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthSession } from "@/lib/auth-session";
import { clearStoredSession, readStoredSession, writeStoredSession } from "@/lib/auth-session";

type AuthContextValue = {
  session: AuthSession | null;
  isHydrating: boolean;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    // Synchronize the client-only localStorage session after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(readStoredSession());
    setIsHydrating(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isHydrating,
      signIn: (next) => {
        writeStoredSession(next);
        setSession(next);
      },
      signOut: () => {
        clearStoredSession();
        setSession(null);
      },
    }),
    [isHydrating, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
