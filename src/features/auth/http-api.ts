import { encryptedApiRequest } from "@/lib/api-client";
import { permissions, type Role } from "@/config/permissions";
import type { AuthResponse, ChangePasswordInput, LoginInput } from "./types";

type LoginResponse = {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  accessToken?: string;
  refreshToken?: string;
  roles?: string[];
};

function dashboardRole(roles: string[] = []): Role {
  const normalized = roles.map((role) => role.toLowerCase().replaceAll("-", "_"));
  if (normalized.includes("super_admin") || normalized.includes("superadmin")) return "super_admin";
  if (normalized.includes("admin")) return "admin";
  return "supervisor";
}

function rolePermissions(role: Role): string[] {
  if (role === "super_admin") return Object.values(permissions);
  if (role === "admin") return [permissions.riderApplicationReview, permissions.riderApplicationFinalApprove];
  return [permissions.riderApplicationReview];
}

function toSession(data: LoginResponse): AuthResponse {
  if (!data.accessToken) throw new Error("Login succeeded without an access token.");
  const role = dashboardRole(data.roles);
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? "",
    expiresAt: Date.now() + 60 * 60 * 1000,
    user: {
      id: data.userId ?? "",
      fullName: [data.firstName, data.lastName].filter(Boolean).join(" ") || data.email || "TrustRoute user",
      email: data.email ?? "",
      role,
      permissions: rolePermissions(role),
    },
  };
}

export const httpAuthApi = {
  async login(input: LoginInput): Promise<AuthResponse> {
    return toSession(await encryptedApiRequest<LoginResponse>("/Auth/Login", {
      Email: input.email,
      Password: input.password,
    }));
  },
  async requestPasswordReset(email: string) {
    await encryptedApiRequest<boolean>("/Auth/ForgotPassword", { Email: email });
    return { ok: true };
  },
  async resetPassword(input: { email: string; code: string; password: string }) {
    await encryptedApiRequest<boolean>("/Auth/ResetPassword", {
      Email: input.email,
      Otp: input.code,
      NewPassword: input.password,
      ConfirmNewPassword: input.password,
    });
    return { ok: true };
  },
  async changePassword(input: ChangePasswordInput) {
    await encryptedApiRequest<boolean>("/Auth/ChangePassword", {
      CurrentPassword: input.currentPassword,
      NewPassword: input.newPassword,
      ConfirmNewPassword: input.confirmPassword,
    });
    return { ok: true };
  },
  updateProfilePicture(base64Image: string) {
    return encryptedApiRequest<string>("/Auth/UpdateProfilePicture", { Base64Image: base64Image });
  },
  createCustomer(input: { firstName: string; lastName: string; email: string; phoneNumber: string; password: string }) {
    return encryptedApiRequest<boolean>("/Users/CreateCustomer", {
      FirstName: input.firstName, LastName: input.lastName, Email: input.email,
      PhoneNumber: input.phoneNumber, Password: input.password,
    });
  },
  createRider(payload: Record<string, unknown>) {
    return encryptedApiRequest<boolean>("/Users/CreateRider", payload);
  },
};
