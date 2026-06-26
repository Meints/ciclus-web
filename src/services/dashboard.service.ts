import { api } from "@/lib/api";
import type {
  AuditLogPage,
  DashboardSummary,
  ExpiringContract,
  MonthlyRevenue,
  RecentActivity,
  TechnicianStatus,
  UpcomingService,
} from "@/types/dashboard";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>("/dashboard/summary");
    return data;
  },

  async getUpcomingServices(range?: { start: string; end: string; limit?: number }): Promise<UpcomingService[]> {
    const { data } = await api.get<UpcomingService[]>("/dashboard/upcoming-services", {
      params: range,
    });
    return data;
  },

  async getExpiringContracts(): Promise<ExpiringContract[]> {
    const { data } = await api.get<ExpiringContract[]>("/dashboard/expiring-contracts");
    return data;
  },

  async getTechnicianStatus(): Promise<TechnicianStatus[]> {
    const { data } = await api.get<TechnicianStatus[]>("/dashboard/technician-status");
    return data;
  },

  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    const { data } = await api.get<MonthlyRevenue[]>("/dashboard/monthly-revenue");
    return data;
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    const { data } = await api.get<{ data: RecentActivity[] }>("/dashboard/recent-activity", { params: { pageSize: 6 } });
    return data.data;
  },

  async getAuditLog(
    page: number,
    pageSize: number,
    filters?: { userId?: string; action?: string; entityType?: string; dateFrom?: string; dateTo?: string },
  ): Promise<AuditLogPage> {
    const { data } = await api.get<AuditLogPage>("/dashboard/recent-activity", {
      params: { page, pageSize, ...filters },
    });
    return data;
  },
};
