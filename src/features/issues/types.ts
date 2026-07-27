export type RiderIssueStatus = "Open" | "Under Review" | "Resolved" | "Escalated";
export type RiderIssuePriority = "High" | "Medium" | "Low";

export type RiderIssue = {
  id: string;
  rider: string;
  riderId: string;
  type: string;
  priority: RiderIssuePriority;
  status: RiderIssueStatus;
  reported: string;
  summary: string;
};

export type IssuePaginationQuery = {
  page: number;
  pageSize: number;
};

export type IssuePaginatedResponse = {
  rows: RiderIssue[];
  page: number;
  pageSize: number;
  total: number;
};
