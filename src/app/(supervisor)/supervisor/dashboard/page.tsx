"use client";

import { AlertTriangle, Bike, ClipboardCheck, FileSearch } from "lucide-react";
import { Card } from "@/components/common/Card";
import { MetricCard } from "@/components/common/MetricCard";
import { PageHeader } from "@/components/common/PageHeader";
import { MiniLineChart } from "@/components/dashboard/MiniLineChart";
import { QueueDonut } from "@/components/dashboard/QueueDonut";
import { RiderApplicationsClient } from "@/components/riders/RiderApplicationsClient";
import { mockStore } from "@/lib/mock-store";
import { useAuth } from "@/providers/AuthProvider";

const focusItems = [
  {
    icon: ClipboardCheck,
    title: "Review queue",
    value: "8 due today",
    detail: "Prioritize complete files first.",
  },
  {
    icon: FileSearch,
    title: "Document quality",
    value: "18% unclear",
    detail: "NIN slips need the most rechecks.",
  },
  {
    icon: Bike,
    title: "Rider coverage",
    value: "24 assigned",
    detail: "3 riders have open issues.",
  },
  {
    icon: AlertTriangle,
    title: "Escalations",
    value: "3 open",
    detail: "1 high priority item pending.",
  },
];

export default function SupervisorDashboardPage() {
  const { session } = useAuth();
  const metrics = mockStore.dashboardMetrics("supervisor");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervisor dashboard"
        subtitle="Review rider applications, monitor assigned riders, and handle issues from one work queue."
        role={session?.user.role}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pending applications" value={String(metrics.pendingApplications)} detail="Need supervisor action" />
        <MetricCard label="Assigned riders" value={String(metrics.assignedRiders)} detail="Under your coverage" />
        <MetricCard label="Open issues" value={String(metrics.openIssues)} detail="Require follow-up" />
        <MetricCard label="Active reviews" value={String(metrics.activeReviews)} detail="In progress now" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <MiniLineChart />
        <QueueDonut />
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
