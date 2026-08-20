import { mockDelay } from "@/lib/mock-delay";
import type { AuditLogItem, AuditLogPage, AuditLogQuery } from "./types";

const mockAuditLogs: AuditLogItem[] = [
  {
    id: "ADT-9901",
    userEmail: "admin@trustroute.com",
    userName: "System Admin",
    action: "UPDATE_USER_STATUS",
    tableName: "Users",
    ipAddress: "197.210.65.12",
    createdOn: "2026-08-19T22:05:00Z",
  },
];

export const auditLogsMockApi = {
  async list(query: AuditLogQuery): Promise<AuditLogPage> {
    await mockDelay(250);
    const start = (query.page - 1) * query.pageSize;
    return {
      items: mockAuditLogs.slice(start, start + query.pageSize),
      totalCount: mockAuditLogs.length,
      pageNumber: query.page,
      pageSize: query.pageSize,
    };
  },
  async getDetails(id: string): Promise<Record<string, unknown>> {
    await mockDelay(200);
    return { id, action: "UPDATE_USER_STATUS" };
  },
};
