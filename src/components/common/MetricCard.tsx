import { Card } from "./Card";

export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <Card className="p-4">
      <div className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
        {value}
      </div>
      {detail ? <p className="mt-1 text-sm text-[var(--muted-foreground)]">{detail}</p> : null}
    </Card>
  );
}
