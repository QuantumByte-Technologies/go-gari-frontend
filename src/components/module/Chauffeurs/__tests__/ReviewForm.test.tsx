import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders, userEvent } from "@/test/test-utils";
import ReviewForm from "../ReviewForm";

// ── Mock next/navigation ────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => "/chauffeurs/1",
  useSearchParams: () => new URLSearchParams(),
}));

describe("ReviewForm", () => {
  let mockOnSubmit: ReturnType<typeof vi.fn>;
  let mockOnCancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    mockOnCancel = vi.fn();
  });

  it("star rating selection works (1-5)", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ReviewForm
        chauffeurId={1}
        bookingId={1}
        onSubmit={mockOnSubmit as any}
        onCancel={mockOnCancel as any}
      />,
    );

    // Should show "Write a Review" heading
    expect(screen.getByText("Write a Review")).toBeInTheDocument();

    // Should show 5 star buttons
    const starButtons = screen.getAllByRole("radio");
    expect(starButtons).toHaveLength(5);

    // Click the 4th star
    await user.click(screen.getByLabelText("4 stars"));

    // The 4th star should be checked
    expect(screen.getByLabelText("4 stars")).toHaveAttribute(
      "aria-checked",
      "true",
    );

    // 5th star should not be checked
    expect(screen.getByLabelText("5 stars")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("validates minimum 1 star", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ReviewForm
        chauffeurId={1}
        bookingId={1}
        onSubmit={mockOnSubmit as any}
        onCancel={mockOnCancel as any}
      />,
    );

    // Submit without selecting a star
    const submitButton = screen.getByText("Submit Review");
    await user.click(submitButton);

    // Should show validation error for rating
    await waitFor(() => {
      // The form should NOT call onSubmit when validation fails
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("submits review with rating and text", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ReviewForm
        chauffeurId={1}
        bookingId={1}
        onSubmit={mockOnSubmit as any}
        onCancel={mockOnCancel as any}
      />,
    );

    // Select 5 stars
    await user.click(screen.getByLabelText("5 stars"));

    // Type review text
    const textarea = screen.getByPlaceholderText(
      "Share your experience with this chauffeur...",
    );
    await user.type(textarea, "Great chauffeur, very professional!");

    // Submit
    await user.click(screen.getByText("Submit Review"));

    // Should call onSubmit with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    const callArgs = mockOnSubmit.mock.calls[0][0];
    expect(callArgs.rating).toBe(5);
    expect(callArgs.review_text).toBe("Great chauffeur, very professional!");
    expect(callArgs.booking_id).toBe(1);
  });

  it("edit mode pre-fills existing review data", async () => {
    renderWithProviders(
      <ReviewForm
        chauffeurId={1}
        bookingId={1}
        initialData={{
          rating: 4,
          review_text: "Good driver, would recommend.",
          reviewId: 10,
        }}
        onSubmit={mockOnSubmit as any}
        onCancel={mockOnCancel as any}
      />,
    );

    // Should show "Edit Your Review" heading
    expect(screen.getByText("Edit Your Review")).toBeInTheDocument();

    // Should show "Update Review" button instead of "Submit Review"
    expect(screen.getByText("Update Review")).toBeInTheDocument();

    // Star 4 should be checked (pre-filled)
    expect(screen.getByLabelText("4 stars")).toHaveAttribute(
      "aria-checked",
      "true",
    );

    // Textarea should be pre-filled
    const textarea = screen.getByPlaceholderText(
      "Share your experience with this chauffeur...",
    );
    expect(textarea).toHaveValue("Good driver, would recommend.");
  });

  it("cancel button calls onCancel", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ReviewForm
        chauffeurId={1}
        bookingId={1}
        onSubmit={mockOnSubmit as any}
        onCancel={mockOnCancel as any}
      />,
    );

    await user.click(screen.getByText("Cancel"));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
