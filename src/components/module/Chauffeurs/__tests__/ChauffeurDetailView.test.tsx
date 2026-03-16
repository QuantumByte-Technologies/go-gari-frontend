import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import {
  renderWithProviders,
  createAuthenticatedState,
} from "@/test/test-utils";
import ChauffeurDetailView from "../ChauffeurDetailView";
import {
  mockChauffeurDetail,
  mockChauffeurReview1,
  mockChauffeurReview2,
} from "@/test/mocks/handlers";

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
  useParams: () => ({ id: "1" }),
  usePathname: () => "/chauffeurs/1",
  useSearchParams: () => new URLSearchParams(),
}));

// ── Mock sonner ─────────────────────────────────────────────────
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ChauffeurDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders chauffeur bio, experience, and rating", async () => {
    renderWithProviders(<ChauffeurDetailView chauffeurId={1} />, {
      preloadedState: createAuthenticatedState(),
    });

    // Should show loading skeleton initially
    expect(
      screen.getByTestId("chauffeur-detail-loading"),
    ).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(
        screen.queryByTestId("chauffeur-detail-loading"),
      ).not.toBeInTheDocument();
    });

    // Should display chauffeur name
    expect(screen.getByText(mockChauffeurDetail.user)).toBeInTheDocument();

    // Should display bio
    expect(screen.getByText(mockChauffeurDetail.bio)).toBeInTheDocument();

    // Should display experience
    expect(
      screen.getByText(/5 years experience/),
    ).toBeInTheDocument();

    // Should display rating and reviews count
    expect(
      screen.getByText(
        `${mockChauffeurDetail.average_rating} (${mockChauffeurDetail.reviews_count} reviews)`,
      ),
    ).toBeInTheDocument();

    // Should show active badge
    expect(screen.getByText("Active")).toBeInTheDocument();

    // Should show total trips
    expect(
      screen.getByText(`${mockChauffeurDetail.total_trips} total trips`),
    ).toBeInTheDocument();

    // Should show verified badge (via ShieldCheck icon — verified chauffeur)
    expect(screen.getByText("Back to Chauffeurs")).toBeInTheDocument();
  });

  it("shows reviews list", async () => {
    renderWithProviders(<ChauffeurDetailView chauffeurId={1} />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for reviews to load
    await waitFor(() => {
      expect(screen.getByText("Reviews")).toBeInTheDocument();
    });

    // Should show both reviews
    await waitFor(() => {
      expect(
        screen.getByText(mockChauffeurReview1.user),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(mockChauffeurReview2.user),
    ).toBeInTheDocument();

    // Should display review text
    expect(
      screen.getByText(mockChauffeurReview1.review_text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockChauffeurReview2.review_text),
    ).toBeInTheDocument();
  });

  it("shows 'Write a Review' button for authenticated users", async () => {
    renderWithProviders(<ChauffeurDetailView chauffeurId={1} />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId("chauffeur-detail-loading"),
      ).not.toBeInTheDocument();
    });

    // Authenticated user should see "Write a Review" button
    expect(screen.getByText("Write a Review")).toBeInTheDocument();
  });

  it("shows sign-in prompt for unauthenticated users", async () => {
    renderWithProviders(<ChauffeurDetailView chauffeurId={1} />);

    await waitFor(() => {
      expect(
        screen.queryByTestId("chauffeur-detail-loading"),
      ).not.toBeInTheDocument();
    });

    // Unauthenticated user should NOT see "Write a Review" button
    expect(screen.queryByText("Write a Review")).not.toBeInTheDocument();

    // Should see sign-in prompt
    expect(screen.getByText("sign in")).toBeInTheDocument();
    expect(
      screen.getByText(/to leave a review/),
    ).toBeInTheDocument();
  });

  it("shows error state for non-existent chauffeur", async () => {
    renderWithProviders(<ChauffeurDetailView chauffeurId={999} />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Chauffeur not found")).toBeInTheDocument();
    });

    expect(screen.getByText("Back to Chauffeurs")).toBeInTheDocument();
  });
});
