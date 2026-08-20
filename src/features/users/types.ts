export type AccountStatus = "Active" | "Suspended" | "Restricted" | "Locked";

export type CustomerUser = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  status: AccountStatus;
  lastOnlineAt?: string;
  hasSupportFlag: boolean;
  createdOn: string;
};

export type CustomerUserPage = {
  items: CustomerUser[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type CustomerUserQuery = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  role?: string;
};

export type CustomerOrder = {
  id: string;
  senderName: string;
  senderEmail?: string;
  riderName?: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: "Pending" | "InTransit" | "Delivered" | "Cancelled" | "Exception" | string;
  price: number;
  createdOn: string;
  hasException: boolean;
};

export type CustomerOrdersPage = {
  items: CustomerOrder[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type UserActivityLog = {
  id: string;
  type: string;
  tableName: string;
  dateTime: string;
};

export type CustomerUserDetails = {
  profile: CustomerUser;
  totalDeliveries: number;
  totalComplaints: number;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  accessFailedCount: number;
  lockoutEnd?: string;
  recentActivity: UserActivityLog[];
};
