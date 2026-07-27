export type BackendMode = "mock" | "remote";

export const environment = {
  backendMode: "remote" as BackendMode,
  apiBaseUrl: "https://trustroute-api-latest.onrender.com/api",
  realtimeUrl: "wss://trustroute-api-latest.onrender.com/realtime",
} as const;
