import { mockDelay } from "@/lib/mock-delay";
import type { DeliveryItem, DeliveryPage, DeliveryQuery } from "./types";

const mockDeliveries: DeliveryItem[] = [
  {
    id: "DLV-9901",
    senderName: "Olawale Adebayo",
    riderName: "Tunde Bakare",
    pickupLocation: "12 Allen Avenue, Ikeja, Lagos",
    dropoffLocation: "45 Admiralty Way, Lekki Phase 1, Lagos",
    status: "InTransit",
    price: 4500,
    createdOn: "2026-08-19T21:40:00Z",
    hasException: false,
  },
  {
    id: "DLV-9884",
    senderName: "Chidimma Eze",
    riderName: "Suleiman Garba",
    pickupLocation: "15 Isaac John St, Ikeja GRA, Lagos",
    dropoffLocation: "100 Awolowo Road, Ikoyi, Lagos",
    status: "Delivered",
    price: 5800,
    createdOn: "2026-08-19T18:15:00Z",
    hasException: false,
  },
];

export const deliveriesMockApi = {
  async list(query: DeliveryQuery): Promise<DeliveryPage> {
    await mockDelay(300);
    const start = (query.page - 1) * query.pageSize;
    return {
      items: mockDeliveries.slice(start, start + query.pageSize),
      totalCount: mockDeliveries.length,
      pageNumber: query.page,
      pageSize: query.pageSize,
    };
  },
  async getDetails(id: string): Promise<Record<string, unknown>> {
    await mockDelay(200);
    return { id, status: "InTransit", price: 4500 };
  },
};
