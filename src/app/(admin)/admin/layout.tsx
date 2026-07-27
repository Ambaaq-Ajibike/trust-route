import { AuthenticatedShell } from "@/components/app-shell/AuthenticatedShell";
import type { Role } from "@/config/permissions";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthenticatedShell forcedRole={"super_admin" as Role}>{children}</AuthenticatedShell>;
}
