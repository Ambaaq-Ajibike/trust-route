import { revenueTrend } from "@/features/admin/mock-data";

export function AdminRevenueChart() {
  const width = 680;
  const height = 220;
  const max = Math.max(...revenueTrend.map((item) => item.revenue));
  const revenuePoints = revenueTrend.map((item, index) => {
    const x = (index / (revenueTrend.length - 1)) * width;
    const y = height - (item.revenue / max) * (height - 28) - 14;
    return `${x},${y}`;
  });
  const commissionPoints = revenueTrend.map((item, index) => {
    const x = (index / (revenueTrend.length - 1)) * width;
    const y = height - (item.commission / max) * (height - 28) - 14;
    return `${x},${y}`;
  });
  const areaPoints = `0,${height} ${revenuePoints.join(" ")} ${width},${height}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Revenue trend</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Gross delivery revenue and platform commission over the last 7 days.
          </p>
        </div>
        <div className="flex gap-4 text-xs text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
            Revenue
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
            Commission
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full" role="img" aria-label="Admin revenue trend chart">
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="0"
            x2={width}
            y1={(line + 1) * 44}
            y2={(line + 1) * 44}
            stroke="var(--border)"
            strokeDasharray="4 7"
          />
        ))}
        <polygon points={areaPoints} fill="var(--color-accent)" opacity="0.1" />
        <polyline fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={revenuePoints.join(" ")} />
        <polyline fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={commissionPoints.join(" ")} />
      </svg>
      <div className="mt-2 grid grid-cols-7 text-center text-xs text-[var(--muted-foreground)]">
        {revenueTrend.map((item) => (
          <span key={item.day}>{item.day}</span>
        ))}
      </div>
    </div>
  );
}
