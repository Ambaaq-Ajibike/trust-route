export type DisputeStatus = "Open" | "InReview" | "Resolved" | "Rejected" | string;

export type DisputeItem = {
  id: string;
  deliveryId: string;
  raisedByName: string;
  raisedByRole?: string;
  reason: string;
  status: DisputeStatus;
  createdOn: string;
};

export type DisputePage = {
  items: DisputeItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type DisputeQuery = {
  page: number;
  pageSize: number;
  status?: string;
  search?: string;
};
