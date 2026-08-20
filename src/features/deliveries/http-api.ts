import { apiRequest, encryptedApiRequest } from "@/lib/api-client";
import type { DeliveryItem, DeliveryPage, DeliveryQuery } from "./types";

export * from "./types";

type BackendPersonSummary = {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
};

type BackendDeliveryListItem = {
  id?: string;
  sender?: BackendPersonSummary;
  rider?: BackendPersonSummary;
  pickupLocation?: string;
  dropoffLocation?: string;
  status?: string;
  price?: number;
  createdOn?: string;
  hasException?: boolean;
};

type BackendPagedDeliveries = {
  items?: BackendDeliveryListItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

function mapDelivery(item: BackendDeliveryListItem): DeliveryItem {
  return {
    id: item.id ?? "",
    senderName: item.sender?.fullName || item.sender?.name || "Customer",
    senderPhone: item.sender?.phoneNumber,
    riderName: item.rider?.fullName || item.rider?.name || "Unassigned",
    riderPhone: item.rider?.phoneNumber,
    pickupLocation: item.pickupLocation ?? "Pickup address",
    dropoffLocation: item.dropoffLocation ?? "Dropoff address",
    status: item.status ?? "Pending",
    price: item.price ?? 0,
    createdOn: item.createdOn ?? new Date().toISOString(),
    hasException: Boolean(item.hasException),
  };
}

export const deliveriesHttpApi = {
  async list(query: DeliveryQuery): Promise<DeliveryPage> {
    const raw = await encryptedApiRequest<BackendPagedDeliveries | BackendDeliveryListItem[]>(
      "/Deliveries/List",
      {
        PageNumber: query.page,
        PageSize: query.pageSize,
        ...(query.status ? { Status: query.status } : {}),
        ...(query.search ? { SearchQuery: query.search } : {}),
      },
    );

    if (Array.isArray(raw)) {
      const mapped = raw.map(mapDelivery);
      const start = (query.page - 1) * query.pageSize;
      return {
        items: mapped.slice(start, start + query.pageSize),
        totalCount: mapped.length,
        pageNumber: query.page,
        pageSize: query.pageSize,
      };
    }

    const items = (raw.items ?? []).map(mapDelivery);
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      pageNumber: raw.pageNumber ?? query.page,
      pageSize: raw.pageSize ?? query.pageSize,
    };
  },

  async getDetails(id: string): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>(`/Deliveries/${id}`);
  },
};
