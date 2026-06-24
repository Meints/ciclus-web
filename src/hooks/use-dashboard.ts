"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

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

export function useMonthlyRevenue() {
  return useQuery({
    queryKey: ["dashboard", "monthly-revenue"],
    queryFn: dashboardService.getMonthlyRevenue,
  });
}
