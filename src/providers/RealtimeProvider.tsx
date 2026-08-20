"use client";

import { createContext, useContext, useMemo } from "react";
import type { RealtimeClient } from "@/lib/realtime-client";

const liveRealtimeClient: RealtimeClient = {
  async connect() {},
  async disconnect() {},
  subscribe(_topic, _handler) {
    return () => {};
  },
};

const RealtimeContext = createContext<RealtimeClient | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => liveRealtimeClient, []);
  return <RealtimeContext.Provider value={client}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within RealtimeProvider");
  }
  return context;
}
