export type RiderReviewStatus =
  | "Pending Verification"
  | "More Info Required"
  | "Pending Admin Review"
  | "Approved"
  | "Active"
  | "Under Review"
  | "Suspended"
  | "Rejected";

export type ReviewScope = "supervisor" | "admin";

export type PaginationQuery = {
  page: number;
  pageSize: number;
};

export type PaginatedResponse<T> = {
  rows: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type RiderDocument = {
  type: "nin" | "drivers_license" | "voters_card" | "relative_one_id" | "relative_two_id";
  label: string;
  fileName: string;
  fileType: "image" | "pdf";
  url: string;
  verified: boolean;
};

export type RiderRelative = {
  name: string;
  relationship: string;
  phone: string;
};

export type RiderReviewRecord = {
  id: string;
  riderId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  status: RiderReviewStatus;
  submittedAt: string;
  assignedSupervisor: string;
  documents: RiderDocument[];
  vehicle: {
    type: string;
    plateNumber: string;
    color: string;
    capacity: string;
  };
  nextOfKin: {
    name: string;
    phone: string;
    relationship: string;
  };
  relatives: RiderRelative[];
  checks: Array<{
    label: string;
    status: "Passed" | "Needs Review" | "Failed";
  }>;
  notes: string;
  rating?: string;
  completedDeliveries?: number;
  activeIssues?: number;
  lastOnline?: string;
};

export type RiderReviewAction = "approve" | "reject";
