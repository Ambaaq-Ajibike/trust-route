import { mockDelay } from "@/lib/mock-delay";
import { mockCustomerOrdersSeed, mockCustomersSeed } from "./mock-data";
import type {
  AccountStatus,
  CustomerOrder,
  CustomerOrdersPage,
  CustomerUserDetails,
  CustomerUserPage,
  CustomerUserQuery,
} from "./types";

let customers = [...mockCustomersSeed];

export const usersMockApi = {
  async listCustomers(query: CustomerUserQuery): Promise<CustomerUserPage> {
    await mockDelay(300);
    let filtered = [...customers];
    if (query.search) {
      const term = query.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phoneNumber.includes(term),
      );
    }
    if (query.status) {
      filtered = filtered.filter((c) => c.status === query.status);
    }

    const start = (query.page - 1) * query.pageSize;
    return {
      items: filtered.slice(start, start + query.pageSize),
      totalCount: filtered.length,
      pageNumber: query.page,
      pageSize: query.pageSize,
    };
  },

  async getCustomerDetails(userId: string): Promise<CustomerUserDetails> {
    await mockDelay(250);
    const profile = customers.find((c) => c.id === userId) || {
      id: userId,
      name: "Customer User",
      email: "customer@example.com",
      phoneNumber: "+2348000000000",
      roles: ["Customer"],
      status: "Active" as AccountStatus,
      hasSupportFlag: false,
      createdOn: new Date().toISOString(),
    };

    const orders = mockCustomerOrdersSeed[userId] || [];

    return {
      profile,
      totalDeliveries: orders.length,
      totalComplaints: profile.hasSupportFlag ? 1 : 0,
      emailConfirmed: true,
      phoneNumberConfirmed: true,
      accessFailedCount: 0,
      recentActivity: [
        {
          id: `act-1`,
          type: "LOGIN",
          tableName: "Users",
          dateTime: profile.lastOnlineAt || new Date().toISOString(),
        },
        {
          id: `act-2`,
          type: "CREATE_ORDER",
          tableName: "Deliveries",
          dateTime: profile.createdOn,
        },
      ],
    };
  },

  async getCustomerOrders(userId: string, page = 1, pageSize = 10): Promise<CustomerOrdersPage> {
    await mockDelay(250);
    const orders: CustomerOrder[] = mockCustomerOrdersSeed[userId] || [
      {
        id: `DEL-${userId.slice(-4)}-101`,
        senderName: "Customer User",
        senderEmail: "customer@example.com",
        riderName: "Active Rider",
        pickupLocation: "Victoria Island, Lagos",
        dropoffLocation: "Ikeja GRA, Lagos",
        status: "Delivered",
        price: 3500,
        createdOn: new Date().toISOString(),
        hasException: false,
      },
    ];

    const start = (page - 1) * pageSize;
    return {
      items: orders.slice(start, start + pageSize),
      totalCount: orders.length,
      pageNumber: page,
      pageSize,
    };
  },

  async changeUserStatus(userId: string, status: AccountStatus): Promise<boolean> {
    await mockDelay(300);
    customers = customers.map((c) => (c.id === userId ? { ...c, status } : c));
    return true;
  },
};
