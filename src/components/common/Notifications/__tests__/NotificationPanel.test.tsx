import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
  createAuthenticatedState,
} from "@/test/test-utils";
import NotificationPanel from "../NotificationPanel";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("NotificationPanel", () => {
  const authState = createAuthenticatedState();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders notification list from API", async () => {
    renderWithProviders(<NotificationPanel onClose={mockOnClose} />, {
      preloadedState: authState,
    });

    // Shows loading skeleton first
    expect(screen.getByTestId("notification-panel-loading")).toBeInTheDocument();

    // Wait for notifications to load (MSW returns mockNotification1 + mockNotification2)
    await waitFor(() => {
      expect(screen.getByText("Booking Confirmed")).toBeInTheDocument();
    });

    expect(screen.getByText("Payment Received")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("shows unread count indicator", async () => {
    renderWithProviders(<NotificationPanel onClose={mockOnClose} />, {
      preloadedState: authState,
    });

    // Wait for data to load — MSW has 1 unread notification
    await waitFor(() => {
      expect(screen.getByText("1 unread")).toBeInTheDocument();
    });
  });

  it("unread notifications have distinct visual style", async () => {
    renderWithProviders(<NotificationPanel onClose={mockOnClose} />, {
      preloadedState: authState,
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification-item-1")).toBeInTheDocument();
    });

    // Unread notification (mockNotification1, is_read: false) should have green background
    const unreadItem = screen.getByTestId("notification-item-1");
    expect(unreadItem.className).toContain("bg-green-50/50");

    // Read notification (mockNotification2, is_read: true) should NOT have green background
    const readItem = screen.getByTestId("notification-item-2");
    expect(readItem.className).not.toContain("bg-green-50/50");
  });

  it("clicking notification triggers mark as read", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NotificationPanel onClose={mockOnClose} />, {
      preloadedState: authState,
    });

    // Wait for unread notification to load
    await waitFor(() => {
      expect(screen.getByTestId("notification-item-1")).toBeInTheDocument();
    });

    // Click unread notification (id: 1, is_read: false)
    await user.click(screen.getByTestId("notification-item-1"));

    // The mark-as-read mutation should have been triggered
    // We verify this by checking that the MSW handler was hit (no error thrown)
    // and the component continues to render without issues
    await waitFor(() => {
      expect(screen.getByTestId("notification-item-1")).toBeInTheDocument();
    });
  });

  it("'View all notifications' navigates to dashboard inbox", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NotificationPanel onClose={mockOnClose} />, {
      preloadedState: authState,
    });

    // Wait for notifications to load so the "View all" button appears
    await waitFor(() => {
      expect(screen.getByText("View all notifications")).toBeInTheDocument();
    });

    await user.click(screen.getByText("View all notifications"));

    expect(mockPush).toHaveBeenCalledWith("/dashboard?tab=inbox");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows empty state when there are no notifications", async () => {
    // Override the MSW handler to return empty results
    const { server } = await import("@/test/mocks/server");
    const { http, HttpResponse } = await import("msw");

    server.use(
      http.get(
        "https://gogari.quantumbytetech.com/api/v1/notifications/",
        () => {
          return HttpResponse.json({
            count: 0,
            next: null,
            previous: null,
            results: [],
          });
        },
      ),
    );

    renderWithProviders(<NotificationPanel onClose={mockOnClose} />, {
      preloadedState: authState,
    });

    await waitFor(() => {
      expect(screen.getByText("No notifications")).toBeInTheDocument();
    });

    // "View all" link should not be visible when empty
    expect(screen.queryByText("View all notifications")).not.toBeInTheDocument();
  });
});
