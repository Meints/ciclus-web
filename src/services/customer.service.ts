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
    const { data } = await api.post<Customer>("/customers", {
      name: payload.legalName,
      fantasyName: payload.tradeName,
      documentType: payload.documentType,
      document: payload.document,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
    });
    return data;
  },

  async update(id: string, payload: UpdateCustomerPayload): Promise<Customer> {
    const body: Record<string, unknown> = {};
    if (payload.legalName !== undefined) body.name = payload.legalName;
    if (payload.tradeName !== undefined) body.fantasyName = payload.tradeName;
    if (payload.email !== undefined) body.email = payload.email;
    if (payload.phone !== undefined) body.phone = payload.phone;
    if (payload.address !== undefined) body.address = payload.address;

    const { data } = await api.put<Customer>(`/customers/${id}`, body);
    return data;
  },

  async toggle(id: string): Promise<Customer> {
    const { data } = await api.patch<Customer>(`/customers/${id}/toggle`);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },

  async reveal(id: string): Promise<{ document: string; email: string | null }> {
    const { data } = await api.post<{ document: string; email: string | null }>(`/customers/${id}/reveal`);
    return data;
  },
};
