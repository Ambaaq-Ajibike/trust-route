import { mockDelay } from "@/lib/mock-delay";
import type { DisputeItem, DisputePage, DisputeQuery } from "./types";

const mockDisputes: DisputeItem[] = [
  {
    id: "DSP-5510",
    deliveryId: "DLV-8842",
    raisedByName: "Olawale Adebayo",
    raisedByRole: "Customer",
    reason: "Package damaged during motorcycle transport",
    status: "Open",
    createdOn: "2026-08-19T14:10:00Z",
  },
];

export const disputesMockApi = {
  async list(query: DisputeQuery): Promise<DisputePage> {
    await mockDelay(250);
    const start = (query.page - 1) * query.pageSize;
    return {
      items: mockDisputes.slice(start, start + query.pageSize),
      totalCount: mockDisputes.length,
      pageNumber: query.page,
      pageSize: query.pageSize,
    };
  },
  async resolve(disputeId: string): Promise<boolean> {
    await mockDelay(200);
    return true;
  },
};
