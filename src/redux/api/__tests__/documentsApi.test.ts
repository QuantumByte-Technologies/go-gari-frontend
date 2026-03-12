import { describe, it, expect } from "vitest";
import { createTestStore, createAuthenticatedState } from "@/test/test-utils";
import documentsApi from "../documentsApi";
import {
  mockDocument1,
  mockDocument2,
  mockDocument3,
} from "@/test/mocks/handlers";

describe("documentsApi", () => {
  // ── getDocuments ──────────────────────────────────────────────

  it("getDocuments returns paginated document list", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      documentsApi.endpoints.getDocuments.initiate(),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(3);
    expect(result.data?.results).toHaveLength(3);
    expect(result.data?.results[0].document_type).toBe("driving_license");
    expect(result.data?.results[0].status).toBe("approved");
    expect(result.data?.results[1].document_type).toBe("nid_front");
    expect(result.data?.results[1].status).toBe("pending");
    expect(result.data?.results[2].document_type).toBe("passport");
    expect(result.data?.results[2].status).toBe("rejected");
  });

  it("getDocuments returns 401 without authentication", async () => {
    const store = createTestStore(); // No auth state

    const result = await store.dispatch(
      documentsApi.endpoints.getDocuments.initiate(),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });

  // ── uploadDocument ────────────────────────────────────────────

  it("uploadDocument returns new document on success", async () => {
    const store = createTestStore(createAuthenticatedState());

    const formData = new FormData();
    formData.append("document_type", "nid_back");
    formData.append("document_number", "NID-9876543210");

    const result = await store.dispatch(
      documentsApi.endpoints.uploadDocument.initiate(formData),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(4);
    expect(result.data?.document_type).toBe("nid_back");
    expect(result.data?.status).toBe("pending");
  });

  it("uploadDocument returns 401 without authentication", async () => {
    const store = createTestStore(); // No auth state

    const formData = new FormData();
    formData.append("document_type", "nid_back");

    const result = await store.dispatch(
      documentsApi.endpoints.uploadDocument.initiate(formData),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });

  // ── deleteDocument ────────────────────────────────────────────

  it("deleteDocument succeeds for rejected document", async () => {
    const store = createTestStore(createAuthenticatedState());

    // ID=3 is the rejected document — can be deleted
    const result = await store.dispatch(
      documentsApi.endpoints.deleteDocument.initiate(3),
    );

    expect(result.error).toBeUndefined();
  });

  it("deleteDocument returns 400 for approved document", async () => {
    const store = createTestStore(createAuthenticatedState());

    // ID=1 is the approved document — can't delete
    const result = await store.dispatch(
      documentsApi.endpoints.deleteDocument.initiate(1),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(400);
  });

  it("deleteDocument returns 401 without authentication", async () => {
    const store = createTestStore(); // No auth state

    const result = await store.dispatch(
      documentsApi.endpoints.deleteDocument.initiate(3),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);
  });

  it("deleteDocument returns 404 for non-existent document", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      documentsApi.endpoints.deleteDocument.initiate(999),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(404);
  });
});
