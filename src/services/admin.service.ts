import { api } from "@/lib/api";
import type {
  AdminCompaniesFilters,
  AdminCompaniesResponse,
  AdminCompany,
  AdminCompanyDetail,
  AdminCompanyUser,
  AdminMrrPoint,
  AdminOverview,
  AtRiskCompany,
  CreateCompanyPayload,
  CreateCompanyResult,
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

  async exitImpersonation(): Promise<{ token: string }> {
    const { data } = await api.post<{ token: string }>("/admin/impersonate/exit");
    return data;
  },

  async createCompany(payload: CreateCompanyPayload): Promise<CreateCompanyResult> {
    const { data } = await api.post<CreateCompanyResult>("/admin/companies", payload);
    return data;
  },

  async toggleCompany(id: string): Promise<{ id: string; name: string; isActive: boolean }> {
    const { data } = await api.patch<{ id: string; name: string; isActive: boolean }>(
      `/admin/companies/${id}/toggle`,
    );
    return data;
  },

  async listCompanyUsers(id: string): Promise<AdminCompanyUser[]> {
    const { data } = await api.get<AdminCompanyUser[]>(`/admin/companies/${id}/users`);
    return data;
  },

  async removeCompanyUser(companyId: string, userId: string): Promise<void> {
    await api.delete(`/admin/companies/${companyId}/users/${userId}`);
  },

  async updateCompanyUserRole(
    companyId: string,
    userId: string,
    role: string,
  ): Promise<AdminCompanyUser> {
    const { data } = await api.patch<AdminCompanyUser>(
      `/admin/companies/${companyId}/users/${userId}/role`,
      { role },
    );
    return data;
  },
};
