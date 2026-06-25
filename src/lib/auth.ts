import type { UserRole } from "@/types/auth";

export const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  TECHNICIAN: "Técnico",
  SUPERADMIN: "Super Admin",
};

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function hasRole(role: UserRole | undefined, allowed: UserRole[]): boolean {
  if (!role) return false;
  return allowed.includes(role);
}

export function getDefaultRouteForRole(role: UserRole): string {
  if (role === "SUPERADMIN") return "/admin";
  if (role === "TECHNICIAN") return "/servicos";
  return "/";
}

export function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1] ?? "") : null;
}

export const AUTH_COOKIE_NAME = "ciclus_token";
