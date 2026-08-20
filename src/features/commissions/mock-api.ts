import { mockDelay } from "@/lib/mock-delay";
import type { CommissionItem, CommissionPage, CommissionQuery } from "./types";

const mockCommissions: CommissionItem[] = [
  {
    id: "COM-101",
    deliveryId: "DLV-8842",
    orderAmount: 4500,
    commissionFee: 675,
    riderEarnings: 3825,
    ratePercent: 15,
    createdOn: "2026-08-19T21:40:00Z",
  },
];

export const commissionsMockApi = {
  async list(query: CommissionQuery): Promise<CommissionPage> {
    await mockDelay(250);
    const start = (query.page - 1) * query.pageSize;
    return {
      items: mockCommissions.slice(start, start + query.pageSize),
      totalCount: mockCommissions.length,
      pageNumber: query.page,
      pageSize: query.pageSize,
    };
  },
};
