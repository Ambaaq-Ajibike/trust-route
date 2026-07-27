import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminAuditLogsPage() {
  return (
    <AdminModulePage
      title="Audit logs"
      subtitle="Review privileged admin, supervisor, and finance actions."
      metrics={[
        { label: "Events today", value: "184", detail: "Mock audit stream" },
        { label: "Approvals", value: "16", detail: "Rider and refund actions" },
        { label: "Access changes", value: "5", detail: "Role or suspension edits" },
        { label: "Flagged", value: "1", detail: "Needs review" },
      ]}
      workItems={[
        { title: "Admin approved rider RAP-1011", detail: "Final activation action recorded with timestamp and actor." },
        { title: "Supervisor changed issue ISS-398", detail: "Status changed from Open to Under Review." },
        { title: "Finance reviewed payout PB-104", detail: "Batch moved into settlement review." },
      ]}
    />
  );
}
