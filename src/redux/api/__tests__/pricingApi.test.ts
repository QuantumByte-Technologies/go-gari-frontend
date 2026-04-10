import { describe, it, expect } from "vitest";
import { createTestStore } from "@/test/test-utils";
import pricingApi from "../pricingApi";

describe("pricingApi", () => {
  it("calculatePricing returns correct pricing for self_drive", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      pricingApi.endpoints.calculatePricing.initiate({
        car_id: 1,
        start_date: "2026-05-01",
        end_date: "2026-05-04",
        with_chauffeur: false,
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.num_days).toBe(3);
    expect(result.data?.rate_per_day).toBe("3500.00");
    expect(result.data?.subtotal).toBe("10500.00");
    expect(result.data?.discount_percentage).toBe("0.00");
    expect(result.data?.discount_amount).toBe("0.00");
    expect(result.data?.grand_total).toBe("10500.00");
  });

  it("calculatePricing returns higher rate for with_chauffeur", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      pricingApi.endpoints.calculatePricing.initiate({
        car_id: 1,
        start_date: "2026-05-01",
        end_date: "2026-05-04",
        with_chauffeur: true,
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.rate_per_day).toBe("5000.00");
    expect(result.data?.subtotal).toBe("15000.00");
    expect(result.data?.grand_total).toBe("15000.00");
  });

  it("calculatePricing applies discount for 7+ day rental", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      pricingApi.endpoints.calculatePricing.initiate({
        car_id: 1,
        start_date: "2026-05-01",
        end_date: "2026-05-08",
        with_chauffeur: false,
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.num_days).toBe(7);
    expect(result.data?.discount_percentage).toBe("10.00");
    // subtotal = 3500 * 7 = 24500, discount = 2450
    expect(result.data?.subtotal).toBe("24500.00");
    expect(result.data?.discount_amount).toBe("2450.00");
    expect(result.data?.grand_total).toBe("22050.00");
  });
});
