import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  renderWithProviders,
  createAuthenticatedState,
} from "@/test/test-utils";
import DocumentsSection from "../DocumentsSection";

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
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

// ── Mock sonner ─────────────────────────────────────────────────
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from "sonner";

describe("DocumentsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading skeleton initially", () => {
    renderWithProviders(<DocumentsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    expect(screen.getByTestId("documents-loading")).toBeInTheDocument();
  });

  it("renders existing documents after loading", async () => {
    renderWithProviders(<DocumentsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for documents to load from MSW
    await waitFor(() => {
      expect(screen.getByText("Driving License")).toBeInTheDocument();
    });

    // Check all three mock documents are rendered
    expect(screen.getByText("NID (Front)")).toBeInTheDocument();
    expect(screen.getByText("Passport")).toBeInTheDocument();

    // Check document numbers
    expect(screen.getByText("DL-2025-12345")).toBeInTheDocument();
    expect(screen.getByText("NID-9876543210")).toBeInTheDocument();
    expect(screen.getByText("BD-A1234567")).toBeInTheDocument();
  });

  it("shows correct status badges", async () => {
    renderWithProviders(<DocumentsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(screen.getByText("Approved")).toBeInTheDocument();
    });

    expect(screen.getByText("Pending Review")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("shows admin notes for rejected documents", async () => {
    renderWithProviders(<DocumentsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Image is blurry, please re-upload a clearer photo."
        )
      ).toBeInTheDocument();
    });
  });

  it("shows delete button for pending and rejected documents, not for approved", async () => {
    renderWithProviders(<DocumentsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for documents
    await waitFor(() => {
      expect(screen.getByText("Driving License")).toBeInTheDocument();
    });

    // Pending doc (NID Front) should have "Delete" button
    expect(screen.getByText("Delete")).toBeInTheDocument();

    // Rejected doc (Passport) should have "Delete & Re-upload" button
    expect(screen.getByText("Delete & Re-upload")).toBeInTheDocument();

    // Approved doc (Driving License) should NOT have a delete button
    expect(
      screen.queryByLabelText("Delete Driving License")
    ).not.toBeInTheDocument();
  });

  it("shows upload zone for missing document types", async () => {
    renderWithProviders(<DocumentsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    // MSW returns driving_license, nid_front, passport — so nid_back is missing
    await waitFor(() => {
      expect(screen.getByText("Driving License")).toBeInTheDocument();
    });

    // The upload zone label for NID (Back) should be present
    // Note: "NID (Back)" appears as a label for the upload zone, not as an existing document
    const uploadLabels = screen.getAllByText("NID (Back)");
    expect(uploadLabels.length).toBe(1);

    // Upload zone should have "Click to upload" text
    expect(screen.getByText("Click to upload")).toBeInTheDocument();
  });

  it("deletes a document and shows success toast", async () => {
    const user = userEvent.setup();

    renderWithProviders(<DocumentsSection />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for documents to load
    await waitFor(() => {
      expect(screen.getByText("Driving License")).toBeInTheDocument();
    });

    // Click delete on the pending NID Front document
    const deleteButton = screen.getByLabelText("Delete NID (Front)");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Document deleted");
    });
  });
});
