"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import type { Role } from "@/config/permissions";
import { AppShell } from "./AppShell";
import { useAuth } from "@/providers/AuthProvider";

const titles: Record<string, string> = {
  [routes.login]: "Sign in",
  [routes.forgotPassword]: "Forgot password",
  [routes.resetPassword]: "Reset password",
  [routes.profile]: "Account",
  [routes.changePassword]: "Change password",
  [routes.notifications]: "Notifications",
  [routes.supervisorDashboard]: "Supervisor dashboard",
  [routes.supervisorApplications]: "Rider applications",
  [routes.supervisorRiders]: "Assigned riders",
  [routes.supervisorIssues]: "Rider issues",
  [routes.adminDashboard]: "Admin dashboard",
  [routes.adminSupervisors]: "Supervisors",
  [routes.adminApprovals]: "Rider approvals",
  [routes.adminUsers]: "Users",
  [routes.adminRiders]: "Riders",
  [routes.adminDeliveries]: "Deliveries",
  [routes.adminDisputes]: "Disputes",
  [routes.adminRefunds]: "Refunds",
  [routes.adminTransactions]: "Finance",
  [routes.adminPayouts]: "Payouts",
  [routes.adminCommissions]: "Commissions",
  [routes.adminAnalytics]: "Analytics",
  [routes.adminAuditLogs]: "Audit logs",
};

export function AuthenticatedShell({
  children,
  forcedRole,
}: {
  children: React.ReactNode;
  forcedRole?: Role;
}) {
  const { session, isHydrating } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    if (isHydrating || !session) {
      router.replace(routes.login);
      return;
    }

    if (forcedRole && session.user.role !== forcedRole) {
      router.replace(
        session.user.role === "supervisor"
          ? routes.supervisorDashboard
          : routes.adminDashboard,
      );
    }
  }, [forcedRole, isHydrating, router, session]);

  if (isHydrating || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-sm text-[var(--muted-foreground)]">
        Loading session...
      </div>
    );
  }

  const title = titles[pathname] ?? "Dashboard";
  return (
    <AppShell role={session.user.role} title={title}>
      {children}
    </AppShell>
  );
}
