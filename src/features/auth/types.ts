import type { AuthSession } from "@/lib/auth-session";

export type LoginInput = {
  email: string;
  password: string;
};

export type ResetPasswordInput = {
  email: string;
  code: string;
  password: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type AuthResponse = AuthSession;
