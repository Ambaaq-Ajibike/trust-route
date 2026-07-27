import { routes } from "./routes";

export type NavItem = {
  label: string;
  href: string;
};

export const supervisorNavigation: NavItem[] = [
  { label: "Dashboard", href: routes.supervisorDashboard },
  { label: "Rider Applications", href: routes.supervisorApplications },
  { label: "Assigned Riders", href: routes.supervisorRiders },
  { label: "Issues", href: routes.supervisorIssues },
  { label: "Notifications", href: routes.notifications },
  { label: "Profile", href: routes.profile },
];

export const adminNavigation: NavItem[] = [
  { label: "Dashboard", href: routes.adminDashboard },
  { label: "Supervisors", href: routes.adminSupervisors },
  { label: "Rider Approvals", href: routes.adminApprovals },
  { label: "Users", href: routes.adminUsers },
  { label: "Riders", href: routes.adminRiders },
  { label: "Deliveries", href: routes.adminDeliveries },
  { label: "Disputes", href: routes.adminDisputes },
  { label: "Refunds", href: routes.adminRefunds },
  { label: "Finance", href: routes.adminTransactions },
  { label: "Analytics", href: routes.adminAnalytics },
  { label: "Audit Logs", href: routes.adminAuditLogs },
  { label: "Notifications", href: routes.notifications },
  { label: "Profile", href: routes.profile },
];
