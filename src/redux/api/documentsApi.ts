import { baseApi } from "./baseApi";
import type { PaginatedResponse } from "@/types/api/common";
import type { UserDocument } from "@/types/api/documents";

// ─── Documents API ───────────────────────────────────────────────

const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List the current user's uploaded documents */
    getDocuments: builder.query<PaginatedResponse<UserDocument>, void>({
      query: () => "/accounts/documents/",
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Document" as const,
                id,
              })),
              { type: "Document", id: "LIST" },
            ]
          : [{ type: "Document", id: "LIST" }],
    }),

    /** Upload a new document (multipart/form-data) */
    uploadDocument: builder.mutation<UserDocument, FormData>({
      query: (formData) => ({
        url: "/accounts/documents/",
        method: "POST",
        body: formData,
        // Don't set Content-Type — browser will set it with boundary for FormData
      }),
      invalidatesTags: [{ type: "Document", id: "LIST" }],
    }),

    /** Delete a document (only rejected or pending can be deleted) */
    deleteDocument: builder.mutation<void, number>({
      query: (id) => ({
        url: `/accounts/documents/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Document", id },
        { type: "Document", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi;

export default documentsApi;
