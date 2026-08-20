export type DeliveryStatus = "Pending" | "Assigned" | "InTransit" | "Delivered" | "Cancelled" | "Exception";

export type DeliveryItem = {
  id: string;
  senderName: string;
  senderPhone?: string;
  riderName?: string;
  riderPhone?: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: DeliveryStatus | string;
  price: number;
  createdOn: string;
  hasException: boolean;
};

export type DeliveryPage = {
  items: DeliveryItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type DeliveryQuery = {
  page: number;
  pageSize: number;
  status?: string;
  search?: string;
};
