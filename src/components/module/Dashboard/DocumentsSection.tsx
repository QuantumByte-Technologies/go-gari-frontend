"use client";

import React, { useRef } from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  IdentificationCard,
  Spinner,
  Trash,
  Upload,
  XCircle,
} from "@phosphor-icons/react";
import {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} from "@/redux/api/documentsApi";
import type { DocumentType, DocumentStatus } from "@/types/api/documents";
import { toast } from "sonner";

const DOCUMENT_LABELS: Record<DocumentType, string> = {
  driving_license: "Driving License",
  nid_front: "NID (Front)",
  nid_back: "NID (Back)",
  passport: "Passport",
};

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  approved: { label: "Approved", color: "text-green-700 bg-green-100", icon: CheckCircle },
  pending: { label: "Pending Review", color: "text-amber-700 bg-amber-100", icon: Clock },
  rejected: { label: "Rejected", color: "text-red-700 bg-red-100", icon: XCircle },
};

export default function DocumentsSection() {
  const { data, isLoading } = useGetDocumentsQuery();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedDocTypeRef = useRef<DocumentType>("driving_license");

  const documents = data?.results ?? [];

  const handleUploadClick = (docType: DocumentType) => {
    selectedDocTypeRef.current = docType;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document_type", selectedDocTypeRef.current);
    formData.append("document_number", "");
    formData.append("file", file);

    try {
      await uploadDocument(formData).unwrap();
      toast.success("Document uploaded successfully");
    } catch {
      toast.error("Failed to upload document");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDocument(id).unwrap();
      toast.success("Document deleted");
    } catch {
      toast.error("Failed to delete document");
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className="bg-white rounded-2xl border border-gray-200 p-6"
        data-testid="documents-loading"
      >
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Upload zones for types without an existing document
  const uploadableTypes: DocumentType[] = [
    "driving_license",
    "nid_front",
    "nid_back",
    "passport",
  ];
  const existingTypes = new Set(documents.map((d) => d.document_type));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <IdentificationCard
          size={20}
          weight="duotone"
          className="text-[#5E9D34]"
        />
        Documents
      </h3>

      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileChange}
        data-testid="document-file-input"
      />

      {/* Existing documents */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {documents.map((doc) => {
            const statusConfig = STATUS_CONFIG[doc.status];
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {DOCUMENT_LABELS[doc.document_type] ?? doc.document_type}
                    </p>
                    {doc.document_number && (
                      <p className="text-xs text-gray-500">
                        {doc.document_number}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.color}`}
                  >
                    <StatusIcon size={14} weight="fill" />
                    {statusConfig.label}
                  </span>
                </div>

                {doc.status === "rejected" && doc.admin_notes && (
                  <p className="text-xs text-red-600 mb-2">
                    {doc.admin_notes}
                  </p>
                )}

                {doc.expiry_date && (
                  <p className="text-xs text-gray-500">
                    Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                  </p>
                )}

                {/* Delete button for rejected/pending documents */}
                {(doc.status === "rejected" || doc.status === "pending") && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                    aria-label={`Delete ${DOCUMENT_LABELS[doc.document_type]}`}
                  >
                    <Trash size={14} weight="bold" />
                    {doc.status === "rejected"
                      ? "Delete & Re-upload"
                      : "Delete"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload zones for missing document types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {uploadableTypes
          .filter((type) => !existingTypes.has(type))
          .map((docType) => (
            <div key={docType} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {DOCUMENT_LABELS[docType]}
              </label>
              <button
                onClick={() => handleUploadClick(docType)}
                disabled={isUploading}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#5E9D34] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <Spinner
                    size={32}
                    className="text-gray-400 mx-auto mb-2 animate-spin"
                  />
                ) : docType === "passport" ? (
                  <FileText
                    size={32}
                    weight="duotone"
                    className="text-gray-400 mx-auto mb-2"
                  />
                ) : (
                  <Upload
                    size={32}
                    weight="duotone"
                    className="text-gray-400 mx-auto mb-2"
                  />
                )}
                <p className="text-sm text-gray-600">Click to upload</p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, PDF up to 5MB
                </p>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
