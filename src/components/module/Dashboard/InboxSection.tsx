"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  EnvelopeSimple,
  Spinner,
} from "@phosphor-icons/react";
import { useGetNotificationsQuery } from "@/redux/api/notificationsApi";
import type { Notification } from "@/types/api/notifications";
import { Button } from "@/components/ui/button";

export default function InboxSection() {
  const {
    data,
    isLoading,
    error,
  } = useGetNotificationsQuery();

  const notifications = data?.results ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="inbox-loading">
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">Failed to load notifications</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-[#5E9D34] text-white text-sm font-semibold rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} weight="duotone" className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No notifications
          </h3>
          <p className="text-gray-500">
            You&apos;re all caught up! No notifications to show.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  const timeAgo = getTimeAgo(notification.created_at);

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition-colors ${
        notification.is_read
          ? "border-gray-200"
          : "border-[#5E9D34] shadow-sm"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <EnvelopeSimple
              size={24}
              weight={notification.is_read ? "duotone" : "fill"}
              className={
                notification.is_read ? "text-gray-400" : "text-[#5E9D34]"
              }
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">
                {notification.subject}
              </span>
              {!notification.is_read && (
                <span className="w-2 h-2 bg-[#5E9D34] rounded-full" />
              )}
            </div>
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400">{timeAgo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
