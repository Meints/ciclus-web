import { api } from "@/lib/api";
import type { ServiceNiche } from "@/lib/service-types";

export interface Company {
  niche: ServiceNiche | null;
}

export interface UploadLogoResponse {
  logoUrl: string;
}

export const companyService = {
  async updateNiche(niche: ServiceNiche): Promise<Company> {
    const { data } = await api.put<Company>("/company", { niche });
    return data;
  },

  async uploadLogo(file: File): Promise<UploadLogoResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<UploadLogoResponse>("/company/logo", formData, {
      headers: { "Content-Type": undefined },
    });
    return data;
  },
};
