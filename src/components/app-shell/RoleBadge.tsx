import { Badge } from "@/components/common/Badge";

export function RoleBadge({ role }: { role: string }) {
  return (
    <Badge className="border-[var(--border)] bg-[var(--surface-muted)] capitalize text-[var(--foreground)]">
      {role.replaceAll("_", " ")}
    </Badge>
  );
}
