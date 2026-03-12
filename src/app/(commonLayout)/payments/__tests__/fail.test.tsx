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
  usePathname: () => "/payments/fail",
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

import PaymentFailPage from "../../payments/fail/page";

describe("PaymentFailPage", () => {
  it("renders failure message", () => {
    mockSearchParams = new URLSearchParams();
    render(<PaymentFailPage />);

    expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    expect(
      screen.getByText(/your payment could not be processed/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Return Home")).toBeInTheDocument();
  });

  it("shows Retry Payment link when booking_id is provided", () => {
    mockSearchParams = new URLSearchParams("booking_id=BK-20260401-001");
    render(<PaymentFailPage />);

    expect(screen.getByText("Retry Payment")).toBeInTheDocument();
  });

  it("hides Retry Payment link when no booking_id", () => {
    mockSearchParams = new URLSearchParams();
    render(<PaymentFailPage />);

    expect(screen.queryByText("Retry Payment")).not.toBeInTheDocument();
  });
});
