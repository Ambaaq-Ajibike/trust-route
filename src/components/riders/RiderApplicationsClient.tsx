"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RiderDetailModal } from "@/components/riders/RiderDetailModal";
import { ridersApi } from "@/features/riders/api";
import type { ReviewScope, RiderReviewAction, RiderReviewRecord } from "@/features/riders/types";
import { formatBackendDate } from "@/lib/date-format";

export function RiderApplicationsClient({ scope }: { scope: ReviewScope }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selected, setSelected] = useState<RiderReviewRecord | null>(null);

  const query = useQuery({
    queryKey: ["rider-applications", scope, page, pageSize],
    queryFn: () => ridersApi.listApplications({ page, pageSize }, scope),
  });

  const review = useMutation({
    mutationFn: ({ id, action }: { id: string; action: RiderReviewAction }) =>
      ridersApi.reviewApplication(id, action, scope),
    onSuccess: async () => {
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ["rider-applications", scope] });
      toast.success("Rider application decision saved.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to review the rider application.");
    },
  });

  const columns: TableColumn<RiderReviewRecord>[] = [
    {
      key: "id",
      label: "Application",
      render: (row) => (
        <div>
          <div className="font-semibold">{row.id}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{formatBackendDate(row.submittedAt)}</div>
        </div>
      ),
    },
    {
      key: "name",
      label: "Applicant",
      render: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{row.email}</div>
        </div>
      ),
    },
    { key: "vehicle", label: "Vehicle", render: (row) => `${row.vehicle.type} - ${row.vehicle.plateNumber}` },
    { key: "city", label: "City", render: (row) => row.city },
    {
      key: "documents",
      label: "Docs",
      render: (row) => `${row.documents.filter((item) => item.verified).length}/${row.documents.length}`,
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge label={row.status} /> },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <Button type="button" variant="secondary" className="h-9 px-3" onClick={() => setSelected(row)}>
          <Eye className="h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <PaginatedDataTable
        columns={columns}
        rows={query.data?.rows ?? []}
        getRowId={(row) => row.id}
        page={page}
        pageSize={pageSize}
        total={query.data?.total ?? 0}
        loading={query.isLoading}
        emptyMessage="No rider applications are in this queue."
        onPageChange={setPage}
        onPageSizeChange={(nextPageSize) => {
          setPage(1);
          setPageSize(nextPageSize);
        }}
      />
      <RiderDetailModal
        rider={selected}
        title={scope === "admin" ? "Final rider approval" : "Rider application review"}
        busy={review.isPending}
        busyAction={review.variables?.action}
        onClose={() => setSelected(null)}
        onAction={(action) => {
          if (selected) {
            review.mutate({ id: selected.id, action });
          }
        }}
      />
    </>
  );
}
