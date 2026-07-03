import { Card } from "@/components/common/Card";
import { MetricCard } from "@/components/common/MetricCard";
import { PageHeader } from "@/components/common/PageHeader";
import { readStoredSession } from "@/lib/auth-session";
import { mockStore } from "@/lib/mock-store";

export default function AuthDashboardPage() {
  const session = readStoredSession();
  const metrics = mockStore.dashboardMetrics(session?.user.role ?? "supervisor");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Operational overview of the platform."
        role={session?.user.role}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(metrics).map(([key, value]) => (
          <MetricCard
            key={key}
            label={key.replaceAll(/([A-Z])/g, " $1").trim()}
            value={String(value)}
          />
        ))}
      </div>
      <Card className="p-6">
        <div className="text-sm font-medium">Backend adapter</div>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          The app is currently running against the mock backend. When the real API
          is ready, only the environment switch changes.
        </p>
      </Card>
    </div>
  );
}
