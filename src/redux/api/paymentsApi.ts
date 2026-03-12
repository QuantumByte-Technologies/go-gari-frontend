import { baseApi } from "./baseApi";
import type {
  PaymentInitiateRequest,
  PaymentInitiateResponse,
} from "@/types/api/payments";

// ─── Payments API ────────────────────────────────────────────────

const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Initiate an SSLCommerz payment for a booking.
     * Returns a `payment_url` that the frontend should redirect to.
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
