import { mockDelay } from "@/lib/mock-delay";
import type { RefundItem, RefundPage, RefundQuery } from "./types";

const mockRefunds: RefundItem[] = [
  {
    id: "RFD-3301",
    deliveryId: "DLV-8805",
    customerName: "Chidimma Eze",
    amount: 2800,
    reason: "Order cancelled before rider assignment",
    status: "Pending",
    requestedAt: "2026-08-15T09:20:00Z",
  },
];

export const refundsMockApi = {
  async list(query: RefundQuery): Promise<RefundPage> {
    await mockDelay(250);
    const start = (query.page - 1) * query.pageSize;
    return {
      items: mockRefunds.slice(start, start + query.pageSize),
      totalCount: mockRefunds.length,
      pageNumber: query.page,
      pageSize: query.pageSize,
    };
  },
  async decideRefund(refundId: string): Promise<boolean> {
    await mockDelay(200);
    return true;
  },
};
