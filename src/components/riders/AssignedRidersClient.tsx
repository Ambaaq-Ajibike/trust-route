"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RiderDetailModal } from "@/components/riders/RiderDetailModal";
import { ridersApi } from "@/features/riders/api";
import type { ReviewScope, RiderReviewAction, RiderReviewRecord } from "@/features/riders/types";

export function AssignedRidersClient({ scope }: { scope: ReviewScope }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selected, setSelected] = useState<RiderReviewRecord | null>(null);

  const query = useQuery({
    queryKey: ["assigned-riders", scope, page, pageSize],
    queryFn: () => ridersApi.listAssignedRiders({ page, pageSize }, scope),
  });

  const review = useMutation({
    mutationFn: ({ id, action }: { id: string; action: RiderReviewAction }) =>
      ridersApi.reviewAssignedRider(id, action, scope),
    onSuccess: async () => {
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ["assigned-riders", scope] });
    },
  });

  const columns: TableColumn<RiderReviewRecord>[] = [
    {
      key: "rider",
      label: "Rider",
      render: (row) => (
        <div>
          <div className="font-semibold">{row.name}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{row.id}</div>
        </div>
      ),
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge label={row.status} /> },
    { key: "rating", label: "Rating", render: (row) => row.rating ?? "N/A" },
    { key: "completed", label: "Completed", render: (row) => row.completedDeliveries ?? 0 },
    { key: "issues", label: "Issues", render: (row) => row.activeIssues ?? 0 },
    { key: "lastOnline", label: "Last online", render: (row) => row.lastOnline ?? "N/A" },
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
        emptyMessage="No assigned riders found."
        onPageChange={setPage}
        onPageSizeChange={(nextPageSize) => {
          setPage(1);
          setPageSize(nextPageSize);
        }}
      />
      <RiderDetailModal
        rider={selected}
        title="Assigned rider details"
        busy={review.isPending}
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
