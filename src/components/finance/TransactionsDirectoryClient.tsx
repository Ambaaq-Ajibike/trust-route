"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, Search } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { NotIntegratedBanner } from "@/components/common/NotIntegratedBanner";
import { PageHeader } from "@/components/common/PageHeader";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { transactionsApi, type TransactionItem } from "@/features/transactions/api";
import { formatBackendDate } from "@/lib/date-format";

export function TransactionsDirectoryClient() {
  const [rows, setRows] = useState<TransactionItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await transactionsApi.list({ page, pageSize, search });
      setRows(res.items ?? []);
      setTotal(res.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load transaction log.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const isNotIntegrated =
    error && (error.includes("404") || error.toLowerCase().includes("not found") || error.includes("501"));

  const columns: TableColumn<TransactionItem>[] = [
    {
      key: "ref",
      label: "Reference / Txn ID",
      render: (row) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-blue-600" />
          <div>
            <p className="font-semibold text-sm">{row.reference || row.id}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{row.gatewayReference || "Direct Wallet"}</p>
          </div>
        </div>
      ),
    },
    { key: "user", label: "User Email", render: (row) => row.userEmail || "—" },
    { key: "type", label: "Type", render: (row) => <Badge>{row.type}</Badge> },
    {
      key: "amount",
      label: "Amount",
      render: (row) => (
        <span className="font-bold text-sm">
          ₦{row.amount.toLocaleString()} <span className="text-xs font-normal text-[var(--muted-foreground)]">{row.currency}</span>
        </span>
      ),
    },
    { key: "status", label: "Status", render: (row) => <Badge>{row.status}</Badge> },
    { key: "date", label: "Timestamp", render: (row) => formatBackendDate(row.createdOn) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Transactions"
        subtitle="Platform payment transactions, gateway logs, and rider wallet settlements."
        role="super_admin"
      />

      {isNotIntegrated ? (
        <NotIntegratedBanner
          featureName="Payment Transactions"
          endpoint="POST /api/Transactions/List"
        />
      ) : (
        <Card className="p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Search by transaction reference or email..."
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
            emptyMessage="No transaction logs found."
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
