import { PageHeader } from "@/components/common/PageHeader";
import { RiderApplicationsClient } from "@/components/riders/RiderApplicationsClient";

export default function AdminRiderApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rider approvals"
        subtitle="Review supervisor-cleared rider applications and make the final activation decision."
      />
      <RiderApplicationsClient scope="admin" />
    </div>
  );
}
