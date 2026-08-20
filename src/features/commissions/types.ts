export type CommissionItem = {
  id: string;
  deliveryId: string;
  orderAmount: number;
  commissionFee: number;
  riderEarnings: number;
  ratePercent: number;
  createdOn: string;
};

export type CommissionPage = {
  items: CommissionItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type CommissionQuery = {
  page: number;
  pageSize: number;
};
