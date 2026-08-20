"use client";

import { useEffect, useState } from "react";
import { adminApi, type NamedValue } from "@/features/admin/api";

export function AdminApprovalDonut() {
  const [data, setData] = useState<NamedValue[]>([]);

  useEffect(() => {
    let active = true;
    adminApi
      .getApprovalQueue()
      .then((res) => {
        if (active && res && res.length > 0) setData(res);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 25;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-semibold">Review workload</h2>
      <p className="text-sm text-[var(--muted-foreground)]">Queues waiting for admin decisions.</p>

      <div className="mt-5 grid place-items-center">
        <div className="relative">
          <svg viewBox="0 0 140 140" className="h-44 w-44 -rotate-90" role="img" aria-label="Admin review workload donut chart">
            <circle cx="70" cy="70" r="48" fill="none" stroke="var(--surface-muted)" strokeWidth="20" />
            {data.map((item) => {
              const dash = total > 0 ? (item.value / total) * 302 : 0;
              const segment = (
                <circle
                  key={item.label}
                  cx="70"
                  cy="70"
                  r="48"
                  fill="none"
                  stroke={item.color || "#0f766e"}
                  strokeWidth="20"
                  strokeDasharray={`${dash} 302`}
                  strokeDashoffset={-offset}
                />
              );
              offset += dash;
              return segment;
            })}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-2xl font-semibold">{total}</div>
              <div className="text-xs text-[var(--muted-foreground)]">open items</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-[var(--muted-foreground)]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color || "#0f766e" }} />
              {item.label}
            </span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
