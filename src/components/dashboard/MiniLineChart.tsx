"use client";

type TrendPoint = {
  day: string;
  approved: number;
  rejected: number;
};

export function MiniLineChart({ data = [] }: { data?: TrendPoint[] }) {
  const width = 520;
  const height = 180;
  const max = Math.max(...data.flatMap((item) => [item.approved, item.rejected]), 10);
  const points = data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * width;
    const y = height - (item.approved / max) * (height - 24) - 12;
    return `${x},${y}`;
  });
  const rejectedPoints = data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * width;
    const y = height - (item.rejected / max) * (height - 24) - 12;
    return `${x},${y}`;
  });

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Review throughput</div>
          <div className="text-xs text-[var(--muted-foreground)]">Approved vs rejected this week</div>
        </div>
        <div className="flex gap-3 text-xs text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />Approved</span>
          <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#f59e0b]" />Rejected</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" role="img" aria-label="Supervisor review line chart">
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="0"
            x2={width}
            y1={(line + 1) * 38}
            y2={(line + 1) * 38}
            stroke="var(--border)"
            strokeDasharray="4 6"
          />
        ))}
        {data.length > 0 ? (
          <>
            <polyline fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points.join(" ")} />
            <polyline fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={rejectedPoints.join(" ")} />
          </>
        ) : null}
      </svg>
      <div className="mt-2 grid grid-cols-5 text-center text-xs text-[var(--muted-foreground)]">
        {data.map((item) => <span key={item.day}>{item.day}</span>)}
      </div>
    </div>
  );
}
