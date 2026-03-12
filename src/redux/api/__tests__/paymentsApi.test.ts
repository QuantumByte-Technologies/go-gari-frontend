import { describe, it, expect } from "vitest";
import { createTestStore, createAuthenticatedState } from "@/test/test-utils";
import paymentsApi from "../paymentsApi";

describe("paymentsApi", () => {
  // ── initiatePayment ───────────────────────────────────────────

  it("initiatePayment returns payment_url for valid booking", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      paymentsApi.endpoints.initiatePayment.initiate({ booking_id: 2 }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.payment_url).toContain("sandbox.sslcommerz.com");
    expect(result.data?.tran_id).toContain("TXN-2-");
  });

  it("initiatePayment returns 400 for already-paid booking", async () => {
    const store = createTestStore(createAuthenticatedState());

    // booking_id=100 triggers already-paid error in mock handler
    const result = await store.dispatch(
      paymentsApi.endpoints.initiatePayment.initiate({ booking_id: 100 }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(400);
  });

  it("initiatePayment returns 401 without authentication", async () => {
    const store = createTestStore(); // No auth state

    const result = await store.dispatch(
      paymentsApi.endpoints.initiatePayment.initiate({ booking_id: 2 }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });
});
