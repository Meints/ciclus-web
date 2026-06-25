import type { ServiceNiche } from "@/lib/service-types";

export type UserRole = "OWNER" | "ADMIN" | "TECHNICIAN" | "SUPERADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  companyName: string;
  niche: ServiceNiche | null;
  logoUrl?: string | null;
  avatarUrl?: string | null;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}
