"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { PageHeader } from "@/components/common/PageHeader";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { refundsApi, type RefundItem } from "@/features/refunds/api";
import { formatBackendDate } from "@/lib/date-format";

export function RefundsDirectoryClient() {
  const [rows, setRows] = useState<RefundItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRefunds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await refundsApi.list({ page, pageSize });
      setRows(res.items ?? []);
      setTotal(res.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load refunds queue.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void loadRefunds();
  }, [loadRefunds]);

  async function handleDecision(id: string, decision: "Approved" | "Rejected") {
    try {
      await refundsApi.decideRefund(id, decision);
      toast.success(`Refund ${decision.toLowerCase()} successfully.`);
      await loadRefunds();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${decision.toLowerCase()} refund.`);
    }
  }

  const columns: TableColumn<RefundItem>[] = [
    {
      key: "id",
      label: "Refund ID",
      render: (row) => (
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-blue-600" />
          <div>
            <p className="font-semibold text-sm">{row.id}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Order: {row.deliveryId}</p>
          </div>
        </div>
      ),
    },
    { key: "customer", label: "Customer Name", render: (row) => row.customerName },
    { key: "reason", label: "Refund Reason", render: (row) => <p className="text-xs max-w-xs">{row.reason}</p> },
    {
      key: "amount",
      label: "Refund Amount",
      render: (row) => <span className="font-bold text-sm">₦{row.amount.toLocaleString()}</span>,
    },
    { key: "status", label: "Status", render: (row) => <Badge>{row.status}</Badge> },
    { key: "date", label: "Requested", render: (row) => formatBackendDate(row.requestedAt) },
    {
      key: "actions",
      label: "Actions",
      render: (row) =>
        row.status === "Pending" ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="h-8 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => handleDecision(row.id, "Approved")}
            >
              <Check className="h-3.5 w-3.5 mr-1" /> Approve
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-8 px-2 text-xs text-red-600 bg-red-50 hover:bg-red-100"
              onClick={() => handleDecision(row.id, "Rejected")}
            >
              <X className="h-3.5 w-3.5 mr-1" /> Reject
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refunds Management"
        subtitle="Review, approve, and process order cancellations and customer wallet refund requests."
        role="super_admin"
      />

      <Card className="p-5">
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
          emptyMessage="No refund requests in queue."
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
