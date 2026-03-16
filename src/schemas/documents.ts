import { z } from "zod";

// ─── Document Upload ─────────────────────────────────────────────
export const documentUploadSchema = z.object({
  document_type: z.enum(
    ["nid_front", "nid_back", "passport", "driving_license"],
    { message: "Please select a document type" },
  ),
  document_number: z
    .string()
    .min(1, "Document number is required")
    .max(100),
  expiry_date: z.string().nullable().optional(),
  file: z.instanceof(File, { message: "File is required" }),
});

// ─── Inferred types ──────────────────────────────────────────────
export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;
