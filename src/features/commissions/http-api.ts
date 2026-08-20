import { encryptedApiRequest } from "@/lib/api-client";
import type { CommissionItem, CommissionPage, CommissionQuery } from "./types";

export * from "./types";

type BackendCommissionListItem = {
  id?: string;
  deliveryId?: string;
  orderAmount?: number;
  commissionFee?: number;
  riderEarnings?: number;
  ratePercent?: number;
  createdOn?: string;
};

type BackendPagedCommissions = {
  items?: BackendCommissionListItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

function mapCommission(item: BackendCommissionListItem): CommissionItem {
  return {
    id: item.id ?? "",
    deliveryId: item.deliveryId ?? "—",
    orderAmount: item.orderAmount ?? 0,
    commissionFee: item.commissionFee ?? 0,
    riderEarnings: item.riderEarnings ?? 0,
    ratePercent: item.ratePercent ?? 15,
    createdOn: item.createdOn ?? new Date().toISOString(),
  };
}

export const commissionsHttpApi = {
  async list(query: CommissionQuery): Promise<CommissionPage> {
    const raw = await encryptedApiRequest<BackendPagedCommissions | BackendCommissionListItem[]>(
      "/Commissions/List",
      {
        PageNumber: query.page,
        PageSize: query.pageSize,
      },
    );

    if (Array.isArray(raw)) {
      const mapped = raw.map(mapCommission);
      const start = (query.page - 1) * query.pageSize;
      return {
        items: mapped.slice(start, start + query.pageSize),
        totalCount: mapped.length,
        pageNumber: query.page,
        pageSize: query.pageSize,
      };
    }

    const items = (raw.items ?? []).map(mapCommission);
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      pageNumber: raw.pageNumber ?? query.page,
      pageSize: raw.pageSize ?? query.pageSize,
    };
  },
};
