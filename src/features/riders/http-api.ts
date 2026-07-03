import { apiRequest } from "@/lib/api-client";
import type {
  PaginatedResponse,
  PaginationQuery,
  ReviewScope,
  RiderReviewAction,
  RiderReviewRecord,
} from "./types";

const params = (query: PaginationQuery, scope: ReviewScope) =>
  new URLSearchParams({
    page: String(query.page),
    page_size: String(query.pageSize),
    scope,
  }).toString();

export const httpRidersApi = {
  listApplications(query: PaginationQuery, scope: ReviewScope) {
    return apiRequest<PaginatedResponse<RiderReviewRecord>>(
      `/rider-applications?${params(query, scope)}`,
    );
  },

  listAssignedRiders(query: PaginationQuery, scope: ReviewScope) {
    return apiRequest<PaginatedResponse<RiderReviewRecord>>(
      `/riders/assigned?${params(query, scope)}`,
    );
  },

  reviewApplication(id: string, action: RiderReviewAction, scope: ReviewScope) {
    return apiRequest<RiderReviewRecord>(`/rider-applications/${id}/review`, {
      method: "POST",
      body: JSON.stringify({ action, scope }),
    });
  },

  reviewAssignedRider(id: string, action: RiderReviewAction, scope: ReviewScope) {
    return apiRequest<RiderReviewRecord>(`/riders/${id}/review`, {
      method: "POST",
      body: JSON.stringify({ action, scope }),
    });
  },
};
