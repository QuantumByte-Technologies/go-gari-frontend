import { z } from "zod";

// ─── Chauffeur Review ────────────────────────────────────────────
export const chauffeurReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  review_text: z.string().optional().default(""),
  booking_id: z.number().int().positive("Booking ID is required"),
});

// ─── Inferred types ──────────────────────────────────────────────
export type ChauffeurReviewFormData = z.infer<typeof chauffeurReviewSchema>;
