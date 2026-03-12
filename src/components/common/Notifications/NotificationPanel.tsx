"use client";

import React, { useCallback } from "react";
import {
  BellSlash,
  Circle,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/redux/api/notificationsApi";
import type { Notification } from "@/types/api/notifications";

const BRAND = "#65AA36";

type Props = {
  onClose?: () => void;
};

/** Format relative time (e.g. "2h ago", "3d ago") */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function NotificationPanel({ onClose }: Props) {
  const router = useRouter();
  const { data, isLoading } = useGetNotificationsQuery({ page: 1 });
  const [markAsRead] = useMarkAsReadMutation();

  const notifications = data?.results ?? [];

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (!notification.is_read) {
        try {
          await markAsRead(notification.id).unwrap();
        } catch {
          // silent fail — UX still proceeds
        }
      }
    },
    [markAsRead],
  );

  const handleViewAll = () => {
    onClose?.();
    router.push("/dashboard?tab=inbox");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4" data-testid="notification-panel-loading">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 py-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div data-testid="notification-panel">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Notifications</h3>
        {notifications.some((n) => !n.is_read) && (
          <span className="text-xs font-medium" style={{ color: BRAND }}>
            {notifications.filter((n) => !n.is_read).length} unread
          </span>
        )}
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <BellSlash
            size={36}
            weight="duotone"
            className="text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500 text-sm">No notifications</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-gray-50 cursor-pointer ${
                !notification.is_read ? "bg-green-50/50" : ""
              }`}
              data-testid={`notification-item-${notification.id}`}
            >
              {/* Read/unread indicator */}
              <div className="flex-shrink-0 mt-1">
                {notification.is_read ? (
                  <CheckCircle
                    size={16}
                    weight="fill"
                    className="text-gray-300"
                  />
                ) : (
                  <Circle
                    size={16}
                    weight="fill"
                    style={{ color: BRAND }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-tight ${
                    !notification.is_read
                      ? "font-semibold text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  {notification.subject}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {notification.message}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {timeAgo(notification.created_at)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100">
          <button
            onClick={handleViewAll}
            className="w-full flex items-center justify-center gap-1 text-sm font-medium transition-colors hover:opacity-80 cursor-pointer"
            style={{ color: BRAND }}
          >
            View all notifications
            <ArrowRight size={14} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
}
