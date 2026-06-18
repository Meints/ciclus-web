import { api } from "@/lib/api";
import type { PaginatedResponse, PaginationParams } from "@/types/api";
import type {
  Contract,
  ContractFilters,
  CreateContractPayload,
  UpdateContractPayload,
} from "@/types/contract";

export const contractService = {
  async list(
    params: PaginationParams & ContractFilters
  ): Promise<PaginatedResponse<Contract>> {
    const { data } = await api.get<PaginatedResponse<Contract>>("/contracts", {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<Contract> {
    const { data } = await api.get<Contract>(`/contracts/${id}`);
    return data;
  },

  async create(payload: CreateContractPayload): Promise<Contract> {
    const { data } = await api.post<Contract>("/contracts", payload);
    return data;
  },

  async update(id: string, payload: UpdateContractPayload): Promise<Contract> {
    const { data } = await api.put<Contract>(`/contracts/${id}`, payload);
    return data;
  },

  async cancel(id: string): Promise<Contract> {
    const { data } = await api.put<Contract>(`/contracts/${id}`, {
      status: "CANCELLED",
    });
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/contracts/${id}`);
  },
};
