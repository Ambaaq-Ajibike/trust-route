import type { Role } from "@/config/permissions";

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  permissions: string[];
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: SessionUser;
};

const key = "trustroute.web.session";

export function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

export function writeStoredSession(session: AuthSession) {
  window.localStorage.setItem(key, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(key);
}
