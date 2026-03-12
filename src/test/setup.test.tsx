/**
 * Phase 0 Verification Tests
 *
 * These tests confirm that the testing infrastructure is properly configured:
 * - Vitest runs with jsdom environment
 * - @testing-library/react renders components
 * - @testing-library/jest-dom matchers work
 * - MSW intercepts HTTP requests
 * - Redux test store + renderWithProviders work
 * - Path aliases (@/) resolve correctly
 */
import { describe, it, expect } from "vitest";
import React from "react";
import {
  renderWithProviders,
  screen,
  createTestStore,
  createAuthenticatedState,
} from "@/test/test-utils";
import { cn } from "@/lib/utils";

// ─── 1. Basic Vitest ────────────────────────────────────────────
describe("Vitest basics", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("supports async/await", async () => {
    const value = await Promise.resolve(42);
    expect(value).toBe(42);
  });
});

// ─── 2. jsdom + @testing-library/jest-dom ───────────────────────
describe("jsdom environment", () => {
  it("has access to document", () => {
    expect(document).toBeDefined();
  });

  it("can create and query DOM elements", () => {
    const div = document.createElement("div");
    div.textContent = "hello";
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    document.body.removeChild(div);
  });
});

// ─── 3. React rendering ────────────────────────────────────────
describe("React rendering with testing-library", () => {
  it("renders a simple component", () => {
    function Hello() {
      return <div>Hello Go Gaari</div>;
    }

    renderWithProviders(<Hello />);
    expect(screen.getByText("Hello Go Gaari")).toBeInTheDocument();
  });

  it("renders with Redux state access", () => {
    function UserDisplay() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useSelector } = require("react-redux");
      const user = useSelector(
        (state: { auth: { user: { first_name: string } | null } }) =>
          state.auth.user,
      );
      return <div>{user ? user.first_name : "Guest"}</div>;
    }

    // Unauthenticated
    renderWithProviders(<UserDisplay />);
    expect(screen.getByText("Guest")).toBeInTheDocument();
  });

  it("renders with pre-authenticated state", () => {
    function UserDisplay() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useSelector } = require("react-redux");
      const user = useSelector(
        (state: { auth: { user: { first_name: string } | null } }) =>
          state.auth.user,
      );
      return <div>{user ? user.first_name : "Guest"}</div>;
    }

    renderWithProviders(<UserDisplay />, {
      preloadedState: createAuthenticatedState(),
    });
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

// ─── 4. Redux store ─────────────────────────────────────────────
describe("Redux test store", () => {
  it("creates a store with default state", () => {
    const store = createTestStore();
    const state = store.getState();
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("baseApi");
  });

  it("creates a store with preloaded auth state", () => {
    const store = createTestStore(createAuthenticatedState());
    const state = store.getState();
    expect(state.auth.accessToken).toBe("mock-access-token");
  });
});

// ─── 5. MSW integration ────────────────────────────────────────
describe("MSW mock server", () => {
  it("intercepts a login request", async () => {
    const response = await fetch(
      "https://gogari.quantumbytetech.com/api/v1/accounts/login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "Password123!",
        }),
      },
    );

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data).toHaveProperty("access", "mock-access-token");
    expect(data).toHaveProperty("refresh", "mock-refresh-token");
    expect(data.user.email).toBe("test@example.com");
  });

  it("returns 401 for invalid credentials", async () => {
    const response = await fetch(
      "https://gogari.quantumbytetech.com/api/v1/accounts/login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "wrong@example.com",
          password: "wrong",
        }),
      },
    );

    expect(response.status).toBe(401);
  });

  it("intercepts a cars list request", async () => {
    const response = await fetch(
      "https://gogari.quantumbytetech.com/api/v1/cars/",
    );

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data).toHaveProperty("results");
    expect(data.results).toHaveLength(3);
    expect(data.results[0].brand).toBe("Toyota");
  });
});

// ─── 6. Path alias + utility ────────────────────────────────────
describe("Path aliases and utilities", () => {
  it("resolves @/ path alias", () => {
    expect(cn).toBeDefined();
    expect(typeof cn).toBe("function");
  });

  it("cn() merges Tailwind classes correctly", () => {
    const result = cn("px-4 py-2", "px-8");
    // tailwind-merge correctly deduplicates: px-4 is overridden by px-8
    expect(result).toContain("px-8");
    expect(result).toContain("py-2");
    expect(result).not.toContain("px-4");
  });

  it("cn() handles conditional classes", () => {
    const result = cn("base", false && "hidden", undefined, "visible");
    expect(result).toBe("base visible");
  });
});
