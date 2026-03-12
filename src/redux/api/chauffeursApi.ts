import { baseApi } from "./baseApi";
import type { PaginatedResponse } from "@/types/api/common";
import type {
  ChauffeurListItem,
  ChauffeurDetail,
  ChauffeurReview,
  ChauffeurReviewCreateRequest,
  ChauffeurReviewUpdateRequest,
} from "@/types/api/chauffeurs";

// ─── Chauffeurs API ──────────────────────────────────────────────

const chauffeursApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List all chauffeurs with optional search & pagination */
    getChauffeurs: builder.query<
      PaginatedResponse<ChauffeurListItem>,
      { page?: number; search?: string } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.search) searchParams.set("search", params.search);
        const qs = searchParams.toString();
        return `/chauffeurs/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Chauffeur" as const,
                id,
              })),
              { type: "Chauffeur", id: "LIST" },
            ]
          : [{ type: "Chauffeur", id: "LIST" }],
    }),

    /** Get chauffeur detail by ID */
    getChauffeurById: builder.query<ChauffeurDetail, number>({
      query: (id) => `/chauffeurs/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Chauffeur", id }],
    }),

    /** List reviews for a chauffeur */
    getChauffeurReviews: builder.query<
      PaginatedResponse<ChauffeurReview>,
      { id: number; page?: number }
    >({
      query: ({ id, page }) =>
        `/chauffeurs/${id}/reviews/${page ? `?page=${page}` : ""}`,
      providesTags: (result, _error, { id }) =>
        result
          ? [
              ...result.results.map((r) => ({
                type: "ChauffeurReview" as const,
                id: r.id,
              })),
              { type: "ChauffeurReview", id: `chauffeur-${id}` },
            ]
          : [{ type: "ChauffeurReview", id: `chauffeur-${id}` }],
    }),

    /** Create a review for a chauffeur */
    createChauffeurReview: builder.mutation<
      ChauffeurReview,
      { id: number; data: ChauffeurReviewCreateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/chauffeurs/${id}/reviews/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ChauffeurReview", id: `chauffeur-${id}` },
        { type: "Chauffeur", id }, // rating/review count may have changed
      ],
    }),

    /** Update a chauffeur review */
    updateChauffeurReview: builder.mutation<
      ChauffeurReview,
      {
        chauffeurId: number;
        reviewId: number;
        data: ChauffeurReviewUpdateRequest;
      }
    >({
      query: ({ chauffeurId, reviewId, data }) => ({
        url: `/chauffeurs/${chauffeurId}/reviews/${reviewId}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { chauffeurId, reviewId }) => [
        { type: "ChauffeurReview", id: reviewId },
        { type: "ChauffeurReview", id: `chauffeur-${chauffeurId}` },
        { type: "Chauffeur", id: chauffeurId },
      ],
    }),

    /** Delete a chauffeur review */
    deleteChauffeurReview: builder.mutation<
      void,
      { chauffeurId: number; reviewId: number }
    >({
      query: ({ chauffeurId, reviewId }) => ({
        url: `/chauffeurs/${chauffeurId}/reviews/${reviewId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { chauffeurId, reviewId }) => [
        { type: "ChauffeurReview", id: reviewId },
        { type: "ChauffeurReview", id: `chauffeur-${chauffeurId}` },
        { type: "Chauffeur", id: chauffeurId },
      ],
    }),
  }),
});

export const {
  useGetChauffeursQuery,
  useGetChauffeurByIdQuery,
  useGetChauffeurReviewsQuery,
  useCreateChauffeurReviewMutation,
  useUpdateChauffeurReviewMutation,
  useDeleteChauffeurReviewMutation,
} = chauffeursApi;

export default chauffeursApi;
