export type RefundStatus = "Pending" | "Approved" | "Rejected" | "Processed" | string;

export type RefundItem = {
  id: string;
  deliveryId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
};

export type RefundPage = {
  items: RefundItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type RefundQuery = {
  page: number;
  pageSize: number;
};
