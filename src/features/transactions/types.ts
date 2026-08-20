export type TransactionItem = {
  id: string;
  reference: string;
  userEmail?: string;
  type: string;
  amount: number;
  currency: string;
  status: "Completed" | "Pending" | "Failed" | string;
  gatewayReference?: string;
  createdOn: string;
};

export type TransactionPage = {
  items: TransactionItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type TransactionQuery = {
  page: number;
  pageSize: number;
  search?: string;
};
