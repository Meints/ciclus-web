import { api } from "@/lib/api";
import type {
  DashboardSummary,
  ExpiringContract,
  UpcomingService,
} from "@/types/dashboard";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>("/dashboard/summary");
    return data;
  },

  async getUpcomingServices(range?: { start: string; end: string }): Promise<UpcomingService[]> {
    const { data } = await api.get<UpcomingService[]>("/dashboard/upcoming-services", {
      params: range,
    });
    return data;
  },

  async getExpiringContracts(): Promise<ExpiringContract[]> {
    const { data } = await api.get<ExpiringContract[]>(
      "/dashboard/expiring-contracts"
    );
    return data;
  },
};
