"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell, CircleAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { notificationsApi } from "@/features/notifications/api";
import type { NotificationItem } from "@/features/notifications/types";
import { formatBackendDate } from "@/lib/date-format";

export function NotificationsClient() {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list(),
  });

  const rawData = query.data;
  const items: NotificationItem[] = Array.isArray(rawData)
    ? rawData
    : (rawData as { items?: NotificationItem[] } | undefined)?.items ?? [];

  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Operational alerts from rider review, delivery exceptions, finance, and account security."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--color-accent)]">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-semibold">{items.length}</div>
              <div className="text-sm text-[var(--muted-foreground)]">Total alerts</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface-muted)] text-[#b42318]">
              <CircleAlert className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-semibold">{unreadCount}</div>
              <div className="text-sm text-[var(--muted-foreground)]">Unread</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface-muted)] text-[#0f766e]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-semibold">Live</div>
              <div className="text-sm text-[var(--muted-foreground)]">Realtime feed</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {query.isLoading ? (
            <div className="p-6 text-sm text-[var(--muted-foreground)]">Loading notifications...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">
              No notifications found.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id || Math.random().toString()}
                className="flex flex-col gap-3 p-5 transition hover:bg-[var(--surface-muted)] md:flex-row md:items-start md:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {!item.read && <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
                    <h2 className="font-semibold">{item.title}</h2>
                    <Badge className="border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-foreground)]">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.message}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge label={item.priority} />
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {formatBackendDate(item.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
