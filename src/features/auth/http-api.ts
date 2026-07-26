import { apiRequest } from "@/lib/api-client";
import type { AuthResponse, ChangePasswordInput, LoginInput } from "./types";

export const httpAuthApi = {
  login(input: LoginInput): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  requestPasswordReset(email: string) {
    return apiRequest<{ ok: boolean }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  resetPassword(input: {
    email: string;
    code: string;
    password: string;
  }) {
    return apiRequest<{ ok: boolean }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  changePassword(input: ChangePasswordInput) {
    return apiRequest<{ ok: boolean }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
