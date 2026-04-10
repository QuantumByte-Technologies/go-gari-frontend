"use client";

import React, { useRef, useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} from "@/redux/api/documentsApi";
import type { DocumentType, DocumentStatus } from "@/types/api/documents";
import {
  documentUploadSchema,
  type DocumentUploadFormData,
} from "@/schemas/documents";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────

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
  approved: {
    label: "Approved",
    color: "text-green-700 bg-green-100",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending Review",
    color: "text-amber-700 bg-amber-100",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700 bg-red-100",
    icon: XCircle,
  },
};

const THIS_YEAR = new Date().getFullYear();

// ─── Upload Dialog ────────────────────────────────────────────────

interface UploadDialogProps {
  docType: DocumentType;
  open: boolean;
  onClose: () => void;
}

function UploadDialog({ docType, open, onClose }: UploadDialogProps) {
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      document_type: docType,
      document_number: "",
      expiry_date: null,
    },
  });

  const selectedFile = watch("file");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate preview URL when file is selected
  React.useEffect(() => {
    if (selectedFile && selectedFile instanceof File && selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [selectedFile]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: DocumentUploadFormData) => {
    const formData = new FormData();
    formData.append("document_type", data.document_type);
    formData.append("document_number", data.document_number);
    if (data.expiry_date) {
      formData.append("expiry_date", data.expiry_date);
    }
    formData.append("file", data.file);

    try {
      await uploadDocument(formData).unwrap();
      toast.success("Document uploaded successfully");
      handleClose();
    } catch (err: unknown) {
      const apiErr = err as { data?: Record<string, unknown> };
      const data = apiErr?.data;
      if (data) {
        if (typeof data.detail === "string") {
          toast.error(data.detail);
          return;
        }
        for (const value of Object.values(data)) {
          if (Array.isArray(value) && value.length > 0) {
            toast.error(value[0] as string);
            return;
          }
          if (typeof value === "string") {
            toast.error(value);
            return;
          }
        }
      }
      toast.error("Failed to upload document");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Upload {DOCUMENT_LABELS[docType]}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Document Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register("document_number")}
              type="text"
              placeholder="e.g. DL-2025-12345"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#65AA36] focus:border-transparent"
            />
            {errors.document_number && (
              <p className="mt-1 text-xs text-red-600">
                {errors.document_number.message}
              </p>
            )}
          </div>

          {/* Expiry Date (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <Controller
              control={control}
              name="expiry_date"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? ""}
                  onChange={(val) => field.onChange(val || null)}
                  placeholder="Select expiry date"
                  fromYear={THIS_YEAR}
                  toYear={THIS_YEAR + 20}
                />
              )}
            />
          </div>

          {/* File Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              data-testid="document-file-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setValue("file", file, { shouldValidate: true });
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#65AA36] transition-colors"
            >
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2 text-sm text-gray-700">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Document preview"
                      className="max-h-32 max-w-full rounded-lg object-contain border border-gray-200"
                    />
                  ) : (
                    <FileText size={32} weight="duotone" className="text-[#65AA36]" />
                  )}
                  <span className="truncate max-w-[200px] text-xs text-gray-500">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-[#65AA36] font-medium">Click to change</span>
                </div>
              ) : (
                <>
                  <Upload
                    size={28}
                    weight="duotone"
                    className="text-gray-400 mx-auto mb-1"
                  />
                  <p className="text-sm text-gray-600">Click to choose file</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    JPG, PNG, PDF up to 5MB
                  </p>
                </>
              )}
            </button>
            {errors.file && (
              <p className="mt-1 text-xs text-red-600">
                {errors.file.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#65AA36] px-4 py-2 text-sm font-medium text-white hover:bg-[#5E9D34] transition-colors disabled:opacity-60"
            >
              {isLoading && (
                <Spinner size={16} className="animate-spin" />
              )}
              Upload
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function DocumentsSection() {
  const { data, isLoading } = useGetDocumentsQuery();
  const [deleteDocument] = useDeleteDocumentMutation();
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);

  const documents = data?.results ?? [];

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

                {/* Delete button for rejected documents only */}
                {doc.status === "rejected" && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                    aria-label={`Delete ${DOCUMENT_LABELS[doc.document_type]}`}
                  >
                    <Trash size={14} weight="bold" />
                    Delete & Re-upload
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
                onClick={() => setUploadingType(docType)}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#5E9D34] transition-colors cursor-pointer"
              >
                {docType === "passport" ? (
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

      {/* Upload dialog — rendered once, keyed to docType so form resets */}
      {uploadingType && (
        <UploadDialog
          key={uploadingType}
          docType={uploadingType}
          open={true}
          onClose={() => setUploadingType(null)}
        />
      )}
    </div>
  );
}
