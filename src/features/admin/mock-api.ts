import { mockStore } from "@/lib/mock-store";
import { approvalQueue, deliveryMix, revenueTrend } from "./mock-data";
import type {
  AdminPage,
  AdminRoleFilter,
  CreateAdminInput,
  DashboardMetrics,
  NamedValue,
  TrendPoint,
} from "./types";

let mockAdmins = [
  {
    id: "adm-001",
    firstName: "Daniel",
    lastName: "Okafor",
    email: "admin@trustroute.local",
    phoneNumber: "+2348011112222",
    role: "Admin",
    createdOn: new Date().toISOString(),
    status: "Active",
  },
  {
    id: "sup-001",
    firstName: "Amina",
    lastName: "Bello",
    email: "supervisor@trustroute.local",
    phoneNumber: "+2348033334444",
    role: "Supervisor",
    createdOn: new Date().toISOString(),
    status: "Active",
  },
];

export const mockAdminApi = {
  async list(pageNumber: number, pageSize: number, roleFilter: AdminRoleFilter): Promise<AdminPage> {
    const filtered = roleFilter ? mockAdmins.filter((a) => a.role === roleFilter) : mockAdmins;
    const start = (pageNumber - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return {
      items,
      pageNumber,
      pageSize,
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  async create(input: CreateAdminInput): Promise<{ success: boolean; message: string }> {
    mockAdmins.unshift({
      id: `adm-${Date.now()}`,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phoneNumber: input.phoneNumber,
      role: input.role,
      createdOn: new Date().toISOString(),
      status: "Active",
    });
    return {
      success: true,
      message: `${input.role} created successfully.`,
    };
  },

  async getDashboard(): Promise<DashboardMetrics> {
    const metrics = mockStore.dashboardMetrics("admin");
    return {
      activeDeliveries: metrics.activeDeliveries ?? 0,
      pendingApprovals: metrics.pendingApprovals ?? 0,
      openDisputes: metrics.openDisputes ?? 0,
      pendingPayouts: metrics.pendingPayouts ?? 0,
      dailyRevenue: metrics.dailyRevenue ?? 0,
      commission: metrics.commission ?? 0,
    };
  },

  async getRevenueTrend(): Promise<TrendPoint[]> {
    return revenueTrend;
  },

  async getDeliveryMix(): Promise<NamedValue[]> {
    return deliveryMix;
  },

  async getApprovalQueue(): Promise<NamedValue[]> {
    return approvalQueue;
  },
};
