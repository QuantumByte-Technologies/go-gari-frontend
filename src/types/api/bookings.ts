// ─── Bookings API types ──────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────
export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled"
  | "refunded";

export type DriveType = "self_drive" | "with_chauffeur";

// ── Request types ────────────────────────────────────────────────
export interface BookingCreateRequest {
  car_id: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  drive_type: DriveType;
  pickup_location: {
    address: string;
    lat?: string | null;
    lng?: string | null;
  };
  dropoff_location: {
    address: string;
    lat?: string | null;
    lng?: string | null;
  };
}

// ── Response types ───────────────────────────────────────────────
/** Booking as returned in list endpoints */
export interface BookingListItem {
  id: number;
  booking_id: string;
  car: number;
  car_name: string;
  car_brand: string;
  drive_type: DriveType;
  start_date: string;
  end_date: string;
  grand_total: string; // decimal as string
  status: BookingStatus;
  created_at: string;
}

/** Booking as returned in detail endpoint */
export interface BookingDetail extends BookingListItem {
  car: number;
  car_model: string;
  chauffeur: number | null;
  chauffeur_name: string;
  num_days: number;
  pickup_location_address: string;
  pickup_location_lat: string | null;
  pickup_location_lng: string | null;
  dropoff_location_address: string;
  dropoff_location_lat: string | null;
  dropoff_location_lng: string | null;
  rate_per_day: string;
  subtotal: string;
  discount_percentage: string;
  discount_amount: string;
  expires_at: string | null;
  updated_at: string;
}
