import baseApi from "./baseApi";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  VerifyOtpRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserProfile,
  ProfileUpdateRequest,
  VerificationStatusResponse,
} from "@/types/api/auth";
import { setCredentials, logout as logoutAction } from "../features/auth/authSlice";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Login ──────────────────────────────────────────────────────
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/accounts/login/",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.access,
              refreshToken: data.refresh,
            }),
          );
        } catch {
          // Login failed — error handled by the component
        }
      },
    }),

    // ── Register ───────────────────────────────────────────────────
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/accounts/register/",
        method: "POST",
        body: data,
      }),
    }),

    // ── Logout ─────────────────────────────────────────────────────
    logout: builder.mutation<void, { refresh: string }>({
      query: (body) => ({
        url: "/accounts/logout/",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Always clear state, even if the API call fails
          dispatch(logoutAction());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    // ── OTP Verification ───────────────────────────────────────────
    verifyOtp: builder.mutation<{ detail: string }, VerifyOtpRequest>({
      query: (data) => ({
        url: "/accounts/verify-otp/",
        method: "POST",
        body: data,
      }),
    }),

    // ── Resend OTP ─────────────────────────────────────────────────
    resendOtp: builder.mutation<{ detail: string }, ResendOtpRequest>({
      query: (data) => ({
        url: "/accounts/resend-otp/",
        method: "POST",
        body: data,
      }),
    }),

    // ── Forgot Password ────────────────────────────────────────────
    forgotPassword: builder.mutation<{ detail: string }, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/accounts/forgot-password/",
        method: "POST",
        body: data,
      }),
    }),

    // ── Reset Password ─────────────────────────────────────────────
    resetPassword: builder.mutation<{ detail: string }, ResetPasswordRequest>({
      query: (data) => ({
        url: "/accounts/reset-password/",
        method: "POST",
        body: data,
      }),
    }),

    // ── Refresh Token ──────────────────────────────────────────────
    refreshToken: builder.mutation<TokenRefreshResponse, TokenRefreshRequest>({
      query: (data) => ({
        url: "/accounts/token/refresh/",
        method: "POST",
        body: data,
      }),
    }),

    // ── Get Profile ────────────────────────────────────────────────
    getProfile: builder.query<UserProfile, void>({
      query: () => "/accounts/profile/",
      providesTags: ["Profile"],
    }),

    // ── Update Profile ─────────────────────────────────────────────
    updateProfile: builder.mutation<UserProfile, ProfileUpdateRequest>({
      query: (data) => ({
        url: "/accounts/profile/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ── Verification Status ────────────────────────────────────────
    getVerificationStatus: builder.query<VerificationStatusResponse, void>({
      query: () => "/accounts/verification-status/",
      providesTags: ["Auth"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetVerificationStatusQuery,
} = authApi;

export default authApi;
