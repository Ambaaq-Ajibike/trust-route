import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { MetricCard } from "@/components/common/MetricCard";
import { PageHeader } from "@/components/common/PageHeader";

export function AdminModulePage({
  title,
  subtitle,
  metrics,
  workItems,
}: {
  title: string;
  subtitle: string;
  metrics: Array<{ label: string; value: string; detail?: string }>;
  workItems: Array<{ title: string; detail: string; href?: string }>;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} role="super_admin" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-[var(--border)] p-5">
          <h2 className="text-lg font-semibold">Work queue</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Operational records are mocked until the backend endpoint is connected.
          </p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {workItems.map((item) => {
            const content = (
              <div className="flex items-center justify-between gap-4 p-5 transition hover:bg-[var(--surface-muted)]">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--color-accent)]">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{item.detail}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
              </div>
            );

            return item.href ? (
              <Link key={item.title} href={item.href}>
                {content}
              </Link>
            ) : (
              <div key={item.title}>{content}</div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
