import { mockDelay } from "@/lib/mock-delay";
import type { IssuePaginationQuery, RiderIssue, RiderIssueStatus } from "./types";

let issues: RiderIssue[] = [
  {
    id: "ISS-410",
    rider: "Fatima Lawal",
    riderId: "RID-3314",
    type: "Late pickup",
    priority: "Medium",
    status: "Open",
    reported: "36 min ago",
    summary: "Sender reported pickup started 42 minutes after the accepted pickup window.",
  },
  {
    id: "ISS-398",
    rider: "Emeka Nwosu",
    riderId: "RID-3279",
    type: "Document recheck",
    priority: "High",
    status: "Under Review",
    reported: "Today, 10:21",
    summary: "Rider profile was flagged because a document image was unclear during a compliance sweep.",
  },
  {
    id: "ISS-381",
    rider: "Tunde Salami",
    riderId: "RID-3381",
    type: "Receiver complaint",
    priority: "Low",
    status: "Resolved",
    reported: "Jul 2, 15:44",
    summary: "Receiver reported delayed handoff confirmation. Supervisor confirmed proof trail was complete.",
  },
  {
    id: "ISS-377",
    rider: "Blessing Musa",
    riderId: "RID-3251",
    type: "Package photo missing",
    priority: "High",
    status: "Escalated",
    reported: "Jul 1, 09:12",
    summary: "Delivery was completed without pickup photo evidence. Admin review requested.",
  },
];

function paginate(query: IssuePaginationQuery) {
  const start = (query.page - 1) * query.pageSize;
  return {
    rows: issues.slice(start, start + query.pageSize),
    page: query.page,
    pageSize: query.pageSize,
    total: issues.length,
  };
}

export const mockIssuesApi = {
  async list(query: IssuePaginationQuery) {
    await mockDelay(300);
    return paginate(query);
  },

  async updateStatus(id: string, status: RiderIssueStatus) {
    await mockDelay(250);
    issues = issues.map((issue) => (issue.id === id ? { ...issue, status } : issue));
    const issue = issues.find((item) => item.id === id);
    if (!issue) {
      throw new Error("Issue not found.");
    }
    return issue;
  },
};
