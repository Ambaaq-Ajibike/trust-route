import { encryptedApiRequest, encryptedApiRequestWithEnvelope } from "@/lib/api-client";
import type {
  AdminPage,
  AdminRole,
  AdminRoleFilter,
  CreateAdminInput,
  DashboardMetrics,
  DateRangeInput,
  NamedValue,
  TrendPoint,
} from "./types";

export * from "./types";

type BackendTrendPoint = {
  date?: string;
  day?: string;
  primary?: number;
  secondary?: number;
  revenue?: number;
  commission?: number;
};

type BackendNamedValue = {
  name?: string;
  label?: string;
  value?: number;
  color?: string;
};

export const adminHttpApi = {
  list(pageNumber: number, pageSize: number, role: AdminRoleFilter) {
    return encryptedApiRequest<AdminPage>("/Admins/List", {
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...(role ? { Role: role } : {}),
    });
  },

  async create(input: CreateAdminInput): Promise<{ success: boolean; message: string }> {
    const res = await encryptedApiRequestWithEnvelope<boolean>("/Admins", {
      FirstName: input.firstName,
      LastName: input.lastName,
      Email: input.email,
      PhoneNumber: input.phoneNumber,
      Password: input.password,
      Role: input.role,
    });
    return {
      success: res.success,
      message: res.message || `${input.role} created successfully.`,
    };
  },

  getDashboard(dateRange?: DateRangeInput) {
    return encryptedApiRequest<DashboardMetrics>("/Admin/Dashboard", {
      From: dateRange?.from,
      To: dateRange?.to,
    });
  },

  async getRevenueTrend(dateRange?: DateRangeInput): Promise<TrendPoint[]> {
    const raw = await encryptedApiRequest<BackendTrendPoint[]>("/Admin/Dashboard/RevenueTrend", {
      From: dateRange?.from,
      To: dateRange?.to,
    });
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => ({
      day: item.day ?? item.date ?? "",
      revenue: item.revenue ?? item.primary ?? 0,
      commission: item.commission ?? item.secondary ?? 0,
    }));
  },

  async getDeliveryMix(dateRange?: DateRangeInput): Promise<NamedValue[]> {
    const raw = await encryptedApiRequest<BackendNamedValue[]>("/Admin/Dashboard/DeliveryMix", {
      From: dateRange?.from,
      To: dateRange?.to,
    });
    if (!Array.isArray(raw)) return [];
    const defaultColors = ["#0f766e", "#2563eb", "#f59e0b", "#b42318"];
    return raw.map((item, idx) => ({
      label: item.label ?? item.name ?? "",
      value: item.value ?? 0,
      color: item.color || defaultColors[idx % defaultColors.length],
    }));
  },

  async getApprovalQueue(dateRange?: DateRangeInput): Promise<NamedValue[]> {
    const raw = await encryptedApiRequest<BackendNamedValue[]>("/Admin/Dashboard/ApprovalQueue", {
      From: dateRange?.from,
      To: dateRange?.to,
    });
    if (!Array.isArray(raw)) return [];
    const defaultColors = ["#0f766e", "#2563eb", "#f59e0b", "#b42318"];
    return raw.map((item, idx) => ({
      label: item.label ?? item.name ?? "",
      value: item.value ?? 0,
      color: item.color || defaultColors[idx % defaultColors.length],
    }));
  },
};