"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, CheckCircle, DollarSign, Package, Users } from "lucide-react";
import { Card } from "@/components/common/Card";
import { PageHeader } from "@/components/common/PageHeader";
import { analyticsApi, type AnalyticsOverview } from "@/features/analytics/api";

export function AnalyticsOverviewClient() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await analyticsApi.getOverview();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load analytics overview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        subtitle="Operational performance metrics, delivery fulfillment, revenue, and active platform utilization."
        role="super_admin"
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--muted-foreground)]">
          Loading analytics metrics...
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Total Deliveries</p>
                <p className="text-xl font-bold">{data.totalDeliveries.toLocaleString()}</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Fulfilled Orders</p>
                <p className="text-xl font-bold">{data.successfulDeliveries.toLocaleString()}</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Gross Revenue</p>
                <p className="text-xl font-bold">₦{data.totalRevenue.toLocaleString()}</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Platform Commissions</p>
                <p className="text-xl font-bold">₦{data.totalCommissions.toLocaleString()}</p>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Rider Fleet Utilization</h3>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{data.activeRidersCount}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Active riders currently taking orders</p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Active Customer Base</h3>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold">{data.activeCustomersCount}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Active senders creating orders</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
