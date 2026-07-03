"use client";

import Link from "next/link";
import { Activity, CircleDollarSign, ShieldCheck } from "lucide-react";
import { AdminApprovalDonut } from "@/components/admin/AdminApprovalDonut";
import { AdminDeliveryMix } from "@/components/admin/AdminDeliveryMix";
import { AdminRevenueChart } from "@/components/admin/AdminRevenueChart";
import { Card } from "@/components/common/Card";
import { MetricCard } from "@/components/common/MetricCard";
import { PageHeader } from "@/components/common/PageHeader";
import { RiderApplicationsClient } from "@/components/riders/RiderApplicationsClient";
import { routes } from "@/config/routes";
import { mockStore } from "@/lib/mock-store";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const metrics = mockStore.dashboardMetrics("admin");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin dashboard"
        subtitle="Operate the platform, monitor finance, and handle escalations."
        role={session?.user.role}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Active deliveries" value={String(metrics.activeDeliveries)} />
        <MetricCard label="Pending approvals" value={String(metrics.pendingApprovals)} />
        <MetricCard label="Open disputes" value={String(metrics.openDisputes)} />
        <MetricCard label="Pending payouts" value={String(metrics.pendingPayouts)} />
        <MetricCard label="Daily revenue" value={String(metrics.dailyRevenue)} />
        <MetricCard label="Commission" value={String(metrics.commission)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <AdminRevenueChart />
        <AdminApprovalDonut />
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <AdminDeliveryMix />
        <Card className="p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Platform health</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              High-level signals for daily admin monitoring.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Activity, label: "Fulfillment rate", value: "94%", detail: "+3.2% from yesterday" },
              { icon: ShieldCheck, label: "Verified riders", value: "312", detail: "18 waiting for final review" },
              { icon: CircleDollarSign, label: "Settlement health", value: "98%", detail: "9 payout checks pending" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl bg-[var(--surface-muted)] p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface)] text-[var(--color-accent)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-5 text-sm font-medium text-[var(--muted-foreground)]">{item.label}</div>
                  <div className="mt-1 text-2xl font-semibold">{item.value}</div>
                  <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { href: routes.adminApprovals, title: "Rider approvals", detail: "Final decisions for supervisor-cleared applications." },
          { href: routes.adminRiders, title: "Rider directory", detail: "Inspect active, suspended, rejected, and review-state riders." },
          { href: routes.notifications, title: "Notifications", detail: "Operational alerts from rider, delivery, finance, and security events." },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="group">
            <Card className="h-full p-5 transition group-hover:border-[var(--color-accent)] group-hover:bg-[var(--surface-muted)]">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{item.detail}</p>
            </Card>
          </Link>
        ))}
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Final approval queue</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Paginated rider applications that need admin-level approval or rejection.
          </p>
        </div>
        <RiderApplicationsClient scope="admin" />
      </section>
    </div>
  );
}
