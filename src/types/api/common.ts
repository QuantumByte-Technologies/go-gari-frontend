// ─── Shared API types ────────────────────────────────────────────

/** Paginated response wrapper matching DRF's PageNumberPagination */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Location object used in bookings */
export interface Location {
  address: string;
  lat: string | null;
  lng: string | null;
}

/** Generic API error response from DRF */
export interface ApiError {
  detail?: string;
  [field: string]: string | string[] | undefined;
}

/** Generic API success message */
export interface ApiMessage {
  detail: string;
}
