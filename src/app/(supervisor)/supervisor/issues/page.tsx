import { PageHeader } from "@/components/common/PageHeader";
import { RiderIssuesClient } from "@/components/issues/RiderIssuesClient";

export default function RiderIssuesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rider issues"
        subtitle="Track complaints, document rechecks, late pickups, and rider incidents assigned to your review area."
        role="supervisor"
      />
      <RiderIssuesClient />
    </div>
  );
}
