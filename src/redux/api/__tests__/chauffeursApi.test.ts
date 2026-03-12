import { describe, it, expect } from "vitest";
import { createTestStore, createAuthenticatedState } from "@/test/test-utils";
import chauffeursApi from "../chauffeursApi";
import {
  mockChauffeurListItem1,
  mockChauffeurListItem2,
  mockChauffeurDetail,
  mockChauffeurReview1,
  mockChauffeurReview2,
} from "@/test/mocks/handlers";

describe("chauffeursApi", () => {
  // ── getChauffeurs ───────────────────────────────────────────────

  it("getChauffeurs returns paginated chauffeur list", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      chauffeursApi.endpoints.getChauffeurs.initiate(),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(2);
    expect(result.data?.results).toHaveLength(2);
    expect(result.data?.results[0].user).toBe(mockChauffeurListItem1.user);
    expect(result.data?.results[0].average_rating).toBe("4.80");
    expect(result.data?.results[1].user).toBe(mockChauffeurListItem2.user);
  });

  it("getChauffeurs filters by search term", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      chauffeursApi.endpoints.getChauffeurs.initiate({ search: "Karim" }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.results).toHaveLength(1);
    expect(result.data?.results[0].user).toBe("Karim Rahman");
  });

  // ── getChauffeurById ──────────────────────────────────────────

  it("getChauffeurById returns chauffeur detail", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      chauffeursApi.endpoints.getChauffeurById.initiate(1),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.user).toBe(mockChauffeurDetail.user);
    expect(result.data?.bio).toBe(mockChauffeurDetail.bio);
    expect(result.data?.is_active).toBe(true);
    expect(result.data?.reviews_count).toBe("12");
  });

  it("getChauffeurById returns 404 for non-existent chauffeur", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      chauffeursApi.endpoints.getChauffeurById.initiate(999),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(404);
  });

  // ── getChauffeurReviews ───────────────────────────────────────

  it("getChauffeurReviews returns paginated reviews", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      chauffeursApi.endpoints.getChauffeurReviews.initiate({ id: 1 }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(2);
    expect(result.data?.results).toHaveLength(2);
    expect(result.data?.results[0].user).toBe(mockChauffeurReview1.user);
    expect(result.data?.results[0].rating).toBe(5);
    expect(result.data?.results[1].user).toBe(mockChauffeurReview2.user);
    expect(result.data?.results[1].rating).toBe(4);
  });

  // ── createChauffeurReview ─────────────────────────────────────

  it("createChauffeurReview creates a review with auth", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      chauffeursApi.endpoints.createChauffeurReview.initiate({
        id: 1,
        data: { rating: 5, review_text: "Excellent driver!", booking_id: 1 },
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(3);
    expect(result.data?.rating).toBe(5);
    expect(result.data?.review_text).toBe("Excellent driver!");
  });

  it("createChauffeurReview returns 401 without auth", async () => {
    const store = createTestStore(); // No auth

    const result = await store.dispatch(
      chauffeursApi.endpoints.createChauffeurReview.initiate({
        id: 1,
        data: { rating: 5, review_text: "Great!", booking_id: 1 },
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });

  it("createChauffeurReview returns 400 for duplicate review", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      chauffeursApi.endpoints.createChauffeurReview.initiate({
        id: 1,
        data: { rating: 4, review_text: "Duplicate", booking_id: 999 },
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(400);
  });

  // ── updateChauffeurReview ─────────────────────────────────────

  it("updateChauffeurReview updates an existing review", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      chauffeursApi.endpoints.updateChauffeurReview.initiate({
        chauffeurId: 1,
        reviewId: 1,
        data: { rating: 4, review_text: "Updated review" },
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(1);
    expect(result.data?.rating).toBe(4);
    expect(result.data?.review_text).toBe("Updated review");
  });

  it("updateChauffeurReview returns 404 for non-existent review", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      chauffeursApi.endpoints.updateChauffeurReview.initiate({
        chauffeurId: 1,
        reviewId: 999,
        data: { rating: 3 },
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(404);
  });

  // ── deleteChauffeurReview ─────────────────────────────────────

  it("deleteChauffeurReview deletes a review with auth", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      chauffeursApi.endpoints.deleteChauffeurReview.initiate({
        chauffeurId: 1,
        reviewId: 1,
      }),
    );

    expect(result.error).toBeUndefined();
  });

  it("deleteChauffeurReview returns 401 without auth", async () => {
    const store = createTestStore(); // No auth

    const result = await store.dispatch(
      chauffeursApi.endpoints.deleteChauffeurReview.initiate({
        chauffeurId: 1,
        reviewId: 1,
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });

  it("deleteChauffeurReview returns 404 for non-existent review", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      chauffeursApi.endpoints.deleteChauffeurReview.initiate({
        chauffeurId: 1,
        reviewId: 999,
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(404);
  });
});
