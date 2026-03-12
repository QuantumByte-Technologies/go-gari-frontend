// ─── Booking Draft type (matches what PricingCard writes to localStorage) ──
import type { DriveType } from "@/types/api/bookings";

export interface BookingDraftPricing {
  numDays: number;
  ratePerDay: string;
  subtotal: string;
  discountPercentage: string;
  discountAmount: string;
  grandTotal: string;
}

export interface BookingDraft {
  carId: number;
  carName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  pickupTime: string;
  dropoffTime: string;
  driveType: DriveType;
  pricing: BookingDraftPricing | null;
}

/** Read and validate the booking draft from localStorage */
export function getBookingDraft(): BookingDraft | null {
  try {
    const raw = localStorage.getItem("booking_draft");
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Basic validation
    if (
      typeof parsed.carId !== "number" ||
      typeof parsed.carName !== "string" ||
      typeof parsed.startDate !== "string" ||
      typeof parsed.endDate !== "string" ||
      typeof parsed.driveType !== "string"
    ) {
      return null;
    }

    return parsed as BookingDraft;
  } catch {
    return null;
  }
}

/** Clear the booking draft from localStorage */
export function clearBookingDraft(): void {
  try {
    localStorage.removeItem("booking_draft");
  } catch {
    // Ignore
  }
}

/** Format a BDT amount from a decimal string or number */
export function formatBDT(value: string | number): string {
  const num = typeof value === "number" ? value : parseFloat(value);
  if (Number.isNaN(num)) return `৳${value}`;
  return `৳${num.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}
