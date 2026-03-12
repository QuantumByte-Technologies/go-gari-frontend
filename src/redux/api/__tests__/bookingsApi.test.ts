import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { createTestStore, createAuthenticatedState } from "@/test/test-utils";
import bookingsApi from "../bookingsApi";
import { mockBookingListItem, mockBookingDetail } from "@/test/mocks/handlers";

const API_BASE = "https://gogari.quantumbytetech.com/api/v1";

describe("bookingsApi", () => {
  // ── getBookings ───────────────────────────────────────────────

  it("getBookings returns paginated booking list", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      bookingsApi.endpoints.getBookings.initiate(),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(1);
    expect(result.data?.results).toHaveLength(1);
    expect(result.data?.results[0].booking_id).toBe("BK-20260401-001");
    expect(result.data?.results[0].car_name).toBe("Toyota Corolla 2023");
    expect(result.data?.results[0].status).toBe("confirmed");
  });

  it("getBookings passes status filter to API", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      bookingsApi.endpoints.getBookings.initiate({ status: "confirmed" }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.results).toHaveLength(1);
    expect(result.data?.results[0].status).toBe("confirmed");
  });

  it("getBookings with non-matching status returns empty results", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      bookingsApi.endpoints.getBookings.initiate({ status: "cancelled" }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(0);
    expect(result.data?.results).toHaveLength(0);
  });

  // ── getBookingById ────────────────────────────────────────────

  it("getBookingById returns booking detail for valid ID", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      bookingsApi.endpoints.getBookingById.initiate(1),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(1);
    expect(result.data?.booking_id).toBe("BK-20260401-001");
    expect(result.data?.car_name).toBe("Toyota Corolla 2023");
    expect(result.data?.num_days).toBe(4);
    expect(result.data?.pickup_location_address).toBe("Dhanmondi 27, Dhaka");
    expect(result.data?.rate_per_day).toBe("3500.00");
  });

  it("getBookingById returns 404 for non-existent booking", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      bookingsApi.endpoints.getBookingById.initiate(999),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(404);
  });

  // ── createBooking ─────────────────────────────────────────────

  it("createBooking sends payload and returns new booking", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      bookingsApi.endpoints.createBooking.initiate({
        car_id: 1,
        start_date: "2026-05-01",
        end_date: "2026-05-05",
        drive_type: "self_drive",
        pickup_location: { address: "Dhanmondi 27, Dhaka" },
        dropoff_location: { address: "Dhanmondi 27, Dhaka" },
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(2);
    expect(result.data?.booking_id).toBe("BK-20260401-002");
    expect(result.data?.status).toBe("pending_payment");
    expect(result.data?.drive_type).toBe("self_drive");
    expect(result.data?.pickup_location_address).toBe("Dhanmondi 27, Dhaka");
  });

  it("createBooking returns 400 when required fields are missing", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      bookingsApi.endpoints.createBooking.initiate({
        car_id: 0,
        start_date: "",
        end_date: "",
        drive_type: "self_drive",
        pickup_location: { address: "" },
        dropoff_location: { address: "" },
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(400);
  });

  it("createBooking returns 401 without authentication", async () => {
    const store = createTestStore(); // No auth state

    const result = await store.dispatch(
      bookingsApi.endpoints.createBooking.initiate({
        car_id: 1,
        start_date: "2026-05-01",
        end_date: "2026-05-05",
        drive_type: "self_drive",
        pickup_location: { address: "Dhanmondi 27, Dhaka" },
        dropoff_location: { address: "Dhanmondi 27, Dhaka" },
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });

  // ── cancelBooking ─────────────────────────────────────────────

  it("cancelBooking succeeds for pending_payment booking", async () => {
    const store = createTestStore(createAuthenticatedState());

    // ID=2 is not the mocked "confirmed" booking, so cancel succeeds
    const result = await store.dispatch(
      bookingsApi.endpoints.cancelBooking.initiate(2),
    );

    // 204 No Content — no error
    expect(result.error).toBeUndefined();
  });

  it("cancelBooking returns 400 for confirmed booking", async () => {
    const store = createTestStore(createAuthenticatedState());

    // ID=1 is the "confirmed" booking in our mock — can't cancel
    const result = await store.dispatch(
      bookingsApi.endpoints.cancelBooking.initiate(1),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(400);
  });
});
