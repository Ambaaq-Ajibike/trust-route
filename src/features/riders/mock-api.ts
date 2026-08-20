import { mockDelay } from "@/lib/mock-delay";
import { assignedRidersSeed, riderApplicationsSeed } from "./mock-data";
import type {
  PaginatedResponse,
  PaginationQuery,
  ReviewScope,
  RiderReviewAction,
  RiderReviewRecord,
  RiderReviewStatus,
} from "./types";

let riderApplications = [...riderApplicationsSeed];
let assignedRiders = [...assignedRidersSeed];

function paginate<T>(rows: T[], query: PaginationQuery): PaginatedResponse<T> {
  const start = (query.page - 1) * query.pageSize;
  return {
    rows: rows.slice(start, start + query.pageSize),
    page: query.page,
    pageSize: query.pageSize,
    total: rows.length,
  };
}

function applyAction(
  rows: RiderReviewRecord[],
  id: string,
  action: RiderReviewAction,
  scope: ReviewScope,
) {
  return rows.map((row) => {
    if (row.id !== id) {
      return row;
    }

    const nextStatus: RiderReviewStatus =
      action === "reject"
        ? "Rejected"
        : scope === "admin"
          ? "Active"
          : "Pending Admin Review";

    return {
      ...row,
      status: nextStatus,
      notes:
        action === "reject"
          ? "Rejected from the web review queue."
          : scope === "admin"
            ? "Admin approved rider activation."
            : "Supervisor review passed. Awaiting admin final decision.",
    };
  });
}

export const mockRidersApi = {
  async listApplications(query: PaginationQuery, scope: ReviewScope) {
    await mockDelay(350);
    const rows =
      scope === "admin"
        ? riderApplications.filter((item) =>
            ["Pending Admin Review", "Approved", "Active", "Rejected"].includes(item.status),
          )
        : riderApplications;
    return paginate(rows, query);
  },

  async listAssignedRiders(query: PaginationQuery, scope: ReviewScope) {
    await mockDelay(350);
    const rows = scope === "admin" ? assignedRiders : assignedRiders.filter((item) => item.assignedSupervisor === "Amina Bello");
    return paginate(rows, query);
  },

  async reviewApplication(id: string, action: RiderReviewAction, scope: ReviewScope) {
    await mockDelay(300);
    riderApplications = applyAction(riderApplications, id, action, scope);
    return riderApplications.find((item) => item.id === id);
  },

  async reviewAssignedRider(id: string, action: RiderReviewAction, scope: ReviewScope) {
    await mockDelay(300);
    assignedRiders = assignedRiders.map((row) => {
      if (row.id !== id) {
        return row;
      }
      return {
        ...row,
        status: action === "approve" ? "Active" : "Rejected",
        notes:
          action === "approve"
            ? `${scope === "admin" ? "Admin" : "Supervisor"} cleared this rider for active work.`
            : `${scope === "admin" ? "Admin" : "Supervisor"} rejected this rider from the assigned queue.`,
      };
    });
    return assignedRiders.find((item) => item.id === id);
  },

  async createRiderBySupervisor(payload: Record<string, unknown>) {
    await mockDelay(300);
    const newId = `RDR-${Date.now().toString().slice(-4)}`;
    riderApplications.unshift({
      id: newId,
      riderId: `usr-${Date.now()}`,
      name: `${payload.FirstName ?? "New"} ${payload.LastName ?? "Rider"}`,
      email: String(payload.Email ?? ""),
      phone: String(payload.PhoneNumber ?? ""),
      city: "Lagos",
      address: String(payload.ResidentialAddress ?? ""),
      status: "Pending Verification",
      submittedAt: new Date().toISOString(),
      assignedSupervisor: "Current Supervisor",
      documents: [
        { type: "nin", label: "NIN", fileName: "NIN doc", fileType: "image", url: String(payload.NinDocument ?? ""), verified: false },
      ],
      vehicle: {
        type: String(payload.VehicleType ?? "Motorcycle"),
        plateNumber: String(payload.VehiclePlateNumber ?? ""),
        color: "Black",
        capacity: "Standard",
      },
      nextOfKin: {
        name: `${payload.NextOfKinFirstName ?? ""} ${payload.NextOfKinLastName ?? ""}`.trim(),
        phone: String(payload.NextOfKinPhoneNumber ?? ""),
        relationship: String(payload.NextOfKinRelationship ?? ""),
      },
      relatives: [],
      checks: [],
      notes: "Registered by supervisor",
    });
    return true;
  },
};
