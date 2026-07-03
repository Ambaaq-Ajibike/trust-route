import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function AdminAnalyticsPage() {
  return (
    <AdminModulePage
      title="Analytics"
      subtitle="Inspect growth, fulfillment, rider coverage, and finance performance."
      metrics={[
        { label: "Fulfillment", value: "94%", detail: "+3.2% from yesterday" },
        { label: "Repeat senders", value: "38%", detail: "Mock weekly cohort" },
        { label: "Avg. pickup time", value: "18m", detail: "Across active zones" },
        { label: "Rider utilization", value: "71%", detail: "Peak day average" },
      ]}
      workItems={[
        { title: "Lagos growth", detail: "Sender demand is up 12% over the previous week." },
        { title: "Pickup delay cluster", detail: "Lekki and Wuse show above-average pickup delays." },
        { title: "Rider retention", detail: "Active rider retention improved after payout checks were reduced." },
      ]}
    />
  );
}
