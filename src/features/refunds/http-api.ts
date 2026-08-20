import { encryptedApiRequest } from "@/lib/api-client";
import type { RefundItem, RefundPage, RefundQuery } from "./types";

export * from "./types";

type BackendRefundItem = {
  id?: string;
  deliveryId?: string;
  customerName?: string;
  amount?: number;
  reason?: string;
  status?: string;
  requestedAt?: string;
  createdOn?: string;
};

type BackendPagedRefunds = {
  items?: BackendRefundItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

function mapRefund(item: BackendRefundItem): RefundItem {
  return {
    id: item.id ?? "",
    deliveryId: item.deliveryId ?? "—",
    customerName: item.customerName ?? "Customer",
    amount: item.amount ?? 0,
    reason: item.reason ?? "Order cancellation refund",
    status: item.status ?? "Pending",
    requestedAt: item.requestedAt ?? item.createdOn ?? new Date().toISOString(),
  };
}

export const refundsHttpApi = {
  async list(query: RefundQuery): Promise<RefundPage> {
    const raw = await encryptedApiRequest<BackendPagedRefunds | BackendRefundItem[]>(
      "/Refunds/List",
      {
        PageNumber: query.page,
        PageSize: query.pageSize,
      },
    );

    if (Array.isArray(raw)) {
      const mapped = raw.map(mapRefund);
      const start = (query.page - 1) * query.pageSize;
      return {
        items: mapped.slice(start, start + query.pageSize),
        totalCount: mapped.length,
        pageNumber: query.page,
        pageSize: query.pageSize,
      };
    }

    const items = (raw.items ?? []).map(mapRefund);
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      pageNumber: raw.pageNumber ?? query.page,
      pageSize: raw.pageSize ?? query.pageSize,
    };
  },

  async decideRefund(refundId: string, status: "Approved" | "Rejected", note?: string): Promise<boolean> {
    await encryptedApiRequest<boolean>(`/Refunds/${refundId}/decision`, {
      Status: status,
      Note: note || `${status} by admin`,
    });
    return true;
  },
};
