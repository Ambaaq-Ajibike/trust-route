import { Button } from "./Button";
import { Card } from "./Card";

export function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="font-medium text-[var(--foreground)]">{title}</div>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{message}</p>
      {onRetry ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
