import { describe, it, expect } from "vitest";
import { documentUploadSchema } from "@/schemas/documents";

describe("documentUploadSchema", () => {
  it("accepts valid upload data", () => {
    const file = new File(["content"], "nid.jpg", { type: "image/jpeg" });
    const result = documentUploadSchema.safeParse({
      document_type: "nid_front",
      document_number: "1234567890",
      file,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all document types", () => {
    const file = new File(["content"], "doc.pdf", {
      type: "application/pdf",
    });
    const types = [
      "nid_front",
      "nid_back",
      "passport",
      "driving_license",
    ] as const;

    for (const docType of types) {
      const result = documentUploadSchema.safeParse({
        document_type: docType,
        document_number: "DOC123",
        file,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts optional expiry_date", () => {
    const file = new File(["content"], "passport.jpg", {
      type: "image/jpeg",
    });
    const result = documentUploadSchema.safeParse({
      document_type: "passport",
      document_number: "P123456",
      expiry_date: "2030-12-31",
      file,
    });
    expect(result.success).toBe(true);
  });

  it("accepts null expiry_date", () => {
    const file = new File(["content"], "nid.jpg", { type: "image/jpeg" });
    const result = documentUploadSchema.safeParse({
      document_type: "nid_front",
      document_number: "NID123",
      expiry_date: null,
      file,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid document_type", () => {
    const file = new File(["content"], "doc.jpg", { type: "image/jpeg" });
    const result = documentUploadSchema.safeParse({
      document_type: "invalid_type",
      document_number: "123",
      file,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty document_number", () => {
    const file = new File(["content"], "doc.jpg", { type: "image/jpeg" });
    const result = documentUploadSchema.safeParse({
      document_type: "nid_front",
      document_number: "",
      file,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing file", () => {
    const result = documentUploadSchema.safeParse({
      document_type: "nid_front",
      document_number: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-File value for file field", () => {
    const result = documentUploadSchema.safeParse({
      document_type: "nid_front",
      document_number: "123",
      file: "not-a-file",
    });
    expect(result.success).toBe(false);
  });
});
