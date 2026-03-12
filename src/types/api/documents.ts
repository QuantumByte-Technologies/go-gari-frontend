// ─── Documents API types ─────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────
export type DocumentType =
  | "nid_front"
  | "nid_back"
  | "passport"
  | "driving_license";

export type DocumentStatus = "pending" | "approved" | "rejected";

// ── Data types ───────────────────────────────────────────────────
export interface UserDocument {
  id: number;
  document_type: DocumentType;
  document_number: string;
  expiry_date: string | null;
  file: string;
  uploaded_at: string;
  status: DocumentStatus;
  admin_notes: string;
}

/** Request to upload a new document */
export interface UserDocumentUploadRequest {
  document_type: DocumentType;
  document_number: string;
  expiry_date?: string | null;
  file: File;
}
