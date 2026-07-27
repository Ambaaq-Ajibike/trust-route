import { PageHeader } from "@/components/common/PageHeader";
import { AssignedRidersClient } from "@/components/riders/AssignedRidersClient";

export default function AdminRidersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Riders"
        subtitle="Inspect active, suspended, rejected, and under-review riders with their onboarding evidence."
      />
      <AssignedRidersClient scope="admin" />
    </div>
  );
}
