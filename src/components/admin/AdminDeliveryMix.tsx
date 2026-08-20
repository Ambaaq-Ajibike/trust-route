"use client";

import { useEffect, useState } from "react";
import { adminApi, type NamedValue } from "@/features/admin/api";

export function AdminDeliveryMix() {
  const [data, setData] = useState<NamedValue[]>([]);

  useEffect(() => {
    let active = true;
    adminApi
      .getDeliveryMix()
      .then((res) => {
        if (active && res && res.length > 0) setData(res);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-semibold">Delivery mix</h2>
      <p className="text-sm text-[var(--muted-foreground)]">Current operational load by delivery state.</p>

      <div className="mt-6 space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-[var(--muted-foreground)]">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: item.color || "#0f766e",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
