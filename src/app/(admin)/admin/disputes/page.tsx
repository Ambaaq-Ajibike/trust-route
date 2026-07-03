import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminDisputesPage() {
  return (
    <AdminModulePage
      title="Disputes"
      subtitle="Resolve sender, receiver, and rider delivery disputes."
      metrics={[
        { label: "Open disputes", value: "4", detail: "Across active cities" },
        { label: "High priority", value: "1", detail: "Admin decision needed" },
        { label: "Resolved today", value: "9", detail: "Support completed" },
        { label: "Refund linked", value: "3", detail: "Finance review" },
      ]}
      workItems={[
        { title: "Package condition dispute", detail: "Sender claims package arrived damaged." },
        { title: "Delivery proof dispute", detail: "Receiver says package was left with security." },
        { title: "Fare adjustment dispute", detail: "Rider requested distance-based review." },
      ]}
    />
  );
}
