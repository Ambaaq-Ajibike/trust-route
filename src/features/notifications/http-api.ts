import { apiRequest } from "@/lib/api-client";
import type { NotificationItem } from "./types";

export const httpNotificationsApi = {
  list() {
    return apiRequest<NotificationItem[]>("/notifications");
  },
};
