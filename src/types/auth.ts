import type { ServiceNiche } from "@/lib/service-types";

export type UserRole = "OWNER" | "ADMIN" | "TECHNICIAN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  companyName: string;
  niche: ServiceNiche | null;
  avatarUrl?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}
