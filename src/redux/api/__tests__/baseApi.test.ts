import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { createTestStore, createAuthenticatedState } from "@/test/test-utils";
// Import authApi to ensure endpoints are injected into baseApi
import authApi from "../authApi";
import type { RootState } from "@/redux/store";

const API_BASE = "https://gogari.quantumbytetech.com/api/v1";

describe("baseApi", () => {
  describe("Authorization header", () => {
    it("includes Bearer prefix when token exists", async () => {
      let capturedAuthHeader: string | null = null;

      server.use(
        http.get(`${API_BASE}/accounts/profile/`, ({ request }) => {
          capturedAuthHeader = request.headers.get("Authorization");
          return HttpResponse.json({ id: 1, email: "test@example.com" });
        }),
      );

      const store = createTestStore(createAuthenticatedState());

      // Trigger a query to the profile endpoint
      store.dispatch(
        authApi.endpoints.getProfile.initiate(undefined, {
          forceRefetch: true,
        }) as any,
      );

      // Wait for the request to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(capturedAuthHeader).toBe("Bearer mock-access-token");
    });

    it("does not include Authorization header when no token", async () => {
      let capturedAuthHeader: string | null = "should-be-null";

      server.use(
        http.get(`${API_BASE}/accounts/profile/`, ({ request }) => {
          capturedAuthHeader = request.headers.get("Authorization");
          return HttpResponse.json(
            { detail: "Authentication credentials were not provided." },
            { status: 401 },
          );
        }),
      );

      const store = createTestStore({
        auth: { user: null, accessToken: null, refreshToken: null },
      });

      store.dispatch(
        authApi.endpoints.getProfile.initiate(undefined, {
          forceRefetch: true,
        }) as any,
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(capturedAuthHeader).toBeNull();
    });
  });

  describe("baseQueryWithReauth", () => {
    it("retries request on 401 with refreshed token", async () => {
      let requestCount = 0;

      server.use(
        http.get(`${API_BASE}/accounts/profile/`, ({ request }) => {
          requestCount++;
          const auth = request.headers.get("Authorization");

          // First request with old token returns 401
          if (auth === "Bearer old-access-token") {
            return HttpResponse.json(
              { detail: "Token is invalid or expired" },
              { status: 401 },
            );
          }

          // Second request with refreshed token succeeds
          if (auth === "Bearer new-mock-access-token") {
            return HttpResponse.json({
              id: 1,
              email: "test@example.com",
              first_name: "Test",
              last_name: "User",
            });
          }

          return HttpResponse.json({ detail: "Unauthorized" }, { status: 401 });
        }),
      );

      const store = createTestStore(
        createAuthenticatedState({
          accessToken: "old-access-token",
          refreshToken: "valid-refresh-token",
        }),
      );

      const result = await store.dispatch(
        authApi.endpoints.getProfile.initiate(undefined, {
          forceRefetch: true,
        }) as any,
      );

      // Wait for reauth cycle to complete
      await new Promise((resolve) => setTimeout(resolve, 200));

      // The token should have been refreshed
      const state = store.getState() as RootState;
      expect(state.auth.accessToken).toBe("new-mock-access-token");
      // Profile endpoint was called at least twice (original + retry)
      expect(requestCount).toBeGreaterThanOrEqual(2);
    });

    it("dispatches logout on refresh failure", async () => {
      server.use(
        http.get(`${API_BASE}/accounts/profile/`, () => {
          return HttpResponse.json(
            { detail: "Token is invalid or expired" },
            { status: 401 },
          );
        }),
        http.post(`${API_BASE}/accounts/token/refresh/`, () => {
          return HttpResponse.json(
            { detail: "Token is invalid or expired" },
            { status: 401 },
          );
        }),
      );

      const store = createTestStore(
        createAuthenticatedState({
          accessToken: "expired-access",
          refreshToken: "expired-refresh",
        }),
      );

      store.dispatch(
        authApi.endpoints.getProfile.initiate(undefined, {
          forceRefetch: true,
        }) as any,
      );

      // Wait for reauth + logout cycle
      await new Promise((resolve) => setTimeout(resolve, 300));

      const state = store.getState() as RootState;
      expect(state.auth.accessToken).toBeNull();
      expect(state.auth.refreshToken).toBeNull();
      expect(state.auth.user).toBeNull();
    });
  });
});
