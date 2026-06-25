"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  CheckCheckIcon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
  UserPlusIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useMarkAllRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/use-notifications";
import { cn, timeAgo } from "@/lib/utils";
import type { Notification } from "@/types/notification";

const TYPE_ICONS: Record<string, typeof BellIcon> = {
  SERVICE_COMPLETED: ClipboardCheckIcon,
  SERVICE_CONFIRMED: CheckCircle2Icon,
  SERVICE_ASSIGNED: UserPlusIcon,
};

function entityHref(notification: Notification): string | null {
  if (notification.entityType === "Service" && notification.entityId) {
    return `/servicos/${notification.entityId}`;
  }
  return null;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();

  const notifications = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  function handleClick(notification: Notification) {
    if (!notification.readAt) {
      markRead.mutate(notification.id);
    }
    const href = entityHref(notification);
    if (href) {
      setOpen(false);
      router.push(href);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip content="Notificações">
        <PopoverTrigger asChild>
          <button
            type="button"
            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <BellIcon className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-medium text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
      </Tooltip>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <p className="text-sm font-semibold">Notificações</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <CheckCheckIcon className="h-3.5 w-3.5" />
              Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <BellIcon className="h-6 w-6 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação por aqui.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = TYPE_ICONS[notification.type] ?? BellIcon;
                const isUnread = !notification.readAt;
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => handleClick(notification)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                        isUnread && "bg-brand-50/50",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                          isUnread
                            ? "bg-brand-100 text-brand-700"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="text-sm font-medium leading-tight text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.body}
                        </p>
                        <p className="text-[11px] text-muted-foreground/70">
                          {timeAgo(notification.createdAt)}
                        </p>
                      </div>
                      {isUnread && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
