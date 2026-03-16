import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  renderWithProviders,
  createAuthenticatedState,
} from "@/test/test-utils";
import CheckoutPage from "../Checkout";
import type { BookingDraft } from "@/utils/checkout";

// ── Mock next/navigation ────────────────────────────────────────
const mockPush = vi.fn();
const mockRouterReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: mockRouterReplace,
    prefetch: vi.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => "/checkout",
  useSearchParams: () => new URLSearchParams(),
}));

// ── Mock sonner ─────────────────────────────────────────────────
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Import the mocked toast after vi.mock (hoisted automatically)
import { toast } from "sonner";

// ── Test booking draft ──────────────────────────────────────────
const testDraft: BookingDraft = {
  carId: 1,
  carName: "Toyota Corolla 2023",
  startDate: "2026-05-01",
  endDate: "2026-05-05",
  pickupTime: "10:00",
  dropoffTime: "10:00",
  driveType: "self_drive",
  pricing: {
    numDays: 4,
    ratePerDay: "3500.00",
    subtotal: "14000.00",
    discountPercentage: "0.00",
    discountAmount: "0.00",
    grandTotal: "14000.00",
  },
};

describe("CheckoutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ── Empty state (no draft) ──────────────────────────────────

  it("shows empty state when no booking draft exists", async () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(
        screen.getByText("No Booking Information Found"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Browse Cars")).toBeInTheDocument();
  });

  it("navigates to search-cars when Browse Cars is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<CheckoutPage />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Browse Cars")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Browse Cars"));
    expect(mockPush).toHaveBeenCalledWith("/search-cars");
  });

  // ── Redirect if not authenticated ──────────────────────────

  it("redirects to signin when not authenticated", async () => {
    renderWithProviders(<CheckoutPage />); // No auth state

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/signin");
    });
  });

  // ── Rendering with draft data ──────────────────────────────

  it("renders checkout with booking draft data", async () => {
    localStorage.setItem("booking_draft", JSON.stringify(testDraft));

    renderWithProviders(<CheckoutPage />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      // VehicleCard shows car name
      expect(screen.getByText("Your Vehicle")).toBeInTheDocument();
    });

    // Car name appears in VehicleCard and Booking Summary
    const carNameElements = screen.getAllByText("Toyota Corolla 2023");
    expect(carNameElements.length).toBeGreaterThanOrEqual(1);

    // Booking Summary section
    expect(screen.getByText("Booking Summary")).toBeInTheDocument();

    // Dates
    expect(screen.getByText("2026-05-01")).toBeInTheDocument();
    expect(screen.getByText("2026-05-05")).toBeInTheDocument();

    // Pricing — appears in both subtotal row and total section
    const priceElements = screen.getAllByText(/৳14,000/);
    expect(priceElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders customer info from profile API", async () => {
    localStorage.setItem("booking_draft", JSON.stringify(testDraft));

    renderWithProviders(<CheckoutPage />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(
        screen.getByText("Customer Information"),
      ).toBeInTheDocument();
    });

    // Profile data shows up (from MSW mock profile)
    // "Test User" appears in both the profile card and the info field
    await waitFor(() => {
      const userElements = screen.getAllByText("Test User");
      expect(userElements.length).toBeGreaterThanOrEqual(1);
    });

    // Email appears in both summary and info field
    const emailElements = screen.getAllByText(/test@example\.com/);
    expect(emailElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders payment method section with SSLCommerz info", async () => {
    localStorage.setItem("booking_draft", JSON.stringify(testDraft));

    renderWithProviders(<CheckoutPage />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Payment Method")).toBeInTheDocument();
    });

    expect(screen.getByText(/SSLCommerz/)).toBeInTheDocument();
    expect(screen.getByText("bKash")).toBeInTheDocument();
    expect(screen.getByText("VISA")).toBeInTheDocument();
  });

  // ── Validation ─────────────────────────────────────────────

  it("shows validation errors when submitting without required fields", async () => {
    localStorage.setItem("booking_draft", JSON.stringify(testDraft));
    const user = userEvent.setup();

    renderWithProviders(<CheckoutPage />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Confirm & Pay")).toBeInTheDocument();
    });

    // Accept terms to enable the submit button (button is disabled when terms unchecked)
    const termsCheckbox = screen.getByRole("checkbox", {
      name: /accept terms/i,
    });
    await user.click(termsCheckbox);

    // Click submit without filling pickup address
    await user.click(screen.getByText("Confirm & Pay"));

    await waitFor(() => {
      expect(
        screen.getByText("Pickup address is required"),
      ).toBeInTheDocument();
    });
  });

  // ── Successful submission flow ─────────────────────────────

  it("creates booking and initiates payment on valid submit", async () => {
    localStorage.setItem("booking_draft", JSON.stringify(testDraft));
    const user = userEvent.setup();

    // Mock window.location.href since JSDOM doesn't support real navigation
    const originalLocation = window.location;
    const locationMock = {
      ...originalLocation,
      href: originalLocation.href,
    };
    Object.defineProperty(window, "location", {
      writable: true,
      value: locationMock,
    });

    renderWithProviders(<CheckoutPage />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Confirm & Pay")).toBeInTheDocument();
    });

    // Fill in pickup address
    const pickupInput = screen.getByPlaceholderText("e.g. Dhanmondi 27, Dhaka");
    await user.type(pickupInput, "Gulshan 2, Dhaka");

    // Accept terms
    const termsCheckbox = screen.getByRole("checkbox", {
      name: /accept terms/i,
    });
    await user.click(termsCheckbox);

    // Submit
    await user.click(screen.getByText("Confirm & Pay"));

    // Wait for booking creation toast
    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(
          "Booking created successfully!",
        );
      },
      { timeout: 5000 },
    );

    // Wait for redirect to SSLCommerz
    await waitFor(
      () => {
        expect(window.location.href).toContain("sandbox.sslcommerz.com");
      },
      { timeout: 5000 },
    );

    // Booking draft should be cleared
    expect(localStorage.getItem("booking_draft")).toBeNull();

    // Restore window.location
    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });

  // ── Drop-off location ──────────────────────────────────────

  it("shows dropoff address field when 'same as pickup' is unchecked", async () => {
    localStorage.setItem("booking_draft", JSON.stringify(testDraft));
    const user = userEvent.setup();

    renderWithProviders(<CheckoutPage />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(
        screen.getByText("Pickup & Drop-off Location"),
      ).toBeInTheDocument();
    });

    // By default, "same as pickup" is checked — no dropoff input
    expect(
      screen.queryByPlaceholderText("e.g. Banani 11, Dhaka"),
    ).not.toBeInTheDocument();

    // Uncheck "same as pickup"
    const sameCheckbox = screen.getByLabelText("Drop-off at same location");
    await user.click(sameCheckbox);

    // Now dropoff field appears
    expect(
      screen.getByPlaceholderText("e.g. Banani 11, Dhaka"),
    ).toBeInTheDocument();
  });
});
