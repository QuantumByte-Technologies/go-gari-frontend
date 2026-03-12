import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { createTestStore, createAuthenticatedState } from "@/test/test-utils";
import authApi from "../authApi";
import type { RootState } from "@/redux/store";

const API_BASE = "https://gogari.quantumbytetech.com/api/v1";

describe("authApi", () => {
  // ── Login ──────────────────────────────────────────────────────

  it("login mutation sends correct payload and stores tokens", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      authApi.endpoints.login.initiate({
        email: "test@example.com",
        password: "Password123!",
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.access).toBe("mock-access-token");
    expect(result.data?.refresh).toBe("mock-refresh-token");
    expect(result.data?.user.email).toBe("test@example.com");

    // Verify setCredentials was dispatched (via onQueryStarted)
    const state = store.getState() as RootState;
    expect(state.auth.accessToken).toBe("mock-access-token");
    expect(state.auth.refreshToken).toBe("mock-refresh-token");
    expect(state.auth.user?.email).toBe("test@example.com");
  });

  it("login mutation handles 401 invalid credentials", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      authApi.endpoints.login.initiate({
        email: "wrong@example.com",
        password: "wrongpassword",
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(401);

    // Auth state should remain empty
    const state = store.getState() as RootState;
    expect(state.auth.accessToken).toBeNull();
  });

  // ── Register ──────────────────────────────────────────────────

  it("register mutation sends correct payload", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      authApi.endpoints.register.initiate({
        email: "new@example.com",
        phone: "+8801712345678",
        first_name: "New",
        last_name: "User",
        password: "Password123!",
        password_confirm: "Password123!",
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.email).toBe("new@example.com");
    expect(result.data?.first_name).toBe("New");
  });

  it("register mutation handles 400 validation errors (duplicate email)", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      authApi.endpoints.register.initiate({
        email: "existing@example.com",
        phone: "+8801712345678",
        first_name: "Existing",
        last_name: "User",
        password: "Password123!",
        password_confirm: "Password123!",
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(400);
    expect((result.error as any).data.email).toContain(
      "A user with this email already exists.",
    );
  });

  // ── Logout ────────────────────────────────────────────────────

  it("logout mutation blacklists refresh token and clears state", async () => {
    const store = createTestStore(createAuthenticatedState());

    // Verify we start authenticated
    let state = store.getState() as RootState;
    expect(state.auth.accessToken).toBe("mock-access-token");

    await store.dispatch(
      authApi.endpoints.logout.initiate({ refresh: "mock-refresh-token" }),
    );

    // Wait for onQueryStarted to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    state = store.getState() as RootState;
    expect(state.auth.accessToken).toBeNull();
    expect(state.auth.refreshToken).toBeNull();
    expect(state.auth.user).toBeNull();
  });

  // ── OTP ───────────────────────────────────────────────────────

  it("verifyOtp mutation sends phone + otp", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      authApi.endpoints.verifyOtp.initiate({
        phone: "+8801700000000",
        otp: "123456",
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.detail).toBe("Phone number verified.");
  });

  it("resendOtp mutation sends phone number", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      authApi.endpoints.resendOtp.initiate({ phone: "+8801700000000" }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.detail).toBe("OTP sent successfully.");
  });

  // ── Forgot / Reset Password ───────────────────────────────────

  it("forgotPassword mutation sends email", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      authApi.endpoints.forgotPassword.initiate({
        email: "test@example.com",
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.detail).toBe("Password reset email sent.");
  });

  it("resetPassword mutation sends token + new passwords", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      authApi.endpoints.resetPassword.initiate({
        token: "reset-token-123",
        password: "NewPassword123!",
        password_confirm: "NewPassword123!",
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.detail).toBe("Password has been reset.");
  });

  // ── Profile ───────────────────────────────────────────────────

  it("getProfile query returns user profile", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      authApi.endpoints.getProfile.initiate(undefined, {
        forceRefetch: true,
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.email).toBe("test@example.com");
    expect(result.data?.first_name).toBe("Test");
    expect(result.data?.last_name).toBe("User");
  });

  it("updateProfile mutation sends partial update", async () => {
    const store = createTestStore(createAuthenticatedState());

    const result = await store.dispatch(
      authApi.endpoints.updateProfile.initiate({
        first_name: "Updated",
        last_name: "Name",
      }),
    );

    expect(result.data).toBeDefined();
    expect(result.data?.first_name).toBe("Updated");
    expect(result.data?.last_name).toBe("Name");
    // Other fields should remain from the mock
    expect(result.data?.email).toBe("test@example.com");
  });
});
