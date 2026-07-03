import { StatusBadge } from "@/components/common/StatusBadge";

type Row = Record<string, string | number>;

export function SupervisorTable({
  columns,
  rows,
}: {
  columns: Array<{ key: string; label: string }>;
  rows: Row[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted-foreground)]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rows.map((row) => (
            <tr key={String(row.id)} className="hover:bg-[var(--surface-muted)]">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  {column.key === "status" ? (
                    <StatusBadge label={String(row[column.key])} />
                  ) : (
                    String(row[column.key])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
