import { PageHeader } from "@/components/common/PageHeader";
import { RiderApplicationsClient } from "@/components/riders/RiderApplicationsClient";

export default function RiderApplicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rider applications"
        subtitle="Review assigned rider onboarding files, document completeness, vehicle type, and verification status."
        role="supervisor"
      />
      <RiderApplicationsClient scope="supervisor" />
    </div>
  );
}
