import { z } from "zod";

// ─── Booking Create ──────────────────────────────────────────────
export const locationSchema = z.object({
  address: z.string().min(1, "Address is required").max(500),
  lat: z.string().nullable().optional(),
  lng: z.string().nullable().optional(),
});

export const bookingCreateSchema = z.object({
  car_id: z.number().int().positive("Car selection is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  drive_type: z.enum(["self_drive", "with_chauffeur"], {
    message: "Please select a drive type",
  }),
  pickup_location: locationSchema,
  dropoff_location: locationSchema,
});

// ─── Inferred types ──────────────────────────────────────────────
export type BookingCreateFormData = z.infer<typeof bookingCreateSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
