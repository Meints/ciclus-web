import { api } from "@/lib/api";
import type { NotificationsResponse } from "@/types/notification";

export const notificationService = {
  async list(page = 1): Promise<NotificationsResponse> {
    const { data } = await api.get<NotificationsResponse>("/notifications", {
      params: { page },
    });
    return data;
  },

  async markRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  },
};
