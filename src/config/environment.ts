export type BackendMode = "mock" | "remote";

export const environment = {
  backendMode: "remote" as BackendMode,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://trustroute-api-latest.onrender.com/api",
  realtimeUrl: process.env.NEXT_PUBLIC_REALTIME_URL ?? "wss://trustroute-api-latest.onrender.com/realtime",
  encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? "",
  encryptionIv: process.env.NEXT_PUBLIC_ENCRYPTION_IV ?? "",
} as const;

