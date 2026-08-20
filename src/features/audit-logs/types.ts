export type AuditLogItem = {
  id: string;
  userEmail?: string;
  userName?: string;
  action: string;
  tableName?: string;
  ipAddress?: string;
  createdOn: string;
};

export type AuditLogPage = {
  items: AuditLogItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type AuditLogQuery = {
  page: number;
  pageSize: number;
  search?: string;
};
