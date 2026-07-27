import { mockDelay } from "@/lib/mock-delay";
import type { NotificationItem } from "./types";

const notifications: NotificationItem[] = [
  {
    id: "NTF-1021",
    title: "Rider application needs decision",
    message: "Blessing Musa has passed supervisor review and is waiting for final admin approval.",
    priority: "High",
    createdAt: "8 min ago",
    read: false,
    category: "Rider Review",
  },
  {
    id: "NTF-1018",
    title: "Document re-upload submitted",
    message: "Mariam Yusuf replaced a driver's license file after the previous upload was flagged.",
    priority: "Medium",
    createdAt: "34 min ago",
    read: false,
    category: "Rider Review",
  },
  {
    id: "NTF-1014",
    title: "Late pickup issue opened",
    message: "A sender reported a late pickup for RID-3314 on delivery DLV-8842.",
    priority: "Medium",
    createdAt: "1 hr ago",
    read: true,
    category: "Delivery",
  },
  {
    id: "NTF-1009",
    title: "Payout review threshold reached",
    message: "Nine payout requests are pending finance review for today's batch.",
    priority: "Low",
    createdAt: "Today, 10:05",
    read: true,
    category: "Finance",
  },
  {
    id: "NTF-1002",
    title: "New sign-in detected",
    message: "Your account was used to sign in from a Windows browser session.",
    priority: "Low",
    createdAt: "Yesterday, 18:22",
    read: true,
    category: "Security",
  },
];

export const mockNotificationsApi = {
  async list() {
    await mockDelay(250);
    return notifications;
  },
};
