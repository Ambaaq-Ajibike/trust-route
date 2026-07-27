import { environment } from "@/config/environment";
import { readStoredSession } from "@/lib/auth-session";

export type ApiEnvelope<T> = {
  success?: boolean;
  data?: T | null;
  message?: string;
  statusCode?: number | string;
};

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = readStoredSession();
  const response = await fetch(`${environment.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  let body: unknown = undefined;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }
  if (!response.ok) {
    const envelope = body as ApiEnvelope<unknown> | undefined;
    throw new ApiError(envelope?.message || response.statusText || "Request failed", response.status);
  }
  return body as T;
}

export async function encryptPayload(payload: unknown): Promise<string> {
  const result = await apiRequest<unknown>("/Encryption/encrypt", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (typeof result === "string") return result;
  const candidate = result as { data?: unknown };
  if (typeof candidate?.data === "string") return candidate.data;
  throw new ApiError("The API did not return an encrypted payload.", 502);
}

export async function decryptPayload<T>(encrypted: string): Promise<T> {
  return apiRequest<T>("/Encryption/decrypt", {
    method: "POST",
    body: JSON.stringify(encrypted),
  });
}

export async function encryptedApiRequest<T>(path: string, payload: unknown): Promise<T> {
  const data = await encryptPayload(payload);
  const envelope = await apiRequest<ApiEnvelope<T>>(path, {
    method: "POST",
    body: JSON.stringify({ data }),
  });
  if (envelope.success === false || envelope.data == null) {
    throw new ApiError(envelope.message || "The request was not successful.", Number(envelope.statusCode) || 400);
  }
  return envelope.data;
}
