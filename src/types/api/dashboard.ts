// ─── Client Dashboard API types ──────────────────────────────────

import type { BookingListItem } from "./bookings";
import type { TripListItem } from "./trips";
import type { Notification } from "./notifications";

/** Response from /api/v1/client/dashboard/ */
export interface DashboardOverview {
  upcoming_bookings: BookingListItem[];
  active_trips: TripListItem[];
  pending_payments: {
    id: number;
    booking_id: string;
    grand_total: string;
    expires_at: string | null;
  }[];
  recent_notifications: Notification[];
}
