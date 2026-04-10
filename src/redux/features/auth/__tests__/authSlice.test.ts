import { describe, it, expect } from "vitest";
import authReducer, {
  setCredentials,
  setTokens,
  setUser,
  logout,
  selectCurrentUser,
  selectAccessToken,
  selectRefreshToken,
  selectIsAuthenticated,
  type AuthState,
} from "../authSlice";
import type { RootState } from "@/redux/store";
import type { UserProfile } from "@/types/api/auth";

const mockUser: UserProfile = {
  id: 1,
  email: "test@example.com",
  first_name: "Test",
  last_name: "User",
  phone: "+8801700000000",
  dob: null,
  country: "Bangladesh",
  user_type: "local",
  is_phone_verified: true,
  is_verified: true,
  verification_status: "approved",
  date_joined: "2026-01-01T00:00:00Z",
  avatar: null,
};

describe("authSlice", () => {
  it("has null user and tokens in initial state", () => {
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it("setCredentials sets user and both tokens", () => {
    const state = authReducer(
      undefined,
      setCredentials({
        user: mockUser,
        accessToken: "access-123",
        refreshToken: "refresh-456",
      }),
    );
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe("access-123");
    expect(state.refreshToken).toBe("refresh-456");
  });

  it("setTokens updates access token and optionally refresh token", () => {
    const initial: AuthState = {
      user: mockUser,
      accessToken: "old-access",
      refreshToken: "old-refresh",
    };

    // Only update access token
    const state1 = authReducer(
      initial,
      setTokens({ accessToken: "new-access" }),
    );
    expect(state1.accessToken).toBe("new-access");
    expect(state1.refreshToken).toBe("old-refresh"); // unchanged

    // Update both
    const state2 = authReducer(
      initial,
      setTokens({ accessToken: "new-access", refreshToken: "new-refresh" }),
    );
    expect(state2.accessToken).toBe("new-access");
    expect(state2.refreshToken).toBe("new-refresh");
  });

  it("logout clears all auth state", () => {
    const initial: AuthState = {
      user: mockUser,
      accessToken: "access-123",
      refreshToken: "refresh-456",
    };

    const state = authReducer(initial, logout());
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  describe("selectors", () => {
    it("selectIsAuthenticated returns true when access token exists", () => {
      const rootState = {
        auth: { user: mockUser, accessToken: "token", refreshToken: "refresh" },
      } as RootState;

      expect(selectIsAuthenticated(rootState)).toBe(true);
      expect(selectCurrentUser(rootState)).toEqual(mockUser);
      expect(selectAccessToken(rootState)).toBe("token");
      expect(selectRefreshToken(rootState)).toBe("refresh");
    });

    it("selectIsAuthenticated returns false when access token is null", () => {
      const rootState = {
        auth: { user: null, accessToken: null, refreshToken: null },
      } as RootState;

      expect(selectIsAuthenticated(rootState)).toBe(false);
      expect(selectCurrentUser(rootState)).toBeNull();
    });
  });
});
