import { environment } from "@/config/environment";
import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
  type AuthSession,
} from "@/lib/auth-session";
import { decryptPayloadLocally, encryptPayloadLocally } from "@/lib/payload-crypto";

export type ApiEnvelope<T> = {
  success?: boolean;
  data?: T | null;
  message?: string;
  statusCode?: number | string;
};

type RefreshTokenResponse = {
  accessToken?: string;
  refreshToken?: string;
};

let refreshPromise: Promise<boolean> | null = null;

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

async function extractErrorMessage(
  body: unknown,
  fallbackMessage: string,
  status: number,
): Promise<string> {
  if (!body) {
    return status === 400
      ? "Invalid request payload or validation failed. Please check form entries."
      : fallbackMessage;
  }

  let targetStr: string | null = null;
  if (typeof body === "string") {
    targetStr = body.replace(/^"|"$/g, "").trim();
  } else if (typeof body === "object" && body !== null) {
    const rec = body as Record<string, unknown>;
    if (typeof rec.data === "string") targetStr = rec.data.replace(/^"|"$/g, "").trim();
    else if (typeof rec.Data === "string") targetStr = rec.Data.replace(/^"|"$/g, "").trim();
    else if (typeof rec.message === "string" && rec.message) return rec.message;
    else if (typeof rec.Message === "string" && rec.Message) return rec.Message;
    else if (rec.errors && typeof rec.errors === "object") {
      const errorList = Object.values(rec.errors as Record<string, string[] | string>).flat();
      if (errorList.length > 0) return errorList.join("; ");
    } else if (typeof rec.title === "string" && rec.title) {
      return rec.title;
    }
  }

  if (targetStr) {
    try {
      const decrypted = await decryptPayloadLocally<unknown>(targetStr);
      const envelope = normalizeEnvelope<unknown>(decrypted);
      if (envelope.message) return envelope.message;
      if (typeof decrypted === "string" && decrypted) return decrypted;
      if (typeof decrypted === "object" && decrypted !== null) {
        const dRec = decrypted as Record<string, unknown>;
        if (typeof dRec.message === "string" && dRec.message) return dRec.message;
        if (typeof dRec.Message === "string" && dRec.Message) return dRec.Message;
      }
    } catch {
      if (targetStr && !targetStr.startsWith("{") && !targetStr.startsWith("[")) {
        return targetStr;
      }
    }
  }

  if (status === 400) {
    return "Invalid request payload or validation failed. Please check form entries.";
  }

  return fallbackMessage;
}

async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const session = readStoredSession();
    if (!session?.refreshToken || !session?.accessToken) {
      clearStoredSession();
      return false;
    }

    try {
      const encryptedData = await encryptPayloadLocally({
        AccessToken: session.accessToken,
        RefreshToken: session.refreshToken,
      });

      const response = await fetch(`${environment.apiBaseUrl}/Auth/RefreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: encryptedData }),
      });

      if (!response.ok) {
        clearStoredSession();
        return false;
      }

      const rawText = await response.text();
      let parsed: unknown = rawText;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        // text
      }

      let cipherText: unknown = parsed;
      if (typeof parsed === "object" && parsed !== null) {
        const rec = parsed as Record<string, unknown>;
        cipherText = rec.data ?? rec.Data ?? parsed;
      }

      let decrypted: unknown = cipherText;
      if (typeof cipherText === "string") {
        decrypted = await decryptPayloadLocally<unknown>(cipherText);
      }

      const envelope = normalizeEnvelope<RefreshTokenResponse>(decrypted);
      const resData = (envelope.data ?? decrypted) as RefreshTokenResponse | null;

      if (resData?.accessToken) {
        const updatedSession: AuthSession = {
          ...session,
          accessToken: resData.accessToken,
          refreshToken: resData.refreshToken || session.refreshToken,
          expiresAt: Date.now() + 60 * 60 * 1000,
        };
        writeStoredSession(updatedSession);
        return true;
      }

      clearStoredSession();
      return false;
    } catch {
      clearStoredSession();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, isRetry = false): Promise<T> {
  const session = readStoredSession();
  const response = await fetch(`${environment.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (response.status === 401 && !isRetry && !path.includes("/Auth/RefreshToken")) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return apiRequest<T>(path, init, true);
    }
  }

  const text = await response.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();
    }
    const defaultMsg = response.statusText && response.statusText !== "Bad Request" ? response.statusText : "Request failed";
    const errorMessage = await extractErrorMessage(body, defaultMsg, response.status);
    throw new ApiError(errorMessage, response.status, body);
  }
  return body as T;
}

export function encryptPayload(payload: unknown): Promise<string> {
  return encryptPayloadLocally(payload);
}

export async function decryptPayload<T>(encrypted: string): Promise<T> {
  const decrypted = await decryptPayloadLocally<unknown>(encrypted);
  return normalizeResponseKeys(decrypted) as T;
}

export async function encryptedApiRequestWithEnvelope<T>(
  path: string,
  payload: unknown,
): Promise<{ success: boolean; data: T | null; message: string; statusCode: number }> {
  const data = await encryptPayload(payload);
  let rawResponse: unknown;
  try {
    rawResponse = await apiRequest<unknown>(path, {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const extractedMessage = await extractErrorMessage(error.body, error.message, error.status);
      throw new ApiError(extractedMessage, error.status, error.body);
    }
    throw error;
  }

  let targetPayload: unknown = rawResponse;
  if (typeof rawResponse === "object" && rawResponse !== null && !Array.isArray(rawResponse)) {
    const rec = rawResponse as Record<string, unknown>;
    if (typeof rec.data === "string") targetPayload = rec.data;
    else if (typeof rec.Data === "string") targetPayload = rec.Data;
    else if (typeof rec.result === "string") targetPayload = rec.result;
    else if (typeof rec.Result === "string") targetPayload = rec.Result;
  }

  let decryptedValue: unknown = targetPayload;
  if (typeof targetPayload === "string") {
    try {
      decryptedValue = await decryptPayload<unknown>(targetPayload);
    } catch {
      try {
        decryptedValue = JSON.parse(targetPayload);
      } catch {
        decryptedValue = targetPayload;
      }
    }
  }

  const envelope = normalizeEnvelope<T>(decryptedValue);
  const success = envelope.success !== false;
  const message = envelope.message || (success ? "Request was successful." : "Request failed.");
  const statusCode = Number(envelope.statusCode) || (success ? 200 : 400);

  if (!success) {
    throw new ApiError(message, statusCode, decryptedValue);
  }

  const normalizedData =
    envelope.data != null
      ? (normalizeResponseKeys(envelope.data) as T)
      : (normalizeResponseKeys(decryptedValue) as T);

  return {
    success: true,
    data: normalizedData,
    message,
    statusCode,
  };
}

export async function encryptedApiRequest<T>(path: string, payload: unknown): Promise<T> {
  const res = await encryptedApiRequestWithEnvelope<T>(path, payload);
  return res.data as T;
}
