import { describe, it, expect } from "vitest";
import { createTestStore, createAuthenticatedState } from "@/test/test-utils";
import tripsApi from "../tripsApi";
import {
  mockTripListItem,
  mockActiveTripListItem,
  mockCompletedTripListItem,
  mockTripDetail,
} from "@/test/mocks/handlers";

describe("tripsApi", () => {
  // ── getTrips ──────────────────────────────────────────────────

  it("getTrips returns paginated trip list", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      tripsApi.endpoints.getTrips.initiate(),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(3);
    expect(result.data?.results).toHaveLength(3);
    expect(result.data?.results[0].car_name).toBe("Toyota Corolla 2023");
    expect(result.data?.results[1].car_name).toBe("Honda Civic 2024");
    expect(result.data?.results[2].car_name).toBe("Mitsubishi Pajero 2022");
  });

  it("getTrips filters by status=active", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      tripsApi.endpoints.getTrips.initiate({ status: "active" }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.results).toHaveLength(1);
    expect(result.data?.results[0].status).toBe("active");
    expect(result.data?.results[0].car_name).toBe("Honda Civic 2024");
  });

  it("getTrips filters by status=completed", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      tripsApi.endpoints.getTrips.initiate({ status: "completed" }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.results).toHaveLength(1);
    expect(result.data?.results[0].status).toBe("completed");
  });

  // ── getTripById ───────────────────────────────────────────────

  it("getTripById returns trip detail for valid ID", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      tripsApi.endpoints.getTripById.initiate(1),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(1);
    expect(result.data?.booking_id).toBe("BK-20260401-001");
    expect(result.data?.drive_type).toBe("self_drive");
  });

  it("getTripById returns 404 for non-existent trip", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      tripsApi.endpoints.getTripById.initiate(999),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(404);
  });

  // ── completeTrip ──────────────────────────────────────────────

  it("completeTrip succeeds for valid trip ID", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      tripsApi.endpoints.completeTrip.initiate(1),
    );

    expect(result.error).toBeUndefined();
  });

  it("completeTrip returns 404 for non-existent trip", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      tripsApi.endpoints.completeTrip.initiate(999),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(404);
  });

  it("completeTrip returns 401 without authentication", async () => {
    const store = createTestStore(); // No auth state

    const result = await store.dispatch(
      tripsApi.endpoints.completeTrip.initiate(1),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });

  // ── getTripPhotos ─────────────────────────────────────────────

  it("getTripPhotos returns photo list for valid trip", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      tripsApi.endpoints.getTripPhotos.initiate({ id: 1 }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(0);
    expect(result.data?.results).toHaveLength(0);
  });
});
