export type BackendMode = "mock" | "remote";

export const environment = {
  backendMode: "remote" as BackendMode,
  apiBaseUrl: "https://trustroute-api-latest.onrender.com/api",
  realtimeUrl: "wss://trustroute-api-latest.onrender.com/realtime",
  encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? "",
  encryptionIv: process.env.NEXT_PUBLIC_ENCRYPTION_IV ?? "",
} as const;
