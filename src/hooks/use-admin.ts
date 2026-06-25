"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import type { AdminCompaniesFilters } from "@/types/admin";

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: adminService.getOverview,
  });
}

export function useAdminCompanies(filters: AdminCompaniesFilters = {}) {
  return useQuery({
    queryKey: ["admin", "companies", filters],
    queryFn: () => adminService.listCompanies(filters),
  });
}

export function useAdminCompanyDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "companies", id],
    queryFn: () => adminService.getCompanyDetail(id),
    enabled: !!id,
  });
}

export function useUpdateCompanyPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: string }) =>
      adminService.updateCompanyPlan(id, plan),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "companies", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
  });
}

export function useAdminMRR() {
  return useQuery({
    queryKey: ["admin", "metrics", "mrr"],
    queryFn: adminService.getMRR,
  });
}

export function useAtRiskCompanies() {
  return useQuery({
    queryKey: ["admin", "metrics", "at-risk"],
    queryFn: adminService.getAtRisk,
  });
}

export function useImpersonate() {
  return useMutation({
    mutationFn: (companyId: string) => adminService.impersonate(companyId),
    onSuccess: ({ token }) => {
      // Save the impersonation token to the auth cookie and reload into the main app
      document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=3600`;
      window.location.href = "/";
    },
  });
}
