import { PageHeader } from "@/components/common/PageHeader";
import { AssignedRidersClient } from "@/components/riders/AssignedRidersClient";

export default function AssignedRidersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned riders"
        subtitle="Monitor rider status, completion history, ratings, active issues, and recent online activity."
        role="supervisor"
      />
      <AssignedRidersClient scope="supervisor" />
    </div>
  );
}
