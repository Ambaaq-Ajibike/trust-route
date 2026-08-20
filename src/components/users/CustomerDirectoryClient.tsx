"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Search, ShieldAlert, Users, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { PageHeader } from "@/components/common/PageHeader";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { CustomerDetailDrawer } from "@/components/users/CustomerDetailDrawer";
import { usersApi } from "@/features/users/api";
import type { CustomerUser } from "@/features/users/types";
import { formatBackendDate } from "@/lib/date-format";

export function CustomerDirectoryClient({ role }: { role: "super_admin" | "supervisor" }) {
  const [rows, setRows] = useState<CustomerUser[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await usersApi.listCustomers({
        page,
        pageSize,
        search,
        status: statusFilter,
        role: "Customer",
      });
      setRows(res.items ?? []);
      setTotal(res.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load customer directory.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const activeCount = rows.filter((r) => r.status === "Active").length;
  const suspendedCount = rows.filter((r) => r.status === "Suspended").length;
  const flaggedCount = rows.filter((r) => r.hasSupportFlag).length;

  const columns: TableColumn<CustomerUser>[] = [
    {
      key: "name",
      label: "Customer Name",
      render: (row) => (
        <div>
          <p className="font-semibold text-sm">{row.name}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{row.email}</p>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (row) => row.phoneNumber || "—" },
    {
      key: "status",
      label: "Account Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Badge>{row.status}</Badge>
          {row.hasSupportFlag ? (
            <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600 font-medium">
              <ShieldAlert className="h-3 w-3" /> Flagged
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "joined",
      label: "Joined",
      render: (row) => formatBackendDate(row.createdOn),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-3 text-xs"
          onClick={() => setSelectedCustomer(row)}
        >
          <Eye className="h-4 w-4" />
          View Details & Orders
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Directory"
        subtitle="Manage customer accounts, inspect profile details, and review order transactions."
        role={role}
      />

      {/* Metrics Cards Header */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Total Customers</p>
            <p className="text-xl font-bold">{total}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Active Accounts</p>
            <p className="text-xl font-bold">{activeCount}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Suspended</p>
            <p className="text-xl font-bold">{suspendedCount}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Support Flagged</p>
            <p className="text-xl font-bold">{flaggedCount}</p>
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search by customer name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none"
          >
            <option value="">All account statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Restricted">Restricted</option>
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
          emptyMessage="No customer accounts found."
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Card>

      {/* Customer Details & Orders Drawer */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
