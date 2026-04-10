import { describe, it, expect } from "vitest";
import { createTestStore, createAuthenticatedState } from "@/test/test-utils";
import dashboardApi from "../dashboardApi";

describe("dashboardApi", () => {
  // ── getDashboardOverview ──────────────────────────────────────

  it("getDashboardOverview returns overview data", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      dashboardApi.endpoints.getDashboardOverview.initiate(),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.summary).toBeDefined();
    expect(result.data?.summary.total_bookings).toBe(5);
    expect(result.data?.summary.completed_trips).toBe(3);
    expect(result.data?.summary.unread_notifications).toBe(1);
    expect(result.data?.upcoming_bookings).toHaveLength(1);
    expect(result.data?.upcoming_bookings[0].booking_id).toBe(
      "BK-20260401-001",
    );
    expect(result.data?.active_trips).toHaveLength(1);
    expect(result.data?.pending_payments).toHaveLength(1);
    expect(result.data?.pending_payments[0].amount).toBe("18500.00");
    expect(result.data?.pending_payments[0].status).toBe("pending");
    expect(result.data?.recent_notifications).toHaveLength(1);
  });

  it("getDashboardOverview returns 401 without authentication", async () => {
    const store = createTestStore(); // No auth state

    const result = await store.dispatch(
      dashboardApi.endpoints.getDashboardOverview.initiate(),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });

  // ── getRefunds ────────────────────────────────────────────────

  it("getRefunds returns paginated refund list", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      dashboardApi.endpoints.getRefunds.initiate(),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(1);
    expect(result.data?.results).toHaveLength(1);
    expect(result.data?.results[0].booking_id).toBe("BK-20260201-003");
    expect(result.data?.results[0].amount).toBe("7000.00");
    expect(result.data?.results[0].status).toBe("processed");
  });

  it("getRefunds returns 401 without authentication", async () => {
    const store = createTestStore(); // No auth state

    const result = await store.dispatch(
      dashboardApi.endpoints.getRefunds.initiate(),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });
});
