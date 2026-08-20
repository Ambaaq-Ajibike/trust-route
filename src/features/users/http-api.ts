import { apiRequest, encryptedApiRequest } from "@/lib/api-client";
import type {
  AccountStatus,
  CustomerOrder,
  CustomerOrdersPage,
  CustomerUser,
  CustomerUserDetails,
  CustomerUserPage,
  CustomerUserQuery,
} from "./types";

export * from "./types";

type BackendUserItem = {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  roles?: string[];
  role?: string;
  status?: string;
  accountStatus?: string;
  lastOnlineAt?: string;
  hasSupportFlag?: boolean;
  createdOn?: string;
};

type BackendPagedUsers = {
  items?: BackendUserItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

type BackendPersonSummary = {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
};

type BackendDeliveryListItem = {
  id?: string;
  sender?: BackendPersonSummary;
  rider?: BackendPersonSummary;
  pickupLocation?: string;
  dropoffLocation?: string;
  status?: string;
  price?: number;
  createdOn?: string;
  hasException?: boolean;
};

type BackendPagedDeliveries = {
  items?: BackendDeliveryListItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

function mapCustomerUser(item: BackendUserItem): CustomerUser {
  const name =
    item.name ||
    [item.firstName, item.lastName].filter(Boolean).join(" ") ||
    item.email ||
    "Customer";
  const roles = item.roles || (item.role ? [item.role] : ["Customer"]);
  const statusStr = (item.status || item.accountStatus || "Active") as AccountStatus;

  return {
    id: item.id ?? "",
    name,
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email ?? "",
    phoneNumber: item.phoneNumber ?? item.phone ?? "",
    roles,
    status: statusStr,
    lastOnlineAt: item.lastOnlineAt,
    hasSupportFlag: Boolean(item.hasSupportFlag),
    createdOn: item.createdOn ?? new Date().toISOString(),
  };
}

function mapCustomerOrder(item: BackendDeliveryListItem): CustomerOrder {
  return {
    id: item.id ?? "",
    senderName: item.sender?.fullName || item.sender?.name || "Customer",
    senderEmail: item.sender?.email,
    riderName: item.rider?.fullName || item.rider?.name || "Unassigned",
    pickupLocation: item.pickupLocation ?? "Pickup address",
    dropoffLocation: item.dropoffLocation ?? "Dropoff address",
    status: item.status ?? "Pending",
    price: item.price ?? 0,
    createdOn: item.createdOn ?? new Date().toISOString(),
    hasException: Boolean(item.hasException),
  };
}

export const usersHttpApi = {
  async listCustomers(query: CustomerUserQuery): Promise<CustomerUserPage> {
    const raw = await encryptedApiRequest<BackendPagedUsers | BackendUserItem[]>("/Users/List", {
      Role: query.role || "Customer",
      ...(query.search ? { Search: query.search } : {}),
      ...(query.status ? { Status: query.status } : {}),
      PageNumber: query.page,
      PageSize: query.pageSize,
    });

    if (Array.isArray(raw)) {
      const mapped = raw.map(mapCustomerUser);
      const start = (query.page - 1) * query.pageSize;
      return {
        items: mapped.slice(start, start + query.pageSize),
        totalCount: mapped.length,
        pageNumber: query.page,
        pageSize: query.pageSize,
      };
    }

    const items = (raw.items ?? []).map(mapCustomerUser);
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      pageNumber: raw.pageNumber ?? query.page,
      pageSize: raw.pageSize ?? query.pageSize,
    };
  },

  async getCustomerDetails(userId: string): Promise<CustomerUserDetails> {
    const raw = await apiRequest<Record<string, unknown>>(`/Users/${userId}`);
    const profileRaw = (raw.profile ?? raw) as BackendUserItem;
    const profile = mapCustomerUser(profileRaw);

    return {
      profile,
      totalDeliveries: Number(raw.deliveries ?? raw.totalDeliveries ?? 0),
      totalComplaints: Number(raw.complaints ?? raw.totalComplaints ?? 0),
      emailConfirmed: Boolean(raw.emailConfirmed),
      phoneNumberConfirmed: Boolean(raw.phoneNumberConfirmed),
      accessFailedCount: Number(raw.accessFailedCount ?? 0),
      lockoutEnd: raw.lockoutEnd as string | undefined,
      recentActivity: (raw.activity ?? raw.recentActivity ?? []) as CustomerUserDetails["recentActivity"],
    };
  },

  async getCustomerOrders(userId: string, page = 1, pageSize = 10): Promise<CustomerOrdersPage> {
    const raw = await encryptedApiRequest<BackendPagedDeliveries | BackendDeliveryListItem[]>(
      "/Deliveries/List",
      {
        SenderId: userId,
        PageNumber: page,
        PageSize: pageSize,
      },
    );

    if (Array.isArray(raw)) {
      const mapped = raw.map(mapCustomerOrder);
      const start = (page - 1) * pageSize;
      return {
        items: mapped.slice(start, start + pageSize),
        totalCount: mapped.length,
        pageNumber: page,
        pageSize,
      };
    }

    const items = (raw.items ?? []).map(mapCustomerOrder);
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      pageNumber: raw.pageNumber ?? page,
      pageSize: raw.pageSize ?? pageSize,
    };
  },

  async changeUserStatus(userId: string, status: AccountStatus, reason?: string): Promise<boolean> {
    await encryptedApiRequest<boolean>(`/Users/${userId}/status`, {
      Status: status,
      Reason: reason || "Status updated by admin/supervisor",
    });
    return true;
  },
};
