"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellIcon, ClockIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { notificationService } from "@/services/notification.service";
import type { PaginatedData } from "@/types/api";
import type { Notification } from "@/types/notification";

const TYPE_BADGE: Record<string, { label: string; variant: "default" | "accent" | "success" | "outline" }> = {
  donation: { label: "Donation", variant: "success" },
  campaign: { label: "Campaign", variant: "accent" },
  withdrawal: { label: "Withdrawal", variant: "outline" },
  system: { label: "System", variant: "default" },
  moderation: { label: "Moderation", variant: "outline" },
};

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const [markingAll, setMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useApi<PaginatedData<Notification>>(
    () => notificationService.getNotifications({ limit: 20 }),
    [],
  );

  const notifications = data?.items ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function handleMarkAllAsRead() {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      refetch();
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleMarkAsRead(id: string) {
    setMarkingId(id);
    try {
      await notificationService.markAsRead(id);
      refetch();
    } finally {
      setMarkingId(null);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading level="h2" as="h1" className="mb-2">Notifications</Heading>
          <Text variant="secondary">
            Stay updated on your donations, campaigns, and account activity.
          </Text>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
          >
            {markingAll ? "Marking..." : "Mark all as read"}
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-surface-border bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
          <Heading level="h4" as="h2">
            All Notifications
            <span className="ml-2 text-body text-slate-light font-normal">
              ({notifications.length})
            </span>
          </Heading>
          {unreadCount > 0 && (
            <Badge variant="accent" className="text-[10px]">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Text variant="secondary">Loading notifications...</Text>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-page">
              <BellIcon className="size-7 text-slate-light" />
            </span>
            <Text variant="secondary" className="text-center">
              No notifications yet.
            </Text>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {notifications.map((notification) => {
              const badge = TYPE_BADGE[notification.type] ?? {
                label: notification.type,
                variant: "outline" as const,
              };

              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex flex-col gap-3 px-6 py-4 transition-colors sm:flex-row sm:items-start sm:justify-between",
                    !notification.isRead && "bg-blue-50/50",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread indicator */}
                    <span
                      className={cn(
                        "mt-2 size-2.5 shrink-0 rounded-full",
                        notification.isRead ? "bg-transparent" : "bg-blue-500",
                      )}
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <p className="text-btn font-black text-primary">
                          {notification.title}
                        </p>
                        <Badge variant={badge.variant} className="text-[10px]">
                          {badge.label}
                        </Badge>
                      </div>
                      <Text variant="secondary" className="mb-1.5">
                        {notification.message}
                      </Text>
                      <div className="flex items-center gap-1 text-slate-light">
                        <ClockIcon className="size-3.5" />
                        <Text variant="muted" size="label" className="normal-case tracking-normal">
                          {formatTimeAgo(notification.createdAt)}
                        </Text>
                      </div>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markingId === notification.id}
                      className="shrink-0 self-start rounded-full border border-surface-border px-4 py-1.5 text-label font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
                    >
                      {markingId === notification.id ? "..." : "Mark as read"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
