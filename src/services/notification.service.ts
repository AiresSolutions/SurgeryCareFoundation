import { apiClient } from "@/lib/api-client";
import type { PaginatedData } from "@/types/api";
import type { Notification } from "@/types/notification";

export const notificationService = {
  getNotifications(params?: { page?: number; limit?: number; isRead?: boolean }) {
    return apiClient.get<PaginatedData<Notification>>("/notifications", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  getUnreadCount() {
    return apiClient.get<{ count: number }>("/notifications/unread-count");
  },

  markAsRead(id: string) {
    return apiClient.patch<Notification>(`/notifications/${id}/read`);
  },

  markAllAsRead() {
    return apiClient.patch<void>("/notifications/read-all");
  },
};
