"use client";

import { useCallback, useEffect, useState } from "react";
import { Percent } from "lucide-react";
import { Card } from "@/components/common/Card";
import { PageHeader } from "@/components/common/PageHeader";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { commissionsApi, type CommissionItem } from "@/features/commissions/api";
import { formatBackendDate } from "@/lib/date-format";

export function CommissionsDirectoryClient() {
  const [rows, setRows] = useState<CommissionItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCommissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await commissionsApi.list({ page, pageSize });
      setRows(res.items ?? []);
      setTotal(res.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load commissions summary.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void loadCommissions();
  }, [loadCommissions]);

  const columns: TableColumn<CommissionItem>[] = [
    {
      key: "id",
      label: "Commission Ref",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 text-[var(--primary)]" />
          <div>
            <p className="font-semibold text-sm">{row.id}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Order: {row.deliveryId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "orderAmount",
      label: "Gross Order Fee",
      render: (row) => <span className="font-semibold text-sm">₦{row.orderAmount.toLocaleString()}</span>,
    },
    {
      key: "rate",
      label: "Commission Rate",
      render: (row) => <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">{row.ratePercent}%</span>,
    },
    {
      key: "platformFee",
      label: "Platform Earnings",
      render: (row) => <span className="font-bold text-sm text-emerald-600">₦{row.commissionFee.toLocaleString()}</span>,
    },
    {
      key: "riderEarnings",
      label: "Rider Payout Share",
      render: (row) => <span className="font-medium text-sm">₦{row.riderEarnings.toLocaleString()}</span>,
    },
    { key: "date", label: "Date", render: (row) => formatBackendDate(row.createdOn) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Commissions"
        subtitle="Track platform commission rates, system fee splits, and rider earnings."
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
          emptyMessage="No commission records found."
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
