"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import type { AdminCompaniesFilters, CreateCompanyPayload } from "@/types/admin";

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
      document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=3600`;
      window.location.href = "/";
    },
  });
}

export function useExitImpersonation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: adminService.exitImpersonation,
    onSuccess: ({ token }) => {
      document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=28800`;
      setUser(null);
      queryClient.clear();
      router.push("/admin");
      window.location.href = "/admin";
    },
    onError: () => {
      toast.error("Não foi possível sair do modo de acesso como empresa.");
    },
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => adminService.createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
  });
}

export function useToggleCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.toggleCompany(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "companies", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
  });
}

export function useListCompanyUsers(companyId: string) {
  return useQuery({
    queryKey: ["admin", "companies", companyId, "users"],
    queryFn: () => adminService.listCompanyUsers(companyId),
    enabled: !!companyId,
  });
}

export function useRemoveCompanyUser(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.removeCompanyUser(companyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies", companyId, "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "companies", companyId] });
    },
  });
}

export function useUpdateCompanyUserRole(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.updateCompanyUserRole(companyId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies", companyId, "users"] });
    },
  });
}
