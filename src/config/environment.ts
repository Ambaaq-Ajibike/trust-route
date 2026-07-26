export const environment = {
  backendMode: "mock",
  apiBaseUrl: "https://api.example.com",
  realtimeUrl: "wss://api.example.com/realtime",
} as const;

export type BackendMode = (typeof environment)["backendMode"];
