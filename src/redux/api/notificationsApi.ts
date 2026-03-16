import { baseApi } from "./baseApi";
import type { PaginatedResponse } from "@/types/api/common";
import type { Notification, UnreadCountResponse } from "@/types/api/notifications";

// ─── Notifications API ───────────────────────────────────────────

interface GetNotificationsParams {
  is_read?: boolean;
  page?: number;
}

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List notifications with optional is_read filter */
    getNotifications: builder.query<
      PaginatedResponse<Notification>,
      GetNotificationsParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.is_read !== undefined)
          searchParams.set("is_read", String(params.is_read));
        if (params?.page) searchParams.set("page", String(params.page));
        const qs = searchParams.toString();
        return `/notifications/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Notification" as const,
                id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),

    /** Mark a single notification as read */
    markAsRead: builder.mutation<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}/read/`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
      ],
    }),

    /** Get count of unread notifications */
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => "/notifications/unread-count/",
      providesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useGetUnreadCountQuery,
} = notificationsApi;

export default notificationsApi;
