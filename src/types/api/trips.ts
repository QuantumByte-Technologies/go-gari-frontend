// ─── Trips API types ─────────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────
export type TripStatus = "upcoming" | "active" | "completed";
export type PhotoType = "pre_trip" | "post_trip";

// ── Data types ───────────────────────────────────────────────────
export interface TripPhoto {
  id: number;
  photo: string;
  photo_type: PhotoType;
  timestamp: string;
  caption: string;
}

/** Trip as returned in list endpoints */
export interface TripListItem {
  id: number;
  booking_id: string;
  car_name: string;
  status: TripStatus;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

/** Trip as returned in detail endpoint */
export interface TripDetail extends TripListItem {
  drive_type: string;
  start_date: string;
  end_date: string;
  updated_at: string;
  photos: TripPhoto[];
}
