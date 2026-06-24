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
    const { data } = await api.post<Contract>("/contracts", {
      customerId: payload.customerId,
      frequency: payload.frequency,
      startDate: payload.startDate,
      endDate: payload.endDate,
      amount: payload.value,
      notes: payload.notes,
    });
    return data;
  },

  async update(id: string, payload: UpdateContractPayload): Promise<Contract> {
    const body: Record<string, unknown> = {};
    if (payload.frequency !== undefined) body.frequency = payload.frequency;
    if (payload.startDate !== undefined) body.startDate = payload.startDate;
    if (payload.endDate !== undefined) body.endDate = payload.endDate;
    if (payload.value !== undefined) body.amount = payload.value;
    if (payload.notes !== undefined) body.notes = payload.notes;
    if (payload.customerId !== undefined) body.customerId = payload.customerId;
    if (payload.status !== undefined) body.status = payload.status;

    const { data } = await api.put<Contract>(`/contracts/${id}`, body);
    return data;
  },

  async cancel(id: string, reason?: string): Promise<Contract> {
    const { data } = await api.patch<Contract>(`/contracts/${id}/cancel`, { reason });
    return data;
  },
};
