import { api } from "@/lib/api";
import type { CreateEquipmentPayload, Equipment, UpdateEquipmentPayload } from "@/types/equipment";

export const equipmentService = {
  async list(customerId: string): Promise<Equipment[]> {
    const { data } = await api.get<Equipment[]>(`/customers/${customerId}/equipment`);
    return data;
  },

  async create(customerId: string, payload: CreateEquipmentPayload): Promise<Equipment> {
    const { data } = await api.post<Equipment>(`/customers/${customerId}/equipment`, payload);
    return data;
  },

  async update(
    customerId: string,
    equipmentId: string,
    payload: UpdateEquipmentPayload
  ): Promise<Equipment> {
    const { data } = await api.put<Equipment>(
      `/customers/${customerId}/equipment/${equipmentId}`,
      payload
    );
    return data;
  },

  async toggle(customerId: string, equipmentId: string): Promise<Equipment> {
    const { data } = await api.patch<Equipment>(
      `/customers/${customerId}/equipment/${equipmentId}/toggle`
    );
    return data;
  },
};
