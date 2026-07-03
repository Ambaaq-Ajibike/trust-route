import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminSupervisorsPage() {
  return (
    <AdminModulePage
      title="Supervisors"
      subtitle="Manage supervisor coverage, workload, and account access."
      metrics={[
        { label: "Active supervisors", value: "14", detail: "Across 5 cities" },
        { label: "Review load", value: "38", detail: "Assigned applications" },
        { label: "Open escalations", value: "3", detail: "Need admin follow-up" },
        { label: "Suspended", value: "1", detail: "Access disabled" },
      ]}
      workItems={[
        { title: "Amina Bello", detail: "Lagos supervisor with 8 rider applications and 3 open issues." },
        { title: "Gbenga Adeyemi", detail: "Ibadan supervisor with 5 rider applications pending review." },
        { title: "Hauwa Musa", detail: "Abuja supervisor with 2 escalations assigned." },
      ]}
    />
  );
}
