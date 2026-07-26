import { apiRequest } from "@/lib/api-client";
import type { IssuePaginatedResponse, IssuePaginationQuery, RiderIssue, RiderIssueStatus } from "./types";

export const httpIssuesApi = {
  list(query: IssuePaginationQuery) {
    const params = new URLSearchParams({
      page: String(query.page),
      page_size: String(query.pageSize),
    });
    return apiRequest<IssuePaginatedResponse>(`/rider-issues?${params.toString()}`);
  },

  updateStatus(id: string, status: RiderIssueStatus) {
    return apiRequest<RiderIssue>(`/rider-issues/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
