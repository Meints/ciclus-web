import { api } from "@/lib/api";
import type { PaginatedResponse, PaginationParams } from "@/types/api";
import type {
  CreateCustomerPayload,
  Customer,
  CustomerFilters,
  UpdateCustomerPayload,
} from "@/types/customer";

export const customerService = {
  async list(
    params: PaginationParams & CustomerFilters
  ): Promise<PaginatedResponse<Customer>> {
    const { data } = await api.get<PaginatedResponse<Customer>>("/customers", {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<Customer> {
    const { data } = await api.get<Customer>(`/customers/${id}`);
    return data;
  },

  async create(payload: CreateCustomerPayload): Promise<Customer> {
    const { data } = await api.post<Customer>("/customers", payload);
    return data;
  },

  async update(id: string, payload: UpdateCustomerPayload): Promise<Customer> {
    const { data } = await api.put<Customer>(`/customers/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};
