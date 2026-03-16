import { describe, it, expect } from "vitest";
import { bookingCreateSchema } from "@/schemas/booking";

describe("bookingCreateSchema", () => {
  const validBooking = {
    car_id: 1,
    start_date: "2026-04-01",
    end_date: "2026-04-05",
    drive_type: "self_drive" as const,
    pickup_location: {
      address: "Dhanmondi 27, Dhaka",
      lat: "23.7461",
      lng: "90.3742",
    },
    dropoff_location: {
      address: "Dhanmondi 27, Dhaka",
      lat: "23.7461",
      lng: "90.3742",
    },
  };

  it("accepts valid booking data", () => {
    const result = bookingCreateSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  it("accepts with_chauffeur drive type", () => {
    const result = bookingCreateSchema.safeParse({
      ...validBooking,
      drive_type: "with_chauffeur",
    });
    expect(result.success).toBe(true);
  });

  it("accepts location without lat/lng", () => {
    const result = bookingCreateSchema.safeParse({
      ...validBooking,
      pickup_location: { address: "Dhaka" },
      dropoff_location: { address: "Chittagong" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing car_id", () => {
    const { car_id, ...rest } = validBooking;
    const result = bookingCreateSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects invalid drive_type", () => {
    const result = bookingCreateSchema.safeParse({
      ...validBooking,
      drive_type: "invalid_type",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty start_date", () => {
    const result = bookingCreateSchema.safeParse({
      ...validBooking,
      start_date: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty end_date", () => {
    const result = bookingCreateSchema.safeParse({
      ...validBooking,
      end_date: "",
    });
    expect(result.success).toBe(false);
  });

  it("requires pickup_location.address", () => {
    const result = bookingCreateSchema.safeParse({
      ...validBooking,
      pickup_location: { address: "" },
    });
    expect(result.success).toBe(false);
  });

  it("requires dropoff_location.address", () => {
    const result = bookingCreateSchema.safeParse({
      ...validBooking,
      dropoff_location: { address: "" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative car_id", () => {
    const result = bookingCreateSchema.safeParse({
      ...validBooking,
      car_id: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer car_id", () => {
    const result = bookingCreateSchema.safeParse({
      ...validBooking,
      car_id: 1.5,
    });
    expect(result.success).toBe(false);
  });
});
