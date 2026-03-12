import { baseApi } from "./baseApi";
import type { PaginatedResponse } from "@/types/api/common";
import type {
  BookingListItem,
  BookingDetail,
  BookingCreateRequest,
  BookingStatus,
} from "@/types/api/bookings";

// ─── Bookings API ────────────────────────────────────────────────

interface GetBookingsParams {
  status?: BookingStatus;
  page?: number;
}

const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List the current user's bookings with optional status filter */
    getBookings: builder.query<
      PaginatedResponse<BookingListItem>,
      GetBookingsParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.set("status", params.status);
        if (params?.page) searchParams.set("page", String(params.page));
        const qs = searchParams.toString();
        return `/bookings/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "BookingList" as const,
                id,
              })),
              { type: "BookingList", id: "LIST" },
            ]
          : [{ type: "BookingList", id: "LIST" }],
    }),

    /** Get a single booking by ID */
    getBookingById: builder.query<BookingDetail, number>({
      query: (id) => `/bookings/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Booking", id }],
    }),

    /** Create a new booking */
    createBooking: builder.mutation<BookingDetail, BookingCreateRequest>({
      query: (body) => ({
        url: "/bookings/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "BookingList", id: "LIST" },
        { type: "Dashboard" },
      ],
    }),

    /** Cancel an unpaid booking */
    cancelBooking: builder.mutation<void, number>({
      query: (id) => ({
        url: `/bookings/${id}/cancel/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Booking", id },
        { type: "BookingList", id: "LIST" },
        { type: "Dashboard" },
      ],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
} = bookingsApi;

export default bookingsApi;
