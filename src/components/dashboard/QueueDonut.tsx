"use client";

type QueueItem = {
  label: string;
  value: number;
  color: string;
};

export function QueueDonut({ data = [] }: { data?: QueueItem[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 25;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="text-sm font-semibold">Document health</div>
      <div className="text-xs text-[var(--muted-foreground)]">Completion by required document</div>
      <div className="mt-5 grid place-items-center">
        <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90" role="img" aria-label="Document completion pie chart">
          <circle cx="60" cy="60" r="42" fill="none" stroke="var(--surface-muted)" strokeWidth="18" />
          {data.map((item) => {
            const dash = total > 0 ? (item.value / total) * 264 : 0;
            const segment = (
              <circle
                key={item.label}
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke={item.color}
                strokeWidth="18"
                strokeDasharray={`${dash} 264`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return segment;
          })}
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[var(--muted-foreground)]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
