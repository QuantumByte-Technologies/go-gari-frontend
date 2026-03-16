import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { SignupForm } from "../SignUp";

// Mock next/navigation
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/auth/signup",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SignUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders separate first_name and last_name fields", () => {
    renderWithProviders(<SignupForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("shows validation error for mismatched passwords", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/email address/i), "john@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "+8801712345678");

    // Type mismatched passwords
    const passwordField = screen.getByLabelText(/^password$/i);
    const confirmField = screen.getByLabelText(/confirm password/i);
    await user.type(passwordField, "Password123!");
    await user.type(confirmField, "DifferentPassword!");

    // Check the terms checkbox
    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    // Submit
    const submitButton = screen.getByRole("button", { name: /create account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });

  it("calls register mutation on valid submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

    await user.type(screen.getByLabelText(/first name/i), "New");
    await user.type(screen.getByLabelText(/last name/i), "User");
    await user.type(screen.getByLabelText(/email address/i), "new@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "+8801712345678");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    // Check terms
    await user.click(screen.getByRole("checkbox"));

    // Submit
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/auth/verify-otp?phone="),
      );
    });
  });

  it("redirects to OTP verification after successful registration", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

    await user.type(screen.getByLabelText(/first name/i), "Test");
    await user.type(screen.getByLabelText(/last name/i), "User");
    await user.type(screen.getByLabelText(/email address/i), "new2@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "+8801712345678");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/\/auth\/verify-otp\?phone=/),
      );
    });
  });
});
