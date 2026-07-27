"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthSession } from "@/lib/auth-session";
import { clearStoredSession, readStoredSession, writeStoredSession } from "@/lib/auth-session";

type AuthContextValue = {
  session: AuthSession | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(readStoredSession());
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      signIn: (next) => {
        writeStoredSession(next);
        setSession(next);
      },
      signOut: () => {
        clearStoredSession();
        setSession(null);
      },
    }),
    [session],
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
