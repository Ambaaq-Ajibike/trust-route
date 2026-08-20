import { encryptedApiRequest } from "@/lib/api-client";
import type { PayoutItem, PayoutPage, PayoutQuery } from "./types";

export * from "./types";

type BackendPayoutItem = {
  id?: string;
  riderName?: string;
  riderEmail?: string;
  bankName?: string;
  accountNumber?: string;
  amount?: number;
  status?: string;
  requestedAt?: string;
  createdOn?: string;
  notes?: string;
};

type BackendPagedPayouts = {
  items?: BackendPayoutItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

function mapPayout(item: BackendPayoutItem): PayoutItem {
  return {
    id: item.id ?? "",
    riderName: item.riderName ?? "Rider",
    riderEmail: item.riderEmail,
    bankName: item.bankName ?? "Bank",
    accountNumber: item.accountNumber ?? "—",
    amount: item.amount ?? 0,
    status: item.status ?? "Pending",
    requestedAt: item.requestedAt ?? item.createdOn ?? new Date().toISOString(),
    notes: item.notes,
  };
}

export const payoutsHttpApi = {
  async list(query: PayoutQuery): Promise<PayoutPage> {
    const raw = await encryptedApiRequest<BackendPagedPayouts | BackendPayoutItem[]>(
      "/Payouts/List",
      {
        PageNumber: query.page,
        PageSize: query.pageSize,
        ...(query.status ? { Status: query.status } : {}),
      },
    );

    if (Array.isArray(raw)) {
      const mapped = raw.map(mapPayout);
      const start = (query.page - 1) * query.pageSize;
      return {
        items: mapped.slice(start, start + query.pageSize),
        totalCount: mapped.length,
        pageNumber: query.page,
        pageSize: query.pageSize,
      };
    }

    const items = (raw.items ?? []).map(mapPayout);
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      pageNumber: raw.pageNumber ?? query.page,
      pageSize: raw.pageSize ?? query.pageSize,
    };
  },

  async decidePayout(payoutId: string, status: "Approved" | "Rejected", note?: string): Promise<boolean> {
    await encryptedApiRequest<boolean>(`/Payouts/${payoutId}/decision`, {
      Status: status,
      Note: note || `${status} by admin`,
    });
    return true;
  },
};
