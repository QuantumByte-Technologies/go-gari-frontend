import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import CarGrid from "../CarGrid";
import type { CarListItem } from "@/types/api/cars";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/search-cars",
  useSearchParams: () => new URLSearchParams(),
}));

const mockCars: CarListItem[] = [
  {
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
  },
  {
    id: 2,
    name: "Honda Civic 2024",
    brand: "Honda",
    model: "Civic",
    year: 2024,
    category: "premium",
    city: "Chittagong",
    transmission: "auto",
    fuel_type: "petrol",
    seats: 5,
    rate_per_day: "4000.00",
    chauffeur_rate_per_day: "1500.00",
    drive_option: "self_drive_only",
    pickup_location_address: "GEC Circle, Chittagong",
    dropoff_location_address: "GEC Circle, Chittagong",
    is_active: true,
    primary_image: "/mock-car-2.jpg",
  },
];

describe("CarGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders car cards when data is loaded", () => {
    renderWithProviders(
      <CarGrid
        cars={mockCars}
        viewMode="grid"
        favorites={[]}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText("Toyota Corolla 2023")).toBeInTheDocument();
    expect(screen.getByText("Honda Civic 2024")).toBeInTheDocument();
  });

  it("renders loading skeletons when isLoading is true", () => {
    const { container } = renderWithProviders(
      <CarGrid
        cars={[]}
        viewMode="grid"
        favorites={[]}
        onToggleFavorite={vi.fn()}
        isLoading={true}
      />,
    );

    // Should have pulse animation skeleton elements
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error state with retry button", () => {
    const retryFn = vi.fn();

    renderWithProviders(
      <CarGrid
        cars={[]}
        viewMode="grid"
        favorites={[]}
        onToggleFavorite={vi.fn()}
        isError={true}
        onRetry={retryFn}
      />,
    );

    expect(screen.getByText(/failed to load cars/i)).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("renders empty state when no cars and not loading", () => {
    renderWithProviders(
      <CarGrid
        cars={[]}
        viewMode="grid"
        favorites={[]}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText(/no cars found/i)).toBeInTheDocument();
  });
});
