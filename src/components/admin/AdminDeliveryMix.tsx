import { deliveryMix } from "@/features/admin/mock-data";

export function AdminDeliveryMix() {
  const max = Math.max(...deliveryMix.map((item) => item.value));

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-semibold">Delivery mix</h2>
      <p className="text-sm text-[var(--muted-foreground)]">Current operational load by delivery state.</p>

      <div className="mt-6 space-y-4">
        {deliveryMix.map((item) => (
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
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
