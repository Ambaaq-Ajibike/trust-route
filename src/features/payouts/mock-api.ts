import { mockDelay } from "@/lib/mock-delay";
import type { PayoutItem, PayoutPage, PayoutQuery } from "./types";

const mockPayouts: PayoutItem[] = [
  {
    id: "PAY-9901",
    riderName: "Tunde Bakare",
    bankName: "GTBank",
    accountNumber: "0123456789",
    amount: 35000,
    status: "Pending",
    requestedAt: "2026-08-19T14:30:00Z",
  },
];

export const payoutsMockApi = {
  async list(query: PayoutQuery): Promise<PayoutPage> {
    await mockDelay(250);
    const start = (query.page - 1) * query.pageSize;
    return {
      items: mockPayouts.slice(start, start + query.pageSize),
      totalCount: mockPayouts.length,
      pageNumber: query.page,
      pageSize: query.pageSize,
    };
  },
  async decidePayout(payoutId: string, status: "Approved" | "Rejected"): Promise<boolean> {
    await mockDelay(200);
    return true;
  },
};
