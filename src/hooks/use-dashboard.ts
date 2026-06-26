"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { api } from "@/lib/api";

interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

function useCompanyUsers() {
  return useQuery({
    queryKey: ["company-users"],
    queryFn: async () => {
      const { data } = await api.get<{ data: CompanyUser[] }>("/users");
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export { useCompanyUsers };
export type { CompanyUser };

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getSummary,
  });
}

export function useUpcomingServices(range?: { start: string; end: string }) {
  return useQuery({
    queryKey: ["dashboard", "upcoming-services", range],
    queryFn: () => dashboardService.getUpcomingServices(range ? { ...range, limit: 10 } : undefined),
  });
}

export function useCalendarServices(range: { start: string; end: string }) {
  return useQuery({
    queryKey: ["dashboard", "calendar-services", range],
    queryFn: () => dashboardService.getUpcomingServices(range),
  });
}

export function useExpiringContracts() {
  return useQuery({
    queryKey: ["dashboard", "expiring-contracts"],
    queryFn: dashboardService.getExpiringContracts,
  });
}

export function useTechnicianStatus() {
  return useQuery({
    queryKey: ["dashboard", "technician-status"],
    queryFn: dashboardService.getTechnicianStatus,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["dashboard", "recent-activity"],
    queryFn: dashboardService.getRecentActivity,
  });
}

export interface AuditFilters {
  userId?: string;
  action?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useAuditLog(page: number, pageSize = 25, filters?: AuditFilters) {
  return useQuery({
    queryKey: ["audit-log", page, pageSize, filters],
    queryFn: () => dashboardService.getAuditLog(page, pageSize, filters),
  });
}

export function useMonthlyRevenue() {
  return useQuery({
    queryKey: ["dashboard", "monthly-revenue"],
    queryFn: dashboardService.getMonthlyRevenue,
  });
}
