import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  renderWithProviders,
  createAuthenticatedState,
} from "@/test/test-utils";
import UserDashboard from "../UserDashboard";

// ── Mock next/navigation ────────────────────────────────────────
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

// ── Mock sonner ─────────────────────────────────────────────────
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("UserDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard with tabs", async () => {
    renderWithProviders(<UserDashboard />, {
      preloadedState: createAuthenticatedState(),
    });

    // Dashboard tabs should be visible
    // "My Trips" appears in both the breadcrumb and the tab button
    await waitFor(() => {
      expect(screen.getAllByText("My Trips").length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Browse Cars")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Inbox")).toBeInTheDocument();
  });

  it("renders breadcrumb with Home link", async () => {
    renderWithProviders(<UserDashboard />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  it("defaults to trips tab showing My Bookings", async () => {
    renderWithProviders(<UserDashboard />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("My Bookings")).toBeInTheDocument();
    });
  });

  it("navigates to home when breadcrumb Home is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<UserDashboard />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Home"));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("accepts initialTab prop", async () => {
    renderWithProviders(<UserDashboard initialTab="support" />, {
      preloadedState: createAuthenticatedState(),
    });

    // Breadcrumb should show Customer Support
    await waitFor(() => {
      expect(screen.getByText("Customer Support")).toBeInTheDocument();
    });
  });

  it("switches tabs when clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<UserDashboard />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("My Bookings")).toBeInTheDocument();
    });

    // Click Profile tab
    await user.click(screen.getByText("Profile"));

    await waitFor(() => {
      expect(screen.getByText("Profile Settings")).toBeInTheDocument();
    });
  });
});
