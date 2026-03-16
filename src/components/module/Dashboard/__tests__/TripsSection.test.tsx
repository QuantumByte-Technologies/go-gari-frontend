import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  renderWithProviders,
  createAuthenticatedState,
} from "@/test/test-utils";
import TripsSection from "../TripsSection";

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

describe("TripsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays My Bookings heading after loading", async () => {
    renderWithProviders(<TripsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("My Bookings")).toBeInTheDocument();
    });
  });

  it("shows booking card with correct data", async () => {
    renderWithProviders(<TripsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Toyota Corolla 2023")).toBeInTheDocument();
    });

    // Booking ID
    expect(screen.getByText("BK-20260401-001")).toBeInTheDocument();
    // Status badge
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    // Self-Drive label
    expect(screen.getByText("Self-Drive")).toBeInTheDocument();
  });

  it("shows status tabs", async () => {
    renderWithProviders(<TripsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("My Bookings")).toBeInTheDocument();
    });

    expect(screen.getByText("upcoming")).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
  });

  it("switches tabs and shows empty state", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TripsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("My Bookings")).toBeInTheDocument();
    });

    // Switch to "active" tab — mock booking has status "confirmed" so active tab is empty
    await user.click(screen.getByText(/active/i));

    await waitFor(() => {
      expect(
        screen.getByText("No active bookings"),
      ).toBeInTheDocument();
    });
  });

  it("shows View Details button on booking card", async () => {
    renderWithProviders(<TripsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Toyota Corolla 2023")).toBeInTheDocument();
    });

    expect(screen.getByText("View Details")).toBeInTheDocument();
  });
});
