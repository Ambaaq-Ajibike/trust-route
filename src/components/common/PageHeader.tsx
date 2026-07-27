import { Badge } from "./Badge";

export function PageHeader({
  title,
  subtitle,
  role,
}: {
  title: string;
  subtitle?: string;
  role?: string;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">{subtitle}</p>
        ) : null}
      </div>
      {role ? <Badge className="w-fit bg-[var(--surface-muted)]">{role}</Badge> : null}
    </div>
  );
}
