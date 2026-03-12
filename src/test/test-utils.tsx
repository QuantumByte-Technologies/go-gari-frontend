import React, { type PropsWithChildren } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import baseApi from "@/redux/api/baseApi";
import rootReducer from "@/redux/features/rootReducer";
import type { RootState } from "@/redux/store";
import type { AuthState } from "@/redux/features/auth/authSlice";

// ─── Create a test store with optional preloaded state ──────────
export function createTestStore(
  preloadedState?: Partial<RootState>,
): EnhancedStore {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        baseApi.middleware,
      ),
    preloadedState: preloadedState as RootState,
  });
}

// ─── Render with Redux Provider ─────────────────────────────────
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// ─── Pre-authenticated state factory ────────────────────────────
export function createAuthenticatedState(
  overrides?: Partial<AuthState>,
): Partial<RootState> {
  return {
    auth: {
      user: {
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
      },
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      ...overrides,
    },
  };
}

// Re-export testing-library utilities for convenience
export { default as userEvent } from "@testing-library/user-event";
export { screen, waitFor, within, act } from "@testing-library/react";
