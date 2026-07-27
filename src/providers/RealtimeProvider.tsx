"use client";

import { createContext, useContext, useMemo } from "react";
import { MockRealtimeClient } from "@/lib/mock-realtime-client";
import type { RealtimeClient } from "@/lib/realtime-client";

const RealtimeContext = createContext<RealtimeClient | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => new MockRealtimeClient(), []);
  return <RealtimeContext.Provider value={client}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within RealtimeProvider");
  }
  return context;
}
