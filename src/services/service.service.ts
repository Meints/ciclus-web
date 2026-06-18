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

  async update(id: string, payload: UpdateServicePayload): Promise<Service> {
    const { data } = await api.put<Service>(`/services/${id}`, payload);
    return data;
  },

  async complete(id: string, payload: CompleteServicePayload): Promise<Service> {
    const { data } = await api.patch<Service>(`/services/${id}/complete`, payload);
    return data;
  },

  async resendConfirmation(id: string): Promise<Service> {
    const { data } = await api.post<Service>(`/services/${id}/resend-confirmation`);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/services/${id}`);
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
};
