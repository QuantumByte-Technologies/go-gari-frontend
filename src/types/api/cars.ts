// ─── Cars API types ──────────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────
export type CarCategory = "economy" | "premium" | "suv";
export type Transmission = "auto" | "manual";
export type FuelType = "petrol" | "diesel" | "octane" | "hybrid" | "electric" | "cng";
export type DriveOption = "both" | "self_drive_only" | "chauffeur_only";

// ── Data types ───────────────────────────────────────────────────
export interface CarImage {
  id: number;
  car: number;
  image: string;
  is_primary: boolean;
  order: number;
}

/** Car as returned in list endpoints (e.g., /api/v1/cars/) */
export interface CarListItem {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  seats: number;
  transmission: Transmission;
  fuel_type: FuelType;
  drive_option: DriveOption;
  rate_per_day: string; // decimal as string from API
  chauffeur_rate_per_day: string;
  city: string;
  pickup_location_address: string;
  dropoff_location_address: string;
  is_active: boolean;
  primary_image: string;
}

/** Car as returned in detail endpoint (e.g., /api/v1/cars/{id}/) */
export interface CarDetail extends Omit<CarListItem, "primary_image"> {
  tags: Record<string, unknown>;
  description: string;
  pickup_location_lat: string | null;
  pickup_location_lng: string | null;
  dropoff_location_lat: string | null;
  dropoff_location_lng: string | null;
  created_at: string;
  updated_at: string;
  images: CarImage[];
  unavailable_dates: string;
}

/** Query parameters for the car search/list endpoint */
export interface CarSearchParams {
  category?: CarCategory;
  city?: string;
  transmission?: Transmission;
  fuel_type?: FuelType;
  drive_option?: DriveOption;
  seats?: number;
  seats_min?: number;
  min_price?: number;
  max_price?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  ordering?: string;
  page?: number;
}

/** Parameters for the car availability check endpoint */
export interface CarAvailabilityParams {
  id: number;
  start_date: string;
  end_date: string;
}

/** Response from the car availability check endpoint */
export interface CarAvailabilityResponse {
  available: boolean;
}

/** Response from the booked-dates endpoint */
export interface UnavailableDateEntry {
  date: string;
  reason: string;
}

export interface CarBookedDatesResponse {
  car_id: number;
  unavailable_dates: UnavailableDateEntry[];
}

/** Parameters for nearby cars endpoint */
export interface NearbyCarParams {
  lat: number;
  lng: number;
  radius?: number; // km, defaults to 10
  page?: number;
}
