import { api } from "@/lib/api";
import type { ServiceNiche } from "@/lib/service-types";

export interface Company {
  niche: ServiceNiche | null;
}

export const companyService = {
  async updateNiche(niche: ServiceNiche): Promise<Company> {
    const { data } = await api.patch<Company>("/company", { niche });
    return data;
  },
};
