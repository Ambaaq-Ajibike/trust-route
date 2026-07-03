import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminPayoutsPage() {
  return (
    <AdminModulePage
      title="Payouts"
      subtitle="Review rider payout requests and settlement readiness."
      metrics={[
        { label: "Pending payouts", value: "9", detail: "Awaiting approval" },
        { label: "Approved today", value: "18", detail: "Ready for settlement" },
        { label: "Held", value: "2", detail: "Compliance review" },
        { label: "Pending value", value: "₦318,000", detail: "Mock payout total" },
      ]}
      workItems={[
        { title: "RID-3381 payout", detail: "Available balance cleared for weekly payout." },
        { title: "RID-3279 hold", detail: "Payout held because rider is under review." },
        { title: "Settlement batch", detail: "Next payout batch closes at 17:00." },
      ]}
    />
  );
}
