import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import CarCard from "../CarCard";
import type { CarListItem } from "@/types/api/cars";

// Mock next/navigation
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
  usePathname: () => "/search-cars",
  useSearchParams: () => new URLSearchParams(),
}));

const mockCar: CarListItem = {
  id: 1,
  name: "Toyota Corolla 2023",
  brand: "Toyota",
  model: "Corolla",
  year: 2023,
  category: "economy",
  city: "Dhaka",
  transmission: "auto",
  fuel_type: "petrol",
  seats: 5,
  rate_per_day: "3500.00",
  chauffeur_rate_per_day: "1500.00",
  drive_option: "both",
  pickup_location_address: "Dhanmondi 27, Dhaka",
  dropoff_location_address: "Dhanmondi 27, Dhaka",
  is_active: true,
  primary_image: "/mock-car-1.jpg",
};

describe("CarCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders car name and details", () => {
    const toggleFav = vi.fn();
    renderWithProviders(
      <CarCard
        car={mockCar}
        viewMode="grid"
        isFavorite={false}
        onToggleFavorite={toggleFav}
      />,
    );

    expect(screen.getByText("Toyota Corolla 2023")).toBeInTheDocument();
    // Subtitle contains "Toyota Corolla • 2023" — use getAllByText for partial match
    expect(screen.getAllByText(/Toyota Corolla/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/5 Seats/)).toBeInTheDocument();
    expect(screen.getByText("Automatic")).toBeInTheDocument();
    expect(screen.getByText("Petrol")).toBeInTheDocument();
  });

  it("displays BDT price format", () => {
    renderWithProviders(
      <CarCard
        car={mockCar}
        viewMode="grid"
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    );

    // Rate should be formatted in BDT
    expect(screen.getByText(/৳3,500/)).toBeInTheDocument();
    // "/day" appears in both the main price and chauffeur line, so use getAllByText
    expect(screen.getAllByText(/\/day/).length).toBeGreaterThanOrEqual(1);
  });

  it("shows chauffeur rate when drive_option is not self_drive_only", () => {
    renderWithProviders(
      <CarCard
        car={mockCar}
        viewMode="grid"
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    );

    // "With chauffeur:" text in the price section
    expect(screen.getByText(/With chauffeur/i)).toBeInTheDocument();
    expect(screen.getByText(/৳1,500/)).toBeInTheDocument();
  });

  it("does not show chauffeur rate for self_drive_only cars", () => {
    const selfDriveCar: CarListItem = {
      ...mockCar,
      drive_option: "self_drive_only",
    };

    renderWithProviders(
      <CarCard
        car={selfDriveCar}
        viewMode="grid"
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.queryByText(/chauffeur/i)).not.toBeInTheDocument();
  });

  it("shows drive option badge", () => {
    renderWithProviders(
      <CarCard
        car={mockCar}
        viewMode="grid"
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText("Self / Chauffeur")).toBeInTheDocument();
  });

  it("shows category badge for premium cars", () => {
    const premiumCar: CarListItem = {
      ...mockCar,
      category: "premium",
    };

    renderWithProviders(
      <CarCard
        car={premiumCar}
        viewMode="grid"
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText("Premium")).toBeInTheDocument();
  });

  it("calls onToggleFavorite when heart is clicked", async () => {
    const user = userEvent.setup();
    const toggleFav = vi.fn();

    renderWithProviders(
      <CarCard
        car={mockCar}
        viewMode="grid"
        isFavorite={false}
        onToggleFavorite={toggleFav}
      />,
    );

    const favButton = screen.getByRole("button", { name: /toggle favorite/i });
    await user.click(favButton);

    expect(toggleFav).toHaveBeenCalledTimes(1);
  });

  it("navigates to car detail page when Book Now is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CarCard
        car={mockCar}
        viewMode="grid"
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    );

    const bookBtn = screen.getByRole("button", { name: /book now/i });
    await user.click(bookBtn);

    expect(mockPush).toHaveBeenCalledWith("/search-cars/1");
  });

  it("shows city name", () => {
    renderWithProviders(
      <CarCard
        car={mockCar}
        viewMode="grid"
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText("Dhaka")).toBeInTheDocument();
  });
});
