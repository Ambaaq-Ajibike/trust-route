"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, MapPin, Package, Search, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { PageHeader } from "@/components/common/PageHeader";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { deliveriesApi, type DeliveryItem } from "@/features/deliveries/api";
import { formatBackendDate } from "@/lib/date-format";

export function DeliveriesDirectoryClient() {
  const [rows, setRows] = useState<DeliveryItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await deliveriesApi.list({ page, pageSize, search, status });
      setRows(res.items ?? []);
      setTotal(res.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load delivery directory.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, status]);

  useEffect(() => {
    void loadDeliveries();
  }, [loadDeliveries]);

  const columns: TableColumn<DeliveryItem>[] = [
    {
      key: "id",
      label: "Order Reference",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-[var(--primary)]" />
          <div>
            <p className="font-semibold text-sm">{row.id}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{formatBackendDate(row.createdOn)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "sender",
      label: "Customer / Sender",
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.senderName}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{row.senderPhone || "—"}</p>
        </div>
      ),
    },
    {
      key: "rider",
      label: "Assigned Rider",
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.riderName || "Unassigned"}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{row.riderPhone || "—"}</p>
        </div>
      ),
    },
    {
      key: "route",
      label: "Pickup -> Dropoff",
      render: (row) => (
        <div className="text-xs space-y-1 max-w-xs">
          <p className="truncate"><strong className="text-emerald-600">P:</strong> {row.pickupLocation}</p>
          <p className="truncate"><strong className="text-blue-600">D:</strong> {row.dropoffLocation}</p>
        </div>
      ),
    },
    {
      key: "price",
      label: "Fee",
      render: (row) => <span className="font-semibold text-sm">₦{row.price.toLocaleString()}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <StatusBadge label={row.status} />
          {row.hasException ? (
            <Badge className="bg-red-50 text-red-700 border-red-200">Exception</Badge>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deliveries Directory"
        subtitle="Live tracking and operational management of platform deliveries."
        role="super_admin"
      />

      <Card className="p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search by order ID, customer name, or location..."
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
            <option value="Pending">Pending Bids</option>
            <option value="InTransit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
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
          emptyMessage="No delivery records found."
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
