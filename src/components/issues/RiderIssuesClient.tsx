"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PaginatedDataTable, type TableColumn } from "@/components/common/PaginatedDataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { issuesApi } from "@/features/issues/api";
import type { RiderIssue, RiderIssueStatus } from "@/features/issues/types";

const issueStatuses: RiderIssueStatus[] = ["Open", "Under Review", "Escalated", "Resolved"];

export function RiderIssuesClient() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const query = useQuery({
    queryKey: ["rider-issues", page, pageSize],
    queryFn: () => issuesApi.list({ page, pageSize }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RiderIssueStatus }) =>
      issuesApi.updateStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rider-issues"] });
    },
  });

  const columns: TableColumn<RiderIssue>[] = [
    {
      key: "id",
      label: "Issue",
      render: (row) => (
        <div>
          <div className="font-semibold">{row.id}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{row.reported}</div>
        </div>
      ),
    },
    {
      key: "rider",
      label: "Rider",
      render: (row) => (
        <div>
          <div className="font-medium">{row.rider}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{row.riderId}</div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (row) => (
        <div>
          <div className="font-medium">{row.type}</div>
          <div className="max-w-sm truncate text-xs text-[var(--muted-foreground)]">{row.summary}</div>
        </div>
      ),
    },
    { key: "priority", label: "Priority", render: (row) => <StatusBadge label={row.priority} /> },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status}
          disabled={updateStatus.isPending}
          onChange={(event) =>
            updateStatus.mutate({
              id: row.id,
              status: event.target.value as RiderIssueStatus,
            })
          }
          className="min-w-36 cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium outline-none transition focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {issueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <PaginatedDataTable
      columns={columns}
      rows={query.data?.rows ?? []}
      getRowId={(row) => row.id}
      page={page}
      pageSize={pageSize}
      total={query.data?.total ?? 0}
      loading={query.isLoading}
      emptyMessage="No rider issues found."
      onPageChange={setPage}
      onPageSizeChange={(nextPageSize) => {
        setPage(1);
        setPageSize(nextPageSize);
      }}
    />
  );
}
