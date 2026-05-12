import { baseApi } from "./baseApi";
import type { PaginatedResponse } from "@/types/api/common";
import type {
  TripListItem,
  TripDetail,
  TripPhoto,
  TripStatus,
} from "@/types/api/trips";

// ─── Trips API ───────────────────────────────────────────────────

interface GetTripsParams {
  status?: TripStatus;
  page?: number;
}

const tripsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List the current user's trips with optional status filter */
    getTrips: builder.query<
      PaginatedResponse<TripListItem>,
      GetTripsParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.set("status", params.status);
        if (params?.page) searchParams.set("page", String(params.page));
        const qs = searchParams.toString();
        return `/trips/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "TripList" as const,
                id,
              })),
              { type: "TripList", id: "LIST" },
            ]
          : [{ type: "TripList", id: "LIST" }],
    }),

    /** Get a single trip by ID */
    getTripById: builder.query<TripDetail, number>({
      query: (id) => `/trips/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Trip", id }],
    }),

    /** Mark a trip as completed. Backend returns the updated TripDetail. */
    completeTrip: builder.mutation<TripDetail, number>({
      query: (id) => ({
        url: `/trips/${id}/complete/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Trip", id },
        { type: "TripList", id: "LIST" },
        { type: "Dashboard" },
      ],
    }),

    /** Get photos for a trip */
    getTripPhotos: builder.query<
      PaginatedResponse<TripPhoto>,
      { id: number; page?: number }
    >({
      query: ({ id, page }) => {
        const searchParams = new URLSearchParams();
        if (page) searchParams.set("page", String(page));
        const qs = searchParams.toString();
        return `/trips/${id}/photos/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (_result, _error, { id }) => [{ type: "Trip", id }],
    }),

    /** Upload pre-trip photos. Returns the created TripPhoto rows. */
    uploadPrePhotos: builder.mutation<TripPhoto[], { id: number; photos: FormData }>({
      query: ({ id, photos }) => ({
        url: `/trips/${id}/pre-photos/`,
        method: "POST",
        body: photos,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Trip", id },
        { type: "TripList", id: "LIST" },
      ],
    }),

    /** Upload post-trip photos. Returns the created TripPhoto rows. */
    uploadPostPhotos: builder.mutation<TripPhoto[], { id: number; photos: FormData }>({
      query: ({ id, photos }) => ({
        url: `/trips/${id}/post-photos/`,
        method: "POST",
        body: photos,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Trip", id },
        { type: "TripList", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTripsQuery,
  useGetTripByIdQuery,
  useCompleteTripMutation,
  useGetTripPhotosQuery,
  useUploadPrePhotosMutation,
  useUploadPostPhotosMutation,
} = tripsApi;

export default tripsApi;
