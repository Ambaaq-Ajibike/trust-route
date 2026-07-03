import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminTransactionsPage() {
  return (
    <AdminModulePage
      title="Finance"
      subtitle="Track delivery payments, commissions, payouts, and settlement exceptions."
      metrics={[
        { label: "Daily revenue", value: "₦124,580", detail: "Gross delivery value" },
        { label: "Commission", value: "₦26,840", detail: "Platform share" },
        { label: "Pending payouts", value: "9", detail: "Rider settlement queue" },
        { label: "Failed payments", value: "2", detail: "Need retry or support" },
      ]}
      workItems={[
        { title: "Payout batch PB-104", detail: "Nine rider payouts need finance review." },
        { title: "Transaction TX-8812", detail: "Payment captured but delivery was cancelled." },
        { title: "Commission report", detail: "Weekly commission reconciliation is ready for export." },
      ]}
    />
  );
}
