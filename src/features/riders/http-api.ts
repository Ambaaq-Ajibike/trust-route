import { encryptedApiRequest } from "@/lib/api-client";
import type {
  PaginatedResponse,
  PaginationQuery,
  ReviewScope,
  RiderReviewAction,
  RiderReviewRecord,
  RiderReviewStatus,
} from "./types";

type BackendRiderItem = {
  id?: string;
  userId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  city?: string;
  address?: string;
  residentialAddress?: string;
  status?: string | number;
  reviewStage?: string;
  submittedAt?: string;
  supervisor?: { name?: string; fullName?: string } | string;
  vehicleType?: string;
  vehiclePlateNumber?: string;
  rating?: number | string;
  deliveryCount?: number;
  completedDeliveries?: number;
  issueCount?: number;
  activeIssues?: number;
  lastOnlineAt?: string;
  nin?: string;
  ninDocument?: string;
  driversLicense?: string;
  driversLicenseDocument?: string;
  rejectionReason?: string;
  nextOfKinFirstName?: string;
  nextOfKinLastName?: string;
  nextOfKinPhoneNumber?: string;
  nextOfKinRelationship?: string;
};

type BackendPagedRiders = {
  items?: BackendRiderItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
};

const statusMap: Record<number | string, RiderReviewStatus> = {
  0: "Pending Verification",
  1: "Active",
  2: "Rejected",
  Pending: "Pending Verification",
  Verified: "Active",
  Active: "Active",
  Rejected: "Rejected",
};

function normalizeStatus(val: unknown): RiderReviewStatus {
  if (typeof val === "number" || typeof val === "string") {
    const mapped = statusMap[val];
    if (mapped) return mapped;
    if (typeof val === "string") {
      if (val === "0" || val.toLowerCase().includes("pending")) return "Pending Verification";
      if (val === "1" || val.toLowerCase() === "active" || val.toLowerCase() === "verified" || val.toLowerCase() === "approved") return "Active";
      if (val === "2" || val.toLowerCase() === "rejected") return "Rejected";
      return val as RiderReviewStatus;
    }
  }
  return "Pending Verification";
}

function mapRider(row: BackendRiderItem): RiderReviewRecord {
  const name =
    row.name || [row.firstName, row.lastName].filter(Boolean).join(" ") || row.email || "Rider";
  const documents: RiderReviewRecord["documents"] = [];
  if (row.ninDocument) {
    documents.push({
      type: "nin",
      label: "NIN",
      fileName: "NIN document",
      fileType: "image",
      url: row.ninDocument,
      verified: row.status === 1 || row.status === "Active" || row.status === "Verified",
    });
  }
  if (row.driversLicenseDocument) {
    documents.push({
      type: "drivers_license",
      label: "Driver's license",
      fileName: "Driver's license",
      fileType: "image",
      url: row.driversLicenseDocument,
      verified: row.status === 1 || row.status === "Active" || row.status === "Verified",
    });
  }

  const supervisorName =
    typeof row.supervisor === "string"
      ? row.supervisor
      : row.supervisor?.fullName || row.supervisor?.name || "";

  const nextOfKinName = [row.nextOfKinFirstName, row.nextOfKinLastName].filter(Boolean).join(" ");

  return {
    id: row.id ?? "",
    riderId: row.userId ?? row.id ?? "",
    name,
    email: row.email ?? "",
    phone: row.phoneNumber ?? row.phone ?? "",
    city: row.city ?? "",
    address: row.residentialAddress ?? row.address ?? "",
    status: normalizeStatus(row.status),
    submittedAt: row.submittedAt ?? "",
    assignedSupervisor: supervisorName,
    documents,
    vehicle: {
      type: row.vehicleType ?? "",
      plateNumber: row.vehiclePlateNumber ?? "",
      color: "",
      capacity: "",
    },
    nextOfKin: {
      name: nextOfKinName,
      phone: row.nextOfKinPhoneNumber ?? "",
      relationship: row.nextOfKinRelationship ?? "",
    },
    relatives: [],
    checks: [],
    notes: row.rejectionReason ?? "",
    rating: row.rating ? String(row.rating) : "4.8",
    completedDeliveries: row.deliveryCount ?? row.completedDeliveries ?? 0,
    activeIssues: row.issueCount ?? row.activeIssues ?? 0,
    lastOnline: row.lastOnlineAt ?? "",
  };
}

