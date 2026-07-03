import { Card } from "./Card";

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Card className="p-6 text-sm text-[var(--muted-foreground)]">
      <div className="font-medium text-[var(--foreground)]">{title}</div>
      <div className="mt-1">{message}</div>
    </Card>
  );
}
