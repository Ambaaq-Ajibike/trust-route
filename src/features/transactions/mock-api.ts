import { mockDelay } from "@/lib/mock-delay";
import type { TransactionItem, TransactionPage, TransactionQuery } from "./types";

const mockTransactions: TransactionItem[] = [
  {
    id: "TXN-8812",
    reference: "PAY-NGN-00129",
    userEmail: "olawale.adebayo@gmail.com",
    type: "Delivery Payment",
    amount: 4500,
    currency: "NGN",
    status: "Completed",
    gatewayReference: "pstk_8849102",
    createdOn: "2026-08-19T21:40:00Z",
  },
];

export const transactionsMockApi = {
  async list(query: TransactionQuery): Promise<TransactionPage> {
    await mockDelay(250);
    const start = (query.page - 1) * query.pageSize;
    return {
      items: mockTransactions.slice(start, start + query.pageSize),
      totalCount: mockTransactions.length,
      pageNumber: query.page,
      pageSize: query.pageSize,
    };
  },
  async getDetails(id: string): Promise<Record<string, unknown>> {
    await mockDelay(200);
    return { id, amount: 4500, status: "Completed" };
  },
};
