import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { renderWithProviders } from "@/test/test-utils";
import { NearbyCars } from "../NearbyCars";

const API_BASE = "https://gogari.quantumbytetech.com/api/v1";

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
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("NearbyCars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders section heading", () => {
    renderWithProviders(<NearbyCars />);

    expect(screen.getByText("Cars near you")).toBeInTheDocument();
    expect(screen.getByText("Available Now")).toBeInTheDocument();
  });

  it("shows loading skeletons initially", () => {
    const { container } = renderWithProviders(<NearbyCars />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders nearby cars after loading", async () => {
    renderWithProviders(<NearbyCars />);

    await waitFor(() => {
      expect(
        screen.getByText("Toyota Corolla 2023"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Honda Civic 2024")).toBeInTheDocument();
    expect(screen.getByText("Mitsubishi Pajero 2022")).toBeInTheDocument();
  });

  it("displays BDT prices", async () => {
    renderWithProviders(<NearbyCars />);

    await waitFor(() => {
      expect(screen.getByText(/৳3,500/)).toBeInTheDocument();
    });
  });

  it("shows View All Cars link", () => {
    renderWithProviders(<NearbyCars />);

    const links = screen.getAllByText("View All Cars");
    expect(links.length).toBeGreaterThan(0);
  });

  it("renders error state when API fails", async () => {
    server.use(
      http.get(`${API_BASE}/cars/nearby/`, () => {
        return HttpResponse.json(
          { detail: "Server error" },
          { status: 500 },
        );
      }),
    );

    renderWithProviders(<NearbyCars />);

    await waitFor(() => {
      expect(
        screen.getByText(/couldn.t load nearby cars/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("renders empty state when no cars nearby", async () => {
    server.use(
      http.get(`${API_BASE}/cars/nearby/`, () => {
        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: [],
        });
      }),
    );

    renderWithProviders(<NearbyCars />);

    await waitFor(() => {
      expect(
        screen.getByText(/no cars available in your area/i),
      ).toBeInTheDocument();
    });
  });

  it("shows Book Now links to car detail pages", async () => {
    renderWithProviders(<NearbyCars />);

    await waitFor(() => {
      expect(
        screen.getByText("Toyota Corolla 2023"),
      ).toBeInTheDocument();
    });

    // Featured car has "Book Now" link, others have "Book"
    const bookNowLink = screen.getByRole("link", { name: "Book Now" });
    expect(bookNowLink).toHaveAttribute("href", "/search-cars/1");
  });
});
