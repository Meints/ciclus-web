export interface AdminOverview {
  totalCompanies: number;
  newThisMonth: number;
  totalUsers: number;
  globalMRR: number;
  atRiskCount: number;
}

export interface AdminCompany {
  id: string;
  name: string;
  niche: string | null;
  plan: string;
  createdAt: string;
  users: number;
  customers: number;
  activeContracts: number;
  totalServices: number;
  servicesThisMonth: number;
}

export interface AdminCompanyDetail {
  id: string;
  name: string;
  niche: string | null;
  plan: string;
  createdAt: string;
  users: Array<{ id: string; name: string; email: string; role: string; createdAt: string }>;
  stats: {
    customers: number;
    activeContracts: number;
    employees: number;
    totalServices: number;
    servicesThisMonth: number;
    completedThisMonth: number;
    mrr: number;
  };
  monthlyServices: Array<{ month: string; count: number }>;
}

export interface AtRiskCompany {
  id: string;
  name: string;
  niche: string | null;
  plan: string;
  createdAt: string;
  totalServices: number;
}

export interface AdminMrrPoint {
  month: string;
  activeContracts: number;
  newCompanies: number;
}

export interface AdminCompaniesFilters {
  page?: number;
  pageSize?: number;
  plan?: string;
  search?: string;
}

export interface AdminCompaniesResponse {
  data: AdminCompany[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}
