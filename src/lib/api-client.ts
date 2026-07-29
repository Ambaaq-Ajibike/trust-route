import { environment } from "@/config/environment";
import { readStoredSession } from "@/lib/auth-session";
import { decryptPayloadLocally, encryptPayloadLocally } from "@/lib/payload-crypto";

export type ApiEnvelope<T> = {
  success?: boolean;
  data?: T | null;
  message?: string;
  statusCode?: number | string;
};

function normalizeResponseKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeResponseKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key.charAt(0).toLowerCase() + key.slice(1),
        normalizeResponseKeys(item),
      ]),
    );
  }
  return value;
}
function normalizeEnvelope<T>(value: unknown): ApiEnvelope<T> {
  const record = (value ?? {}) as Record<string, unknown>;
  return {
    success: (record.success ?? record.Success) as boolean | undefined,
    data: (record.data ?? record.Data) as T | null | undefined,
    message: (record.message ?? record.Message) as string | undefined,
    statusCode: (record.statusCode ?? record.StatusCode) as number | string | undefined,
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
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
    const envelope = normalizeEnvelope<unknown>(body);
    throw new ApiError(
      envelope?.message || response.statusText || "Request failed",
      response.status,
      body,
    );
  }
  return body as T;
}

export function encryptPayload(payload: unknown): Promise<string> {
  return encryptPayloadLocally(payload);
}

export async function decryptPayload<T>(encrypted: string): Promise<T> {
  return normalizeResponseKeys(await decryptPayloadLocally<unknown>(encrypted)) as T;
}
export async function encryptedApiRequest<T>(path: string, payload: unknown): Promise<T> {
  const data = await encryptPayload(payload);
  let rawResponse: unknown;
  try {
    rawResponse = await apiRequest<unknown>(path, {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  } catch (error) {
    if (error instanceof ApiError && typeof error.body === "string") {
      const decrypted = normalizeEnvelope<unknown>(
        await decryptPayload<unknown>(error.body),
      );
      throw new ApiError(
        decrypted.message || error.message,
        Number(decrypted.statusCode) || error.status,
        decrypted,
      );
    }
    throw error;
  }

  const envelope = normalizeEnvelope<T>(
    typeof rawResponse === "string"
      ? await decryptPayload<unknown>(rawResponse)
      : rawResponse,
  );
  if (envelope.success === false || envelope.data == null) {
    throw new ApiError(envelope.message || "The request was not successful.", Number(envelope.statusCode) || 400);
  }
  return envelope.data;
}
