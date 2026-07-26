import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminDeliveriesPage() {
  return (
    <AdminModulePage
      title="Deliveries"
      subtitle="Monitor delivery movement, exceptions, and completion evidence."
      metrics={[
        { label: "Active", value: "41", detail: "Currently moving" },
        { label: "Awaiting pickup", value: "28", detail: "Rider assigned" },
        { label: "Completed today", value: "76", detail: "Proof captured" },
        { label: "Exceptions", value: "4", detail: "Need support action" },
      ]}
      workItems={[
        { title: "DLV-8842 late pickup", detail: "Pickup window exceeded by 42 minutes." },
        { title: "DLV-8791 receiver unavailable", detail: "Receiver code was not confirmed at handoff." },
        { title: "DLV-8720 proof check", detail: "Package photo quality is low and needs inspection." },
      ]}
    />
  );
}
