import { api } from "@/lib/api";
import type { ConfirmationSummary } from "@/types/confirmation";

export const confirmationService = {
  async getSummary(token: string): Promise<ConfirmationSummary> {
    const { data } = await api.get<ConfirmationSummary>(`/confirm/${token}`);
    return data;
  },

  async confirm(token: string): Promise<ConfirmationSummary> {
    const { data } = await api.post<ConfirmationSummary>(`/confirm/${token}`);
    return data;
  },
};
