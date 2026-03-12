import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// ── Mock next/navigation ────────────────────────────────────────
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/payments/success",
}));

// ── Mock next/link ──────────────────────────────────────────────
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

import PaymentSuccessPage from "../../payments/success/page";

describe("PaymentSuccessPage", () => {
  it("renders success message", () => {
    mockSearchParams = new URLSearchParams();
    render(<PaymentSuccessPage />);

    expect(screen.getByText("Payment Successful!")).toBeInTheDocument();
    expect(
      screen.getByText(/Your payment has been processed successfully/),
    ).toBeInTheDocument();
    expect(screen.getByText("Return Home")).toBeInTheDocument();
  });

  it("shows booking ID when provided in query params", () => {
    mockSearchParams = new URLSearchParams("booking_id=BK-20260401-001");
    render(<PaymentSuccessPage />);

    expect(screen.getByText("BK-20260401-001")).toBeInTheDocument();
    expect(screen.getByText("View My Bookings")).toBeInTheDocument();
  });

  it("hides View My Bookings link when no booking_id", () => {
    mockSearchParams = new URLSearchParams();
    render(<PaymentSuccessPage />);

    expect(screen.queryByText("View My Bookings")).not.toBeInTheDocument();
  });
});
