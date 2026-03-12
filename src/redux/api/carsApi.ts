import { baseApi } from "./baseApi";
import type { PaginatedResponse } from "@/types/api/common";
import type {
  CarListItem,
  CarDetail,
  CarSearchParams,
  CarAvailabilityParams,
  CarAvailabilityResponse,
  CarBookedDatesResponse,
  NearbyCarParams,
} from "@/types/api/cars";
import type { ChauffeurListItem } from "@/types/api/chauffeurs";

// ─── Cars API ────────────────────────────────────────────────────
const carsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List cars with filters and pagination */
    getCars: builder.query<PaginatedResponse<CarListItem>, CarSearchParams>({
      query: (params) => {
        // Filter out undefined/null params
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.set(key, String(value));
          }
        }
        const qs = searchParams.toString();
        return `/cars/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "CarList" as const,
                id,
              })),
              { type: "CarList", id: "LIST" },
            ]
          : [{ type: "CarList", id: "LIST" }],
    }),

    /** Get single car detail by ID */
    getCarById: builder.query<CarDetail, number>({
      query: (id) => `/cars/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Car", id }],
    }),

    /** Check car availability for a date range */
    getCarAvailability: builder.query<
      CarAvailabilityResponse,
      CarAvailabilityParams
    >({
      query: ({ id, start_date, end_date }) =>
        `/cars/${id}/availability/?start_date=${start_date}&end_date=${end_date}`,
    }),

    /** Get booked dates for a car */
    getCarBookedDates: builder.query<CarBookedDatesResponse, number>({
      query: (id) => `/cars/${id}/booked-dates/`,
    }),

    /** Get chauffeurs available for a specific car */
    getCarChauffeurs: builder.query<
      PaginatedResponse<ChauffeurListItem>,
      { id: number; page?: number }
    >({
      query: ({ id, page }) =>
        `/cars/${id}/chauffeurs/${page ? `?page=${page}` : ""}`,
      providesTags: (_result, _error, { id }) => [
        { type: "Chauffeur", id: `car-${id}` },
      ],
    }),

    /** Get nearby cars based on lat/lng */
    getNearbyCars: builder.query<
      PaginatedResponse<CarListItem>,
      NearbyCarParams
    >({
      query: ({ lat, lng, radius, page }) => {
        const params = new URLSearchParams({
          lat: String(lat),
          lng: String(lng),
        });
        if (radius !== undefined) params.set("radius", String(radius));
        if (page !== undefined) params.set("page", String(page));
        return `/cars/nearby/?${params.toString()}`;
      },
      providesTags: [{ type: "CarList", id: "NEARBY" }],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useGetCarAvailabilityQuery,
  useGetCarBookedDatesQuery,
  useGetCarChauffeursQuery,
  useGetNearbyCarsQuery,
} = carsApi;

export default carsApi;
