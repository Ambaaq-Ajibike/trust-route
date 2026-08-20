import { apiRequest, encryptedApiRequest } from "@/lib/api-client";
import type { AuditLogItem, AuditLogPage, AuditLogQuery } from "./types";

export * from "./types";

type BackendAuditLogItem = {
  id?: string;
  userEmail?: string;
  userName?: string;
  action?: string;
  type?: string;
  tableName?: string;
  ipAddress?: string;
  createdOn?: string;
  dateTime?: string;
};

type BackendPagedAuditLogs = {
  items?: BackendAuditLogItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

function mapAuditLog(item: BackendAuditLogItem): AuditLogItem {
  return {
    id: item.id ?? "",
    userEmail: item.userEmail,
    userName: item.userName || item.userEmail || "System",
    action: item.action || item.type || "System Action",
    tableName: item.tableName,
    ipAddress: item.ipAddress || "—",
    createdOn: item.createdOn || item.dateTime || new Date().toISOString(),
  };
}

export const auditLogsHttpApi = {
  async list(query: AuditLogQuery): Promise<AuditLogPage> {
    const raw = await encryptedApiRequest<BackendPagedAuditLogs | BackendAuditLogItem[]>(
      "/AuditLogs/List",
      {
        PageNumber: query.page,
        PageSize: query.pageSize,
        ...(query.search ? { Action: query.search } : {}),
      },
    );

    if (Array.isArray(raw)) {
      const mapped = raw.map(mapAuditLog);
      const start = (query.page - 1) * query.pageSize;
      return {
        items: mapped.slice(start, start + query.pageSize),
        totalCount: mapped.length,
        pageNumber: query.page,
        pageSize: query.pageSize,
      };
    }

    const items = (raw.items ?? []).map(mapAuditLog);
    return {
      items,
      totalCount: raw.totalCount ?? items.length,
      pageNumber: raw.pageNumber ?? query.page,
      pageSize: raw.pageSize ?? query.pageSize,
    };
  },

  async getDetails(id: string): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>(`/AuditLogs/${id}`);
  },
};
