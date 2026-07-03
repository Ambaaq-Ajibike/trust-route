"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export type TableColumn<T> = {
  key: string;
  label: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

export function PaginatedDataTable<T>({
  columns,
  rows,
  getRowId,
  page,
  pageSize,
  total,
  loading,
  emptyMessage = "No records found.",
  onPageChange,
  onPageSizeChange,
}: {
  columns: TableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  page: number;
  pageSize: number;
  total: number;
  loading?: boolean;
  emptyMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={column.className ?? "px-4 py-3 font-medium"}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-[var(--muted-foreground)]">
                  Loading records...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-[var(--muted-foreground)]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={getRowId(row)} className="transition hover:bg-[var(--surface-muted)]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 align-middle">
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--border)] px-4 py-3 text-sm text-[var(--muted-foreground)] md:flex-row md:items-center md:justify-between">
        <div>
          Showing {start}-{end} of {total} records
        </div>
        <div className="flex items-center gap-3">
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] outline-none"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-9 w-9 px-0"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Page {page} of {pageCount}
            </span>
            <Button
              type="button"
              variant="secondary"
              className="h-9 w-9 px-0"
              disabled={page >= pageCount || loading}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
