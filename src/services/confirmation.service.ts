import { api } from "@/lib/api";
import type { ConfirmationData, ConfirmPayload } from "@/types/confirmation";

export const confirmationService = {
  async getSummary(token: string): Promise<ConfirmationData> {
    const { data } = await api.get<ConfirmationData>(`/confirmar/${token}`);
    return data;
  },

  async confirm(token: string, payload: ConfirmPayload): Promise<{ success: boolean; serviceNumber: number; confirmedAt: string }> {
    const { data } = await api.post<{ success: boolean; serviceNumber: number; confirmedAt: string }>(`/confirmar/${token}`, {
      name: payload.name,
      document: payload.document,
      documentType: payload.documentType,
    });
    return data;
  },
};
