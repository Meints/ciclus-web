import { api } from "@/lib/api";
import type {
  AdminCompaniesFilters,
  AdminCompaniesResponse,
  AdminCompany,
  AdminCompanyDetail,
  AdminMrrPoint,
  AdminOverview,
  AtRiskCompany,
} from "@/types/admin";

export const adminService = {
  async getOverview(): Promise<AdminOverview> {
    const { data } = await api.get<AdminOverview>("/admin/overview");
    return data;
  },

  async listCompanies(filters: AdminCompaniesFilters = {}): Promise<AdminCompaniesResponse> {
    const { data } = await api.get<AdminCompaniesResponse>("/admin/companies", {
      params: {
        page: filters.page,
        pageSize: filters.pageSize,
        plan: filters.plan && filters.plan !== "ALL" ? filters.plan : undefined,
        search: filters.search || undefined,
      },
    });
    return data;
  },

  async getCompanyDetail(id: string): Promise<AdminCompanyDetail> {
    const { data } = await api.get<AdminCompanyDetail>(`/admin/companies/${id}`);
    return data;
  },

  async updateCompanyPlan(id: string, plan: string): Promise<AdminCompany> {
    const { data } = await api.patch<AdminCompany>(`/admin/companies/${id}/plan`, { plan });
    return data;
  },

  async getMRR(): Promise<AdminMrrPoint[]> {
    const { data } = await api.get<AdminMrrPoint[]>("/admin/metrics/mrr");
    return data;
  },

  async getAtRisk(): Promise<AtRiskCompany[]> {
    const { data } = await api.get<AtRiskCompany[]>("/admin/metrics/at-risk");
    return data;
  },

  async impersonate(id: string): Promise<{ token: string }> {
    const { data } = await api.post<{ token: string }>(`/admin/companies/${id}/impersonate`);
    return data;
  },
};
