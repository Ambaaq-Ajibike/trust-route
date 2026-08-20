import { encryptedApiRequest } from "@/lib/api-client";
import type { NotificationItem, NotificationPriority } from "./types";

export * from "./types";

type BackendNotificationResponse = {
  id?: string;
  category?: string;
  priority?: string;
  message?: string;
  title?: string;
  link?: string;
  isRead?: boolean;
  read?: boolean;
  createdOn?: string;
  createdAt?: string;
};

type BackendPagedNotifications = {
  items?: BackendNotificationResponse[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

function mapNotification(row: BackendNotificationResponse): NotificationItem {
  const category = (row.category || "Security") as NotificationItem["category"];
  const priority = (row.priority || "Medium") as NotificationPriority;
  const title = row.title || `${category} Alert`;

  return {
    id: row.id ?? "",
    title,
    message: row.message ?? "",
    priority,
    createdAt: row.createdOn ?? row.createdAt ?? new Date().toISOString(),
    read: Boolean(row.isRead ?? row.read),
    category,
  };
}

export const httpNotificationsApi = {
  async list(): Promise<NotificationItem[]> {
    try {
      const raw = await encryptedApiRequest<BackendPagedNotifications | BackendNotificationResponse[]>(
        "/Notifications/List",
        {
          PageNumber: 1,
          PageSize: 50,
        },
      );

      if (Array.isArray(raw)) {
        return raw.map(mapNotification);
      }

      if (raw && typeof raw === "object" && Array.isArray((raw as BackendPagedNotifications).items)) {
        return ((raw as BackendPagedNotifications).items ?? []).map(mapNotification);
      }

      return [];
    } catch {
      return [];
    }
  },
};