async function fetchRiders(
  path: string,
  query: PaginationQuery,
  extraPayload: Record<string, unknown> = {},
): Promise<PaginatedResponse<RiderReviewRecord>> {
  const raw = await encryptedApiRequest<BackendPagedRiders | BackendRiderItem[]>(path, {
    PageNumber: query.page,
    PageSize: query.pageSize,
    ...extraPayload,
  });

  if (Array.isArray(raw)) {
    const rows = raw.map(mapRider);
    const start = (query.page - 1) * query.pageSize;
    return {
      rows: rows.slice(start, start + query.pageSize),
      page: query.page,
      pageSize: query.pageSize,
      total: rows.length,
    };
  }

  const items = raw.items ?? [];
  return {
    rows: items.map(mapRider),
    page: raw.pageNumber ?? query.page,
    pageSize: raw.pageSize ?? query.pageSize,
    total: raw.totalCount ?? items.length,
  };
}

async function review(id: string, action: RiderReviewAction): Promise<RiderReviewRecord> {
  await encryptedApiRequest<boolean>(`/Riders/${id}/review`, {
    RiderDetailsId: id,
    Status: action === "approve" ? "Verified" : "Rejected",
    ...(action === "reject" ? { RejectionReason: "Rejected during dashboard review" } : {}),
  });
  const res = await fetchRiders("/Riders/List", { page: 1, pageSize: 50 });
  const existing = res.rows.find((row) => row.id === id);
  if (!existing) {
    return {
      id,
      riderId: id,
      name: "Reviewed Rider",
      email: "",
      phone: "",
      city: "",
      address: "",
      status: action === "approve" ? "Active" : "Rejected",
      submittedAt: new Date().toISOString(),
      assignedSupervisor: "",
      documents: [],
      vehicle: { type: "", plateNumber: "", color: "", capacity: "" },
      nextOfKin: { name: "", phone: "", relationship: "" },
      relatives: [],
      checks: [],
      notes: action === "reject" ? "Rejected during dashboard review" : "",
    };
  }
  return existing;
}

export const httpRidersApi = {
  async listApplications(query: PaginationQuery, scope: ReviewScope) {
    if (scope === "admin") {
      try {
        return await fetchRiders("/Riders/FinalApprovalQueue", query);
      } catch {
        return fetchRiders("/Riders/List", query, { Status: "Pending" });
      }
    }
    try {
      return await fetchRiders("/Riders/AssignedToMe", query);
    } catch {
      return fetchRiders("/Riders/List", query, { Status: "Pending" });
    }
  },
  async listAssignedRiders(query: PaginationQuery, _scope: ReviewScope) {
    return fetchRiders("/Riders/List", query, { Status: "Verified" });
  },
  reviewApplication(id: string, action: RiderReviewAction, _scope: ReviewScope) {
    return review(id, action);
  },
  reviewAssignedRider(id: string, action: RiderReviewAction, _scope: ReviewScope) {
    return review(id, action);
  },
  setupProfile(payload: Record<string, unknown>) {
    return encryptedApiRequest<boolean>("/Riders/Profile", payload);
  },
  updateProfile(payload: Record<string, unknown>) {
    return encryptedApiRequest<boolean>("/Riders/Profile", payload);
  },
  createRiderBySupervisor(payload: Record<string, unknown>) {
    return encryptedApiRequest<boolean>("/Users/RegisterRider", payload);
  },
};
