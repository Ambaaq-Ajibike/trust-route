"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Bike, ClipboardCheck, FileSearch } from "lucide-react";
import { Card } from "@/components/common/Card";
import { MetricCard } from "@/components/common/MetricCard";
import { PageHeader } from "@/components/common/PageHeader";
import { RiderApplicationsClient } from "@/components/riders/RiderApplicationsClient";
import { adminApi, type DashboardMetrics } from "@/features/admin/api";
import { useAuth } from "@/providers/AuthProvider";

export default function SupervisorDashboardPage() {
  const { session } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeDeliveries: 0,
    pendingApprovals: 0,
    openDisputes: 0,
    pendingPayouts: 0,
    dailyRevenue: 0,
    commission: 0,
  });

  useEffect(() => {
    let active = true;
    adminApi
      .getDashboard()
      .then((res) => {
        if (active && res) setMetrics(res);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const focusItems = [
    {
      icon: ClipboardCheck,
      title: "Pending applications",
      value: String(metrics.pendingApprovals ?? 0),
      detail: "Prioritize complete files first.",
    },
    {
      icon: FileSearch,
      title: "Active deliveries",
      value: String(metrics.activeDeliveries ?? 0),
      detail: "Live delivery operations.",
    },
    {
      icon: Bike,
      title: "Pending payouts",
      value: String(metrics.pendingPayouts ?? 0),
      detail: "Rider wallet requests.",
    },
    {
      icon: AlertTriangle,
      title: "Escalated disputes",
      value: String(metrics.openDisputes ?? 0),
      detail: "Require follow-up.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervisor dashboard"
        subtitle="Review rider applications, monitor assigned riders, and handle issues from one work queue."
        role={session?.user.role}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pending approvals" value={String(metrics.pendingApprovals ?? 0)} detail="Need supervisor action" />
        <MetricCard label="Active deliveries" value={String(metrics.activeDeliveries ?? 0)} detail="Live operations" />
        <MetricCard label="Open disputes" value={String(metrics.openDisputes ?? 0)} detail="Require follow-up" />
        <MetricCard label="Pending payouts" value={String(metrics.pendingPayouts ?? 0)} detail="Wallet requests" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {focusItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-4">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--color-accent)]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-medium text-[var(--muted-foreground)]">{item.title}</div>
              <div className="mt-1 text-xl font-semibold">{item.value}</div>
              <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">{item.detail}</p>
            </Card>
          );
        })}
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Applications needing attention</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Recent rider submissions and files currently assigned to your queue.
          </p>
        </div>
        <RiderApplicationsClient scope="supervisor" />
      </section>
    </div>
  );
}
