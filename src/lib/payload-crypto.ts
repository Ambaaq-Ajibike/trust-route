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

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
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
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: encryptionIv() },
    await importAesKey(),
    fromBase64(cipherText),
  );
  return JSON.parse(decoder.decode(decrypted)) as T;
}