import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import {
  renderWithProviders,
  createAuthenticatedState,
  userEvent,
} from "@/test/test-utils";
import ChauffeurList from "../ChauffeurList";
import {
  mockChauffeurListItem1,
  mockChauffeurListItem2,
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
  useParams: () => ({}),
  usePathname: () => "/chauffeurs",
  useSearchParams: () => new URLSearchParams(),
}));

describe("ChauffeurList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders chauffeur cards with photo, name, and rating", async () => {
    renderWithProviders(<ChauffeurList />, {
      preloadedState: createAuthenticatedState(),
    });

    // Should show loading skeleton initially
    expect(screen.getByTestId("chauffeur-list-loading")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(
        screen.queryByTestId("chauffeur-list-loading"),
      ).not.toBeInTheDocument();
    });

    // Should display both chauffeurs
    expect(screen.getByText(mockChauffeurListItem1.user)).toBeInTheDocument();
    expect(screen.getByText(mockChauffeurListItem2.user)).toBeInTheDocument();

    // Should display ratings
    expect(
      screen.getByText(mockChauffeurListItem1.average_rating),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockChauffeurListItem2.average_rating),
    ).toBeInTheDocument();

    // Should display total count
    expect(screen.getByText(/2 chauffeurs found/)).toBeInTheDocument();

    // Should have "View Profile" buttons
    const viewButtons = screen.getAllByText("View Profile");
    expect(viewButtons).toHaveLength(2);
  });

  it("search input filters chauffeurs", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    renderWithProviders(<ChauffeurList />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for initial load
    await waitFor(() => {
      expect(
        screen.queryByTestId("chauffeur-list-loading"),
      ).not.toBeInTheDocument();
    });

    // Type in search box
    const searchInput = screen.getByPlaceholderText("Search chauffeurs...");
    await user.type(searchInput, "Karim");

    // Advance past debounce (300ms)
    vi.advanceTimersByTime(400);

    // Wait for filtered results — MSW filters by search param
    await waitFor(() => {
      expect(screen.getByText("Karim Rahman")).toBeInTheDocument();
    });

    // The count should update to reflect the filtered results
    await waitFor(() => {
      expect(screen.getByText(/1 chauffeur found/)).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it("pagination controls appear when there are multiple pages", async () => {
    renderWithProviders(<ChauffeurList />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for data to load
    await waitFor(() => {
      expect(
        screen.queryByTestId("chauffeur-list-loading"),
      ).not.toBeInTheDocument();
    });

    // MSW returns next=page2 for page 1, so pagination should appear
    await waitFor(() => {
      expect(screen.getByText("Page 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();

    // Previous should be disabled on first page
    expect(screen.getByText("Previous").closest("button")).toBeDisabled();
    // Next should be enabled since there is a next page
    expect(screen.getByText("Next").closest("button")).not.toBeDisabled();
  });
});
