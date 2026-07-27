import type { RealtimeClient, RealtimeEvent } from "@/lib/realtime-client";

export class MockRealtimeClient implements RealtimeClient {
  private handlers = new Map<string, Set<(event: RealtimeEvent) => void>>();

  async connect() {}
  async disconnect() {
    this.handlers.clear();
  }

  subscribe(topic: string, handler: (event: RealtimeEvent) => void) {
    const set = this.handlers.get(topic) ?? new Set();
    set.add(handler);
    this.handlers.set(topic, set);
    return () => {
      set.delete(handler);
    };
  }
}
