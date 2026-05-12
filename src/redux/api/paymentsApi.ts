import { baseApi } from "./baseApi";
import type {
  PaymentInitiateRequest,
  PaymentInitiateResponse,
} from "@/types/api/payments";

// ─── Payments API ────────────────────────────────────────────────

const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Initiate a DGePay payment for an approved booking.
     * Returns a `payment_url` (DGePay checkout webview) that the frontend
     * should redirect the user to. After payment, the gateway bounces the
     * user back through the backend redirect handler to /payments/success
     * (or /payments/fail / /payments/cancel).
     */
    initiatePayment: builder.mutation<
      PaymentInitiateResponse,
      PaymentInitiateRequest
    >({
      query: (body) => ({
        url: "/payments/initiate/",
        method: "POST",
        body,
      }),
      // After initiating payment, invalidate booking tags so status updates
      // are reflected when the user returns from the payment gateway
      invalidatesTags: [
        { type: "BookingList", id: "LIST" },
        { type: "Dashboard" },
      ],
    }),
  }),
});

export const { useInitiatePaymentMutation } = paymentsApi;

export default paymentsApi;
