import { Badge } from "./Badge";

export function StatusBadge({ label }: { label: string }) {
  return (
    <Badge className="border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]">
      {label}
    </Badge>
  );
}
