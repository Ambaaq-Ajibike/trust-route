export type PayoutStatus = "Pending" | "Approved" | "Rejected" | "Processing" | string;

export type PayoutItem = {
  id: string;
  riderName: string;
  riderEmail?: string;
  bankName?: string;
  accountNumber?: string;
  amount: number;
  status: PayoutStatus;
  requestedAt: string;
  notes?: string;
};

export type PayoutPage = {
  items: PayoutItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type PayoutQuery = {
  page: number;
  pageSize: number;
  status?: string;
};
