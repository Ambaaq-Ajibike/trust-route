"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Search } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { PageHeader } from "@/components/common/PageHeader";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { auditLogsApi, type AuditLogItem } from "@/features/audit-logs/api";
import { formatBackendDate } from "@/lib/date-format";

export function AuditLogsClient() {
  const [rows, setRows] = useState<AuditLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await auditLogsApi.list({ page, pageSize, search });
      setRows(res.items ?? []);
      setTotal(res.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load audit logs.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  const columns: TableColumn<AuditLogItem>[] = [
    {
      key: "id",
      label: "Audit Event",
      render: (row) => (
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-purple-600" />
          <div>
            <p className="font-semibold text-sm">{row.action}</p>
            <p className="text-xs text-[var(--muted-foreground)]">ID: {row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "Performed By",
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.userName}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{row.userEmail || "System"}</p>
        </div>
      ),
    },
    { key: "table", label: "Target Entity", render: (row) => <Badge>{row.tableName || "System"}</Badge> },
    { key: "ip", label: "IP Address", render: (row) => <span className="font-mono text-xs">{row.ipAddress}</span> },
    { key: "date", label: "Timestamp", render: (row) => formatBackendDate(row.createdOn) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs & Security Trail"
        subtitle="Complete trail of privileged administrative actions, system events, and security logs."
        role="super_admin"
      />

      <Card className="p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search audit logs by action or user..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <PaginatedDataTable
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          page={page}
          pageSize={pageSize}
          total={total}
          loading={loading}
          emptyMessage="No audit trail events found."
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Card>
    </div>
  );
}
