export type AdminRoleFilter = "" | "Admin" | "Supervisor";
export type AdminRole = Exclude<AdminRoleFilter, "">;

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdOn: string;
  status?: string;
  profilePicture?: string;
  lastOnlineAt?: string;
  permissions?: string[];
};

export type AdminPage = {
  items: AdminUser[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type CreateAdminInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: AdminRole;
};

export type DashboardMetrics = {
  activeDeliveries: number;
  pendingApprovals: number;
  openDisputes: number;
  pendingPayouts: number;
  dailyRevenue: number;
  commission: number;
};

export type TrendPoint = {
  day: string;
  revenue: number;
  commission: number;
};

export type NamedValue = {
  label: string;
  value: number;
  color?: string;
};

export type DateRangeInput = {
  from?: string;
  to?: string;
};
