export type NotificationPriority = "High" | "Medium" | "Low";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  createdAt: string;
  read: boolean;
  category: "Rider Review" | "Delivery" | "Finance" | "Security";
};
