// ─── Notifications API types ─────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────
export type NotificationChannel = "email" | "sms" | "in_app" | "all";

// ── Data types ───────────────────────────────────────────────────
export interface Notification {
  id: number;
  user: number;
  notification_type: string;
  channel: NotificationChannel;
  subject: string;
  message: string;
  is_read: boolean;
  is_sent: boolean;
  sent_at: string | null;
  created_at: string;
}

/** Response from the unread-count endpoint */
export interface UnreadCountResponse {
  count: number;
}
