import { AuthenticatedShell } from "@/components/app-shell/AuthenticatedShell";
import type { Role } from "@/config/permissions";

export default function SupervisorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthenticatedShell forcedRole={"supervisor" as Role}>{children}</AuthenticatedShell>;
}
