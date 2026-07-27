import type { AuthSession, SessionUser } from "@/lib/auth-session";
import type { Role } from "@/config/permissions";

type Credentials = {
  email: string;
  password: string;
  session: AuthSession;
};

const supervisorUser: SessionUser = {
  id: "sup-001",
  fullName: "Amina Bello",
  email: "supervisor@trustroute.local",
  role: "supervisor",
  permissions: ["rider_application.review", "audit_log.view"],
};

const adminUser: SessionUser = {
  id: "adm-001",
  fullName: "Daniel Okafor",
  email: "admin@trustroute.local",
  role: "super_admin",
  permissions: [
    "rider_application.review",
    "rider_application.final_approve",
    "supervisor.create",
    "supervisor.suspend",
    "user.suspend",
    "transaction.view",
    "refund.create",
    "dispute.resolve",
    "audit_log.view",
    "admin.create",
  ],
};

const credentials: Credentials[] = [
  {
    email: supervisorUser.email,
    password: "password123",
    session: {
      accessToken: "mock-supervisor-token",
      refreshToken: "mock-supervisor-refresh",
      expiresAt: Date.now() + 1000 * 60 * 60,
      user: supervisorUser,
    },
  },
  {
    email: adminUser.email,
    password: "password123",
    session: {
      accessToken: "mock-admin-token",
      refreshToken: "mock-admin-refresh",
      expiresAt: Date.now() + 1000 * 60 * 60,
      user: adminUser,
    },
  },
];

export const mockStore = {
  login(email: string, password: string) {
    const match = credentials.find(
      (item) => item.email === email.trim().toLowerCase() && item.password === password,
    );
    if (!match) {
      throw new Error("Invalid credentials.");
    }
    return match.session;
  },
  currentUser() {
    return credentials[1].session.user;
  },
  dashboardMetrics(role: Role) {
    return role === "supervisor"
      ? {
          pendingApplications: 8,
          assignedRiders: 24,
          openIssues: 3,
          activeReviews: 5,
        }
      : {
          activeDeliveries: 41,
          pendingApprovals: 12,
          openDisputes: 4,
          pendingPayouts: 9,
          dailyRevenue: 124580,
          commission: 26840,
        };
  },
};
