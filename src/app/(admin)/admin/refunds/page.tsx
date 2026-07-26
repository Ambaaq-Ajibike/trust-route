import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminRefundsPage() {
  return (
    <AdminModulePage
      title="Refunds"
      subtitle="Review refund requests connected to failed or disputed deliveries."
      metrics={[
        { label: "Pending", value: "5", detail: "Awaiting admin decision" },
        { label: "Approved today", value: "7", detail: "Queued for settlement" },
        { label: "Rejected today", value: "2", detail: "Evidence insufficient" },
        { label: "Value pending", value: "₦42,800", detail: "Mock finance total" },
      ]}
      workItems={[
        { title: "Refund RF-219", detail: "Sender requested full refund after cancelled pickup." },
        { title: "Refund RF-214", detail: "Partial refund requested after delayed delivery." },
        { title: "Refund RF-207", detail: "Dispute-linked request needs support notes." },
      ]}
    />
  );
}
