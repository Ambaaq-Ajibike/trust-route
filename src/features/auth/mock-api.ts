import { mockDelay } from "@/lib/mock-delay";
import { mockStore } from "@/lib/mock-store";
import type { AuthResponse, ChangePasswordInput, LoginInput } from "./types";

export const mockAuthApi = {
  async login(input: LoginInput): Promise<AuthResponse> {
    await mockDelay(500);
    return mockStore.login(input.email, input.password);
  },
  async requestPasswordReset() {
    await mockDelay(400);
    return { ok: true };
  },
  async resetPassword() {
    await mockDelay(400);
    return { ok: true };
  },
  async changePassword(_input: ChangePasswordInput) {
    await mockDelay(450);
    return { ok: true };
  },
};
