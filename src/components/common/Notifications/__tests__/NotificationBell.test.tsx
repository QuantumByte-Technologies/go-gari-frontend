import { describe, it, expect, vi } from "vitest";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
  createAuthenticatedState,
} from "@/test/test-utils";
import NotificationBell from "../NotificationBell";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("NotificationBell", () => {
  const authState = createAuthenticatedState();

  it("renders the bell button", () => {
    renderWithProviders(<NotificationBell />, {
      preloadedState: authState,
    });

    expect(screen.getByTestId("notification-bell")).toBeInTheDocument();
    expect(screen.getByLabelText("Notifications")).toBeInTheDocument();
  });

  it("shows unread count badge when count > 0", async () => {
    renderWithProviders(<NotificationBell />, {
      preloadedState: authState,
    });

    // MSW handler returns count: 1 for unread-count endpoint
    await waitFor(() => {
      expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
    });

    expect(screen.getByTestId("notification-badge")).toHaveTextContent("1");
  });

  it("opens notification panel on click", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NotificationBell />, {
      preloadedState: authState,
    });

    const bellButton = screen.getByTestId("notification-bell");
    await user.click(bellButton);

    await waitFor(() => {
      expect(screen.getByTestId("notification-panel")).toBeInTheDocument();
    });
  });

  it("closes notification panel on second click", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NotificationBell />, {
      preloadedState: authState,
    });

    const bellButton = screen.getByTestId("notification-bell");

    // Open
    await user.click(bellButton);
    await waitFor(() => {
      expect(screen.getByTestId("notification-panel")).toBeInTheDocument();
    });

    // Close
    await user.click(bellButton);
    await waitFor(() => {
      expect(screen.queryByTestId("notification-panel")).not.toBeInTheDocument();
    });
  });

  it("displays notification items with subject and time", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NotificationBell />, {
      preloadedState: authState,
    });

    // Open the panel
    await user.click(screen.getByTestId("notification-bell"));

    // Wait for notifications to load — MSW returns mockNotification1 and mockNotification2
    await waitFor(() => {
      expect(screen.getByText("Booking Confirmed")).toBeInTheDocument();
    });

    expect(screen.getByText("Payment Received")).toBeInTheDocument();
  });
});
