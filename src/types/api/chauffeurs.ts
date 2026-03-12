// ─── Chauffeurs API types ────────────────────────────────────────

/** Chauffeur as returned in list endpoints */
export interface ChauffeurListItem {
  id: number;
  user: string;
  photo: string;
  experience_years: number;
  is_verified: boolean;
  average_rating: string; // decimal as string
  total_trips: number;
}

/** Chauffeur as returned in detail endpoint */
export interface ChauffeurDetail extends ChauffeurListItem {
  bio: string;
  is_active: boolean;
  documents: string;
  reviews_count: string;
  created_at: string;
  updated_at: string;
}

/** Review for a chauffeur */
export interface ChauffeurReview {
  id: number;
  user: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
}

/** Request to create a chauffeur review */
export interface ChauffeurReviewCreateRequest {
  rating: number;
  review_text?: string;
  booking_id: number;
}

/** Request to update a chauffeur review */
export interface ChauffeurReviewUpdateRequest {
  rating?: number;
  review_text?: string;
}
