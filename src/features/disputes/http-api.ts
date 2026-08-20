import { encryptedApiRequest } from "@/lib/api-client";
import type { DisputeItem, DisputePage, DisputeQuery } from "./types";

export * from "./types";

type BackendDisputeItem = {
  id?: string;
  deliveryId?: string;
  raisedByName?: string;
  raisedByRole?: string;
  reason?: string;
  status?: string;
  createdOn?: string;
  createdAt?: string;
};

type BackendPagedDisputes = {
  items?: BackendDisputeItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

function mapDispute(item: BackendDisputeItem): DisputeItem {
  return {
    id: item.id ?? "",
    deliveryId: item.deliveryId ?? "—",
    raisedByName: item.raisedByName ?? "User",
    raisedByRole: item.raisedByRole ?? "Customer",
    reason: item.reason ?? "Delivery dispute",
    status: item.status ?? "Open",
    createdOn: item.createdOn ?? item.createdAt ?? new Date().toISOString(),
  };
}

export const disputesHttpApi = {
  async list(query: DisputeQuery): Promise<DisputePage> {
    const raw = await encryptedApiRequest<BackendPagedDisputes | BackendDisputeItem[]>(
      "/Disputes/List",
      {
        PageNumber: query.page,
        PageSize: query.pageSize,
        ...(query.status ? { Status: query.status } : {}),
        ...(query.search ? { SearchQuery: query.search } : {}),
      },
    );

    if (Array.isArray(raw)) {
      const mapped = raw.map(mapDispute);
      const start = (query.page - 1) * query.pageSize;
      return {
        items: mapped.slice(start, start + query.pageSize),
        totalCount: mapped.length,
        pageNumber: query.page,
        pageSize: query.pageSize,
      };
    }

    const items = (raw.items ?? []).map(mapDispute);
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      pageNumber: raw.pageNumber ?? query.page,
      pageSize: raw.pageSize ?? query.pageSize,
    };
  },

  async resolve(disputeId: string, resolution: string, note?: string): Promise<boolean> {
    await encryptedApiRequest<boolean>(`/Disputes/${disputeId}/resolve`, {
      Resolution: resolution,
      Note: note || "Resolved by admin",
    });
    return true;
  },
};
