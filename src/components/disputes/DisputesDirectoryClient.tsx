"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { NotIntegratedBanner } from "@/components/common/NotIntegratedBanner";
import { PageHeader } from "@/components/common/PageHeader";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { disputesApi, type DisputeItem } from "@/features/disputes/api";
import { formatBackendDate } from "@/lib/date-format";

export function DisputesDirectoryClient() {
  const [rows, setRows] = useState<DisputeItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await disputesApi.list({ page, pageSize, search, status });
      setRows(res.items ?? []);
      setTotal(res.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load disputes queue.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, status]);

  useEffect(() => {
    void loadDisputes();
  }, [loadDisputes]);

  const isNotIntegrated =
    error && (error.includes("404") || error.toLowerCase().includes("not found") || error.includes("501"));

  async function handleResolve(id: string) {
    try {
      await disputesApi.resolve(id, "Resolved", "Resolved by admin");
      toast.success("Dispute resolved successfully.");
      await loadDisputes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resolve dispute.");
    }
  }

  const columns: TableColumn<DisputeItem>[] = [
    {
      key: "id",
      label: "Dispute ID",
      render: (row) => (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <div>
            <p className="font-semibold text-sm">{row.id}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Order: {row.deliveryId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "raisedBy",
      label: "Raised By",
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.raisedByName}</p>
          <Badge>{row.raisedByRole}</Badge>
        </div>
      ),
    },
    {
      key: "reason",
      label: "Dispute Reason / Claim",
      render: (row) => <p className="text-xs max-w-sm font-medium">{row.reason}</p>,
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge label={row.status} /> },
    { key: "date", label: "Opened Date", render: (row) => formatBackendDate(row.createdOn) },
    {
      key: "actions",
      label: "Action",
      render: (row) =>
        row.status === "Open" ? (
          <Button
            type="button"
            className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => handleResolve(row.id)}
          >
            <Check className="h-3.5 w-3.5 mr-1" /> Resolve Dispute
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Disputes & Claims"
        subtitle="Manage customer vs rider order disputes, claims, and resolutions."
        role="super_admin"
      />

      {isNotIntegrated ? (
        <NotIntegratedBanner
          featureName="Disputes & Claims"
          endpoint="POST /api/Disputes/List"
        />
      ) : (
        <Card className="p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Search by dispute ID, order ID, or user..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none"
            >
              <option value="">All statuses</option>
              <option value="Open">Open</option>
              <option value="InReview">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>
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
            emptyMessage="No dispute claims found."
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </Card>
      )}
    </div>
  );
}
