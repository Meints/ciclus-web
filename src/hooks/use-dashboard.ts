"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getSummary,
  });
}

export function useUpcomingServices() {
  return useQuery({
    queryKey: ["dashboard", "upcoming-services"],
    queryFn: () => dashboardService.getUpcomingServices(),
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
