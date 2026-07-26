export type RealtimeEvent = {
  topic: string;
  payload: Record<string, unknown>;
};

export interface RealtimeClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(topic: string, handler: (event: RealtimeEvent) => void): () => void;
}
