"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { NotIntegratedBanner } from "@/components/common/NotIntegratedBanner";
import { PageHeader } from "@/components/common/PageHeader";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { payoutsApi, type PayoutItem } from "@/features/payouts/api";
import { formatBackendDate } from "@/lib/date-format";

export function PayoutsDirectoryClient() {
  const [rows, setRows] = useState<PayoutItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await payoutsApi.list({ page, pageSize });
      setRows(res.items ?? []);
      setTotal(res.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load payouts queue.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void loadPayouts();
  }, [loadPayouts]);

  const isNotIntegrated =
    error && (error.includes("404") || error.toLowerCase().includes("not found") || error.includes("501"));

  async function handleDecision(id: string, decision: "Approved" | "Rejected") {
    try {
      await payoutsApi.decidePayout(id, decision);
      toast.success(`Payout ${decision.toLowerCase()} successfully.`);
      await loadPayouts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${decision.toLowerCase()} payout.`);
    }
  }

  const columns: TableColumn<PayoutItem>[] = [
    {
      key: "rider",
      label: "Rider",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-emerald-600" />
          <div>
            <p className="font-semibold text-sm">{row.riderName}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{row.riderEmail || row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "bank",
      label: "Bank Account",
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.bankName}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{row.accountNumber}</p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Payout Amount",
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
        title="Rider Payout Queue"
        subtitle="Review, approve, and process rider wallet withdrawal requests."
        role="super_admin"
      />

      {isNotIntegrated ? (
        <NotIntegratedBanner
          featureName="Rider Payout Queue"
          endpoint="POST /api/Payouts/List"
        />
      ) : (
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
            emptyMessage="No payout requests in queue."
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
