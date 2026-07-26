"use client";

import {
  BarChart3,
  Bell,
  Bike,
  ClipboardCheck,
  CreditCard,
  FileClock,
  Flag,
  Home,
  PackageCheck,
  Receipt,
  RefreshCcw,
  ShieldAlert,
  UserCog,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrustRouteLogo } from "@/components/common/TrustRouteLogo";
import { Button } from "@/components/common/Button";
import { adminNavigation, supervisorNavigation } from "@/config/navigation";
import type { Role } from "@/config/permissions";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

const icons = {
  [routes.supervisorDashboard]: Home,
  [routes.supervisorApplications]: ClipboardCheck,
  [routes.supervisorRiders]: Bike,
  [routes.supervisorIssues]: ShieldAlert,
  [routes.adminDashboard]: Home,
  [routes.adminSupervisors]: UserCog,
  [routes.adminApprovals]: ClipboardCheck,
  [routes.adminUsers]: Users,
  [routes.adminRiders]: Bike,
  [routes.adminDeliveries]: PackageCheck,
  [routes.adminDisputes]: Flag,
  [routes.adminRefunds]: RefreshCcw,
  [routes.adminTransactions]: CreditCard,
  [routes.adminAnalytics]: BarChart3,
  [routes.adminAuditLogs]: FileClock,
  [routes.notifications]: Bell,
  [routes.profile]: Receipt,
};

export function AppSidebar({
  role,
  mobile = false,
  onClose,
}: {
  role: Role;
  mobile?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const nav = role === "supervisor" ? supervisorNavigation : adminNavigation;

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-[var(--border)] bg-[var(--surface)] px-4 py-6",
        mobile ? "h-full w-72" : "sticky top-0 hidden h-screen w-72 lg:block",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <TrustRouteLogo size="sm" />
        {mobile ? (
          <Button variant="ghost" aria-label="Close navigation" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <nav className="mt-6 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = icons[item.href as keyof typeof icons] ?? Home;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-[var(--surface-muted)] font-medium text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/10",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
