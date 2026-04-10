// ─── Client Dashboard API types ──────────────────────────────────

import type { BookingListItem } from "./bookings";
import type { TripListItem } from "./trips";
import type { Notification } from "./notifications";
import type { PaymentRecord } from "./payments";

/** Summary counts at the top of the dashboard */
export interface DashboardSummary {
  total_bookings: number;
  completed_trips: number;
  unread_notifications: number;
}

/** Response from /api/v1/client/dashboard/ */
export interface DashboardOverview {
  summary: DashboardSummary;
  upcoming_bookings: BookingListItem[];
  active_trips: TripListItem[];
  pending_payments: PaymentRecord[];
  recent_notifications: Notification[];
}
