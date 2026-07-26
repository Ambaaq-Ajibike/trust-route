import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminUsersPage() {
  return (
    <AdminModulePage
      title="Users"
      subtitle="Review sender, receiver, rider, and staff account activity."
      metrics={[
        { label: "Total users", value: "8,420", detail: "Mock account base" },
        { label: "New today", value: "126", detail: "Sender and rider signups" },
        { label: "Restricted", value: "18", detail: "Policy or security holds" },
        { label: "Support flags", value: "31", detail: "Need review" },
      ]}
      workItems={[
        { title: "Sender account review", detail: "Three accounts triggered duplicate phone checks." },
        { title: "Receiver complaints", detail: "Seven users have unresolved delivery complaints." },
        { title: "Rider role upgrades", detail: "Twelve sender accounts started rider onboarding." },
      ]}
    />
  );
}
