import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import VerifyOtpPage from "@/app/(authLayout)/auth/verify-otp/page";

// Mock next/navigation
const mockPush = vi.fn();
let mockPhone = "+8801700000000";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/auth/verify-otp",
  useSearchParams: () => new URLSearchParams({ phone: mockPhone }),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("OtpVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPhone = "+8801700000000";
  });

  it("renders 6-digit OTP input", () => {
    renderWithProviders(<VerifyOtpPage />);

    // Should have 6 individual input fields
    const otpInputs = screen.getAllByRole("textbox");
    expect(otpInputs).toHaveLength(6);

    // Should display the phone number
    expect(screen.getByText("+8801700000000")).toBeInTheDocument();
  });

  it("calls verifyOtp mutation on submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyOtpPage />);

    // Type OTP digits one by one
    const otpInputs = screen.getAllByRole("textbox");
    await user.type(otpInputs[0], "1");
    await user.type(otpInputs[1], "2");
    await user.type(otpInputs[2], "3");
    await user.type(otpInputs[3], "4");
    await user.type(otpInputs[4], "5");
    await user.type(otpInputs[5], "6");

    // Submit
    const submitButton = screen.getByRole("button", { name: /verify/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/signin");
    });
  });

  it("resend OTP button calls resendOtp mutation", async () => {
    // Use fake timers with shouldAdvanceTime so async operations
    // (like waitFor, MSW network calls) still resolve naturally,
    // while we can jump the countdown via advanceTimersByTime.
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    renderWithProviders(<VerifyOtpPage />);

    // Initially the resend button should show countdown
    expect(screen.getByText(/resend in/i)).toBeInTheDocument();

    // Fast-forward past the 60-second countdown
    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });

    // Now the button should say "Resend OTP"
    expect(screen.getByText(/resend otp/i)).toBeInTheDocument();

    // Click resend
    await user.click(screen.getByText(/resend otp/i));

    // After resend, countdown should restart
    await waitFor(() => {
      expect(screen.getByText(/resend in/i)).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it("shows countdown timer after resend", () => {
    renderWithProviders(<VerifyOtpPage />);

    // On initial render, countdown should be active
    expect(screen.getByText(/resend in 60s/i)).toBeInTheDocument();
  });
});
