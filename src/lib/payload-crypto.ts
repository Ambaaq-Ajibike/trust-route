import { environment } from "@/config/environment";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function importAesKey(): Promise<CryptoKey> {
  const key = encoder.encode(environment.encryptionKey);
  const iv = encoder.encode(environment.encryptionIv);
  if (![16, 24, 32].includes(key.byteLength)) {
    throw new Error("NEXT_PUBLIC_ENCRYPTION_KEY must be 16, 24, or 32 UTF-8 bytes.");
  }
  if (iv.byteLength !== 16) {
    throw new Error("NEXT_PUBLIC_ENCRYPTION_IV must be 16 UTF-8 bytes.");
  }
  return crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);
}

function encryptionIv(): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(encoder.encode(environment.encryptionIv));
}

function toBase64(value: ArrayBuffer): string {
  const bytes = new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function sanitizeBase64(input: string): string {
  let cleaned = input.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  if (cleaned.includes("%")) {
    try {
      cleaned = decodeURIComponent(cleaned);
    } catch {
      // Ignore decoding failure
    }
  }
  // Replace spaces with + (fix HTTP form/URL body space conversion)
  cleaned = cleaned.replace(/ /g, "+");
  // Remove whitespace and newlines
  cleaned = cleaned.replace(/[\s\r\n]+/g, "");

  // Fix missing padding
  const remainder = cleaned.length % 4;
  if (remainder === 2) {
    cleaned += "==";
  } else if (remainder === 3) {
    cleaned += "=";
  }
  return cleaned;
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const sanitized = sanitizeBase64(value);
  const binary = atob(sanitized);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export async function encryptPayloadLocally(payload: unknown): Promise<string> {
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: encryptionIv() },
    await importAesKey(),
    encoder.encode(JSON.stringify(payload)),
  );
  return toBase64(encrypted);
}

export async function decryptPayloadLocally<T>(cipherText: string): Promise<T> {
  if (typeof cipherText !== "string") {
    return cipherText as T;
  }

  const trimmed = cipherText.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed) as T;
    } catch {
      // Not raw JSON, proceed to AES decrypt
    }
  }

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: encryptionIv() },
      await importAesKey(),
      fromBase64(trimmed),
    );
    const text = decoder.decode(decrypted);
    return JSON.parse(text) as T;
  } catch (primaryError) {
    // Fallback: If payload was already unencrypted or double-stringified
    try {
      return JSON.parse(trimmed) as T;
    } catch {
      throw primaryError;
    }
  }
}