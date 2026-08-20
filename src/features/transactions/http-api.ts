import { apiRequest, encryptedApiRequest } from "@/lib/api-client";
import type { TransactionItem, TransactionPage, TransactionQuery } from "./types";

export * from "./types";

type BackendTransactionListItem = {
  id?: string;
  reference?: string;
  userEmail?: string;
  type?: string;
  amount?: number;
  currency?: string;
  status?: string;
  gatewayReference?: string;
  createdOn?: string;
};

type BackendPagedTransactions = {
  items?: BackendTransactionListItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

function mapTransaction(item: BackendTransactionListItem): TransactionItem {
  return {
    id: item.id ?? "",
    reference: item.reference ?? item.id ?? "",
    userEmail: item.userEmail ?? "",
    type: item.type ?? "Payment",
    amount: item.amount ?? 0,
    currency: item.currency ?? "NGN",
    status: item.status ?? "Completed",
    gatewayReference: item.gatewayReference,
    createdOn: item.createdOn ?? new Date().toISOString(),
  };
}

export const transactionsHttpApi = {
  async list(query: TransactionQuery): Promise<TransactionPage> {
    const raw = await encryptedApiRequest<BackendPagedTransactions | BackendTransactionListItem[]>(
      "/Transactions/List",
      {
        PageNumber: query.page,
        PageSize: query.pageSize,
        ...(query.search ? { SearchQuery: query.search } : {}),
      },
    );

    if (Array.isArray(raw)) {
      const mapped = raw.map(mapTransaction);
      const start = (query.page - 1) * query.pageSize;
      return {
        items: mapped.slice(start, start + query.pageSize),
        totalCount: mapped.length,
        pageNumber: query.page,
        pageSize: query.pageSize,
      };
    }

    const items = (raw.items ?? []).map(mapTransaction);
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      pageNumber: raw.pageNumber ?? query.page,
      pageSize: raw.pageSize ?? query.pageSize,
    };
  },

  async getDetails(id: string): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>(`/Transactions/${id}`);
  },
};
