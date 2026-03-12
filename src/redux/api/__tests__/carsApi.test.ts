import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { createTestStore } from "@/test/test-utils";
import carsApi from "../carsApi";
import {
  mockCarListItem1,
  mockCarListItem2,
  mockCarListItem3,
  mockCarDetail,
} from "@/test/mocks/handlers";

const API_BASE = "https://gogari.quantumbytetech.com/api/v1";

describe("carsApi", () => {
  // ── getCars ─────────────────────────────────────────────────────

  it("getCars returns paginated car list", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getCars.initiate({}),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(3);
    expect(result.data?.results).toHaveLength(3);
    expect(result.data?.results[0].name).toBe("Toyota Corolla 2023");
    expect(result.data?.results[1].name).toBe("Honda Civic 2024");
    expect(result.data?.results[2].name).toBe("Mitsubishi Pajero 2022");
  });

  it("getCars passes category filter to API", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getCars.initiate({ category: "economy" }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.results).toHaveLength(1);
    expect(result.data?.results[0].category).toBe("economy");
  });

  it("getCars returns empty results for non-matching filter", async () => {
    server.use(
      http.get(`${API_BASE}/cars/`, () => {
        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: [],
        });
      }),
    );

    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getCars.initiate({ city: "Sylhet" }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(0);
    expect(result.data?.results).toHaveLength(0);
  });

  // ── getCarById ──────────────────────────────────────────────────

  it("getCarById returns car detail for valid ID", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getCarById.initiate(1),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(1);
    expect(result.data?.name).toBe("Toyota Corolla 2023");
    expect(result.data?.description).toBe(
      "Well-maintained Toyota Corolla in excellent condition.",
    );
    expect(result.data?.images).toHaveLength(1);
    expect(result.data?.pickup_location_address).toBe("Dhanmondi 27, Dhaka");
  });

  it("getCarById returns 404 for non-existent car", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getCarById.initiate(999),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(404);
  });

  // ── getCarAvailability ──────────────────────────────────────────

  it("getCarAvailability returns available=true for car 1", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getCarAvailability.initiate({
        id: 1,
        start_date: "2026-05-01",
        end_date: "2026-05-05",
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.available).toBe(true);
  });

  it("getCarAvailability returns available=false for car 2", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getCarAvailability.initiate({
        id: 2,
        start_date: "2026-05-01",
        end_date: "2026-05-05",
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.available).toBe(false);
  });

  // ── getCarBookedDates ───────────────────────────────────────────

  it("getCarBookedDates returns an array of date strings", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getCarBookedDates.initiate(1),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.booked_dates).toEqual([
      "2026-04-01",
      "2026-04-02",
      "2026-04-03",
    ]);
  });

  // ── getCarChauffeurs ────────────────────────────────────────────

  it("getCarChauffeurs returns paginated chauffeur list", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getCarChauffeurs.initiate({ id: 1 }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(1);
    expect(result.data?.results[0].user).toBe("Karim Rahman");
    expect(result.data?.results[0].is_verified).toBe(true);
  });

  // ── getNearbyCars ───────────────────────────────────────────────

  it("getNearbyCars returns cars near given coordinates", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      carsApi.endpoints.getNearbyCars.initiate({
        lat: 23.8103,
        lng: 90.4125,
        radius: 50,
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(3);
    expect(result.data?.results).toHaveLength(3);
    expect(result.data?.results[0].name).toBe("Toyota Corolla 2023");
  });
});
