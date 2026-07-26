import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminCommissionsPage() {
  return (
    <AdminModulePage
      title="Commissions"
      subtitle="Inspect platform commission totals and reconciliation status."
      metrics={[
        { label: "Today", value: "₦26,840", detail: "Platform commission" },
        { label: "This week", value: "₦172,400", detail: "Mock weekly total" },
        { label: "Adjustments", value: "3", detail: "Refund-linked changes" },
        { label: "Reconciled", value: "96%", detail: "Current finance batch" },
      ]}
      workItems={[
        { title: "Weekly commission report", detail: "Ready for finance export." },
        { title: "Refund adjustment", detail: "Three commissions were reduced after approved refunds." },
        { title: "City split", detail: "Lagos produced 61% of commission today." },
      ]}
    />
  );
}
