import { api } from "@/lib/api";
import type { AuthUser, LoginPayload, LoginResponse, RegisterPayload } from "@/types/auth";

export const authService = {
  async register(payload: RegisterPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/register", payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  },

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await api.post("/auth/change-password", payload);
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post("/auth/reset-password", { token, newPassword: password });
  },
};
