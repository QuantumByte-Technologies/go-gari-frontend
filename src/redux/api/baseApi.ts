import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, setTokens } from "../features/auth/authSlice";

// ─── Base URL ───────────────────────────────────────────────────
const baseUrl =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_DEV_BASE_URL;

if (!baseUrl) {
  throw new Error("Environment variable NEXT_PUBLIC_BASE_URL is not set");
}

// ─── Raw base query with Bearer token ───────────────────────────
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// ─── Base query with automatic token refresh on 401 ─────────────
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      // Attempt to refresh the access token
      const refreshResult = await rawBaseQuery(
        {
          url: "/accounts/token/refresh/",
          method: "POST",
          body: { refresh: refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const data = refreshResult.data as {
          access: string;
          refresh?: string;
        };

        // Store the new tokens
        api.dispatch(
          setTokens({
            accessToken: data.access,
            refreshToken: data.refresh,
          }),
        );

        // Retry the original request with the new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — log the user out
        api.dispatch(logout());
      }
    } else {
      // No refresh token available — log the user out
      api.dispatch(logout());
    }
  }

  return result;
};

// ─── Base API ───────────────────────────────────────────────────
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
    "Profile",
    "Car",
    "CarList",
    "Booking",
    "BookingList",
    "Trip",
    "TripList",
    "Chauffeur",
    "ChauffeurReview",
    "Notification",
    "Document",
    "Dashboard",
  ],
});

export default baseApi;
