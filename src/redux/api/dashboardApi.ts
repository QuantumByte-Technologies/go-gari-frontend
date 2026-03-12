import { baseApi } from "./baseApi";
import type { DashboardOverview } from "@/types/api/dashboard";
import type { PaginatedResponse } from "@/types/api/common";

// ─── Refund item type (returned by refunds endpoint) ─────────────
export interface RefundItem {
  id: number;
  booking_id: string;
  amount: string;
  status: "pending" | "processed" | "failed";
  reason: string;
  created_at: string;
  processed_at: string | null;
}

// ─── Dashboard API ───────────────────────────────────────────────

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Client dashboard overview: upcoming bookings, active trips, pending payments, recent notifications */
    getDashboardOverview: builder.query<DashboardOverview, void>({
      query: () => "/client/dashboard/",
      providesTags: ["Dashboard"],
    }),

    /** Paginated list of refund history */
    getRefunds: builder.query<
      PaginatedResponse<RefundItem>,
      { page?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        const qs = searchParams.toString();
        return `/client/refunds/${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardOverviewQuery, useGetRefundsQuery } =
  dashboardApi;

export default dashboardApi;
