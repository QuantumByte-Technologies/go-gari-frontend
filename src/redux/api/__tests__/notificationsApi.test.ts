import { describe, it, expect } from "vitest";
import { createTestStore, createAuthenticatedState } from "@/test/test-utils";
import notificationsApi from "../notificationsApi";
import { mockNotification1, mockNotification2 } from "@/test/mocks/handlers";

describe("notificationsApi", () => {
  // ── getNotifications ──────────────────────────────────────────

  it("getNotifications returns paginated notification list", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      notificationsApi.endpoints.getNotifications.initiate(),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(2);
    expect(result.data?.results).toHaveLength(2);
    expect(result.data?.results[0].subject).toBe("Booking Confirmed");
    expect(result.data?.results[1].subject).toBe("Payment Received");
  });

  it("getNotifications filters by is_read=false", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      notificationsApi.endpoints.getNotifications.initiate({
        is_read: false,
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.results).toHaveLength(1);
    expect(result.data?.results[0].is_read).toBe(false);
    expect(result.data?.results[0].subject).toBe("Booking Confirmed");
  });

  it("getNotifications filters by is_read=true", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      notificationsApi.endpoints.getNotifications.initiate({
        is_read: true,
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.results).toHaveLength(1);
    expect(result.data?.results[0].is_read).toBe(true);
    expect(result.data?.results[0].subject).toBe("Payment Received");
  });

  // ── getUnreadCount ────────────────────────────────────────────

  it("getUnreadCount returns count of unread notifications", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      notificationsApi.endpoints.getUnreadCount.initiate(),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(1);
  });

  // ── markAsRead ────────────────────────────────────────────────

  it("markAsRead marks a notification as read", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      notificationsApi.endpoints.markAsRead.initiate(1),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(1);
    expect(result.data?.is_read).toBe(true);
  });

  it("markAsRead returns 404 for non-existent notification", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      notificationsApi.endpoints.markAsRead.initiate(999),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(404);
  });

  it("markAsRead returns 401 without authentication", async () => {
    const store = createTestStore(); // No auth state

    const result = await store.dispatch(
      notificationsApi.endpoints.markAsRead.initiate(1),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });
});
