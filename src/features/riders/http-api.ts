import { encryptedApiRequest } from "@/lib/api-client";
import type {
  PaginatedResponse, PaginationQuery, ReviewScope, RiderReviewAction,
  RiderReviewRecord, RiderReviewStatus,
} from "./types";

type RiderProfileResponse = {
  id?: string; userId?: string; firstName?: string; lastName?: string;
  email?: string; phoneNumber?: string; residentialAddress?: string | null;
  nin?: string | null; ninDocument?: string | null;
  driversLicense?: string | null; driversLicenseDocument?: string | null;
  vehicleType?: string | null; vehiclePlateNumber?: string | null;
  nextOfKinFirstName?: string | null; nextOfKinLastName?: string | null;
  nextOfKinPhoneNumber?: string | null; nextOfKinRelationship?: string | null;
  nextOfKinAddress?: string | null; status?: number; rejectionReason?: string | null;
};

const statuses: Record<number, RiderReviewStatus> = {
  0: "Pending Verification", 1: "Active", 2: "Rejected",
};

function mapRider(row: RiderProfileResponse): RiderReviewRecord {
  const documents: RiderReviewRecord["documents"] = [];
  if (row.ninDocument) documents.push({ type: "nin", label: "NIN", fileName: "NIN document", fileType: "image", url: row.ninDocument, verified: row.status === 1 });
  if (row.driversLicenseDocument) documents.push({ type: "drivers_license", label: "Driver's license", fileName: "Driver's license", fileType: "image", url: row.driversLicenseDocument, verified: row.status === 1 });
  return {
    id: row.id ?? "", riderId: row.userId ?? "",
    name: [row.firstName, row.lastName].filter(Boolean).join(" "),
    email: row.email ?? "", phone: row.phoneNumber ?? "", city: "",
    address: row.residentialAddress ?? "", status: statuses[row.status ?? 0] ?? "Under Review",
    submittedAt: "", assignedSupervisor: "", documents,
    vehicle: { type: row.vehicleType ?? "", plateNumber: row.vehiclePlateNumber ?? "", color: "", capacity: "" },
    nextOfKin: {
      name: [row.nextOfKinFirstName, row.nextOfKinLastName].filter(Boolean).join(" "),
      phone: row.nextOfKinPhoneNumber ?? "", relationship: row.nextOfKinRelationship ?? "",
    },
    relatives: [], checks: [], notes: row.rejectionReason ?? "",
  };
}

async function listAll(status?: number): Promise<RiderReviewRecord[]> {
  const payload = status == null ? {} : { Status: status };
  return (await encryptedApiRequest<RiderProfileResponse[]>("/Riders/List", payload)).map(mapRider);
}

function paginate(rows: RiderReviewRecord[], query: PaginationQuery): PaginatedResponse<RiderReviewRecord> {
  const start = (query.page - 1) * query.pageSize;
  return { rows: rows.slice(start, start + query.pageSize), page: query.page, pageSize: query.pageSize, total: rows.length };
}

async function review(id: string, action: RiderReviewAction): Promise<RiderReviewRecord> {
  await encryptedApiRequest<boolean>("/Riders/ReviewProfile", {
    RiderDetailsId: id,
    Status: action === "approve" ? 1 : 2,
    ...(action === "reject" ? { RejectionReason: "Rejected during dashboard review" } : {}),
  });
  const existing = (await listAll()).find((row) => row.id === id);
  if (!existing) throw new Error("Rider profile was reviewed but could not be reloaded.");
  return existing;
}

export const httpRidersApi = {
  async listApplications(query: PaginationQuery, _scope: ReviewScope) { return paginate(await listAll(0), query); },
  async listAssignedRiders(query: PaginationQuery, _scope: ReviewScope) { return paginate(await listAll(1), query); },
  reviewApplication(id: string, action: RiderReviewAction, _scope: ReviewScope) { return review(id, action); },
  reviewAssignedRider(id: string, action: RiderReviewAction, _scope: ReviewScope) { return review(id, action); },
  setupProfile(payload: Record<string, unknown>) { return encryptedApiRequest<boolean>("/Riders/SetupProfile", payload); },
  updateProfile(payload: Record<string, unknown>) { return encryptedApiRequest<boolean>("/Riders/UpdateProfile", payload); },
};
