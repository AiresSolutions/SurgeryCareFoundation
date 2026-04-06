export type NotificationType = "donation" | "campaign" | "withdrawal" | "system" | "moderation";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}
