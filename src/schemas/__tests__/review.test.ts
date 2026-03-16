import { describe, it, expect } from "vitest";
import { chauffeurReviewSchema } from "@/schemas/review";

describe("chauffeurReviewSchema", () => {
  it("accepts valid review data", () => {
    const result = chauffeurReviewSchema.safeParse({
      rating: 5,
      review_text: "Great chauffeur!",
      booking_id: 1,
    });
    expect(result.success).toBe(true);
  });

  it("accepts review without review_text (optional)", () => {
    const result = chauffeurReviewSchema.safeParse({
      rating: 4,
      booking_id: 2,
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimum rating of 1", () => {
    const result = chauffeurReviewSchema.safeParse({
      rating: 1,
      booking_id: 1,
    });
    expect(result.success).toBe(true);
  });

  it("accepts maximum rating of 5", () => {
    const result = chauffeurReviewSchema.safeParse({
      rating: 5,
      booking_id: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating less than 1", () => {
    const result = chauffeurReviewSchema.safeParse({
      rating: 0,
      booking_id: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects rating greater than 5", () => {
    const result = chauffeurReviewSchema.safeParse({
      rating: 6,
      booking_id: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer rating", () => {
    const result = chauffeurReviewSchema.safeParse({
      rating: 4.5,
      booking_id: 1,
    });
    expect(result.success).toBe(false);
  });

  it("requires booking_id", () => {
    const result = chauffeurReviewSchema.safeParse({
      rating: 5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative booking_id", () => {
    const result = chauffeurReviewSchema.safeParse({
      rating: 5,
      booking_id: -1,
    });
    expect(result.success).toBe(false);
  });
});
