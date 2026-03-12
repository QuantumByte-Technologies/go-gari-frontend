import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { renderWithProviders } from "@/test/test-utils";
import CarDetailsPage from "../CarDetails";

const API_BASE = "https://gogari.quantumbytetech.com/api/v1";

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
let mockParamsId = "1";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useParams: () => ({ id: mockParamsId }),
  usePathname: () => "/search-cars/1",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CarDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParamsId = "1";
  });

  it("shows loading skeleton initially", () => {
    const { container } = renderWithProviders(<CarDetailsPage />);

    // Skeleton has animate-pulse
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders car details after loading", async () => {
    renderWithProviders(<CarDetailsPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Toyota Corolla 2023"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Well-maintained Toyota Corolla in excellent condition.",
      ),
    ).toBeInTheDocument();
  });

  it("shows error state for non-existent car", async () => {
    mockParamsId = "999";

    renderWithProviders(<CarDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("Car not found")).toBeInTheDocument();
    });

    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("calls router.back() when Go Back button is clicked on error", async () => {
    mockParamsId = "999";
    const user = userEvent.setup();

    renderWithProviders(<CarDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("Car not found")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Go Back"));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("renders PricingCard with BDT rate", async () => {
    renderWithProviders(<CarDetailsPage />);

    await waitFor(
      () => {
        // PricingCard header shows "৳3,500" + "/day" — multiple elements
        // may contain this amount (header + self-drive toggle), so use getAllByText
        const priceElements = screen.getAllByText(/৳3,500/);
        expect(priceElements.length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 3000 },
    );

    expect(screen.getAllByText(/\/day/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders pickup location from API", async () => {
    renderWithProviders(<CarDetailsPage />);

    await waitFor(
      () => {
        // "Dhanmondi 27, Dhaka" appears in both pickup and dropoff sections
        const locationElements = screen.getAllByText(/Dhanmondi 27, Dhaka/);
        expect(locationElements.length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 3000 },
    );
  });

  it("shows About this vehicle section", async () => {
    renderWithProviders(<CarDetailsPage />);

    await waitFor(() => {
      expect(
        screen.getByText("About this vehicle"),
      ).toBeInTheDocument();
    });
  });
});
