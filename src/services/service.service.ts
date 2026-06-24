import { api } from "@/lib/api";
import type { PaginatedResponse, PaginationParams } from "@/types/api";
import type {
  CompleteServicePayload,
  CreateServicePayload,
  Service,
  ServiceFilters,
  UpdateServicePayload,
} from "@/types/service";

export const serviceService = {
  async list(
    params: PaginationParams & ServiceFilters
  ): Promise<PaginatedResponse<Service>> {
    const { data } = await api.get<PaginatedResponse<Service>>("/services", {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<Service> {
    const { data } = await api.get<Service>(`/services/${id}`);
    return data;
  },

  async create(payload: CreateServicePayload): Promise<Service> {
    const { data } = await api.post<Service>("/services", payload);
    return data;
  },

  async start(id: string): Promise<Service> {
    const { data } = await api.patch<Service>(`/services/${id}/start`);
    return data;
  },

  async complete(id: string, payload: CompleteServicePayload): Promise<Service> {
    const { data } = await api.patch<Service>(`/services/${id}/complete`, payload);
    return data;
  },

  async cancel(id: string, reason?: string): Promise<Service> {
    const { data } = await api.patch<Service>(`/services/${id}/cancel`, { reason });
    return data;
  },

  async resendConfirmation(id: string): Promise<Service> {
    const { data } = await api.post<Service>(`/services/${id}/resend-confirmation`);
    return data;
  },

  async uploadPhoto(serviceId: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<{ url: string }>(
      `/services/${serviceId}/photos`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  async generatePdf(id: string): Promise<{ reportPdfUrl: string }> {
    const { data } = await api.post<{ reportPdfUrl: string }>(
      `/services/${id}/generate-pdf`
    );
    return data;
  },

  async update(id: string, payload: UpdateServicePayload): Promise<Service> {
    const { data } = await api.patch<Service>(`/services/${id}`, payload);
    return data;
  },

  async revert(id: string): Promise<Service> {
    const { data } = await api.patch<Service>(`/services/${id}/revert`);
    return data;
  },

  async reopen(id: string): Promise<Service> {
    const { data } = await api.patch<Service>(`/services/${id}/reopen`);
    return data;
  },
};
