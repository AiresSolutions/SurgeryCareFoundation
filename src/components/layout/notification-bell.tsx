"use client";

import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { notificationService } from "@/services/notification.service";
import { BellIcon } from "@/components/ui/icons";

export function NotificationBell() {
  const { data } = useApi(
    () => notificationService.getUnreadCount(),
    [],
  );

  const count = data?.count ?? 0;

  return (
    <Link
      href="/dashboard/notifications"
      className="relative inline-flex items-center justify-center rounded-lg p-2 text-slate transition-colors hover:bg-surface-page"
      aria-label={count > 0 ? `${count} unread notifications` : "Notifications"}
    >
      <BellIcon className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
