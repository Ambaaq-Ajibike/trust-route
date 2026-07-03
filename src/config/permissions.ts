export const permissions = {
  riderApplicationReview: "rider_application.review",
  riderApplicationFinalApprove: "rider_application.final_approve",
  supervisorCreate: "supervisor.create",
  supervisorSuspend: "supervisor.suspend",
  userSuspend: "user.suspend",
  transactionView: "transaction.view",
  refundCreate: "refund.create",
  disputeResolve: "dispute.resolve",
  auditLogView: "audit_log.view",
  adminCreate: "admin.create",
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];
export type Role = "supervisor" | "admin" | "super_admin";
