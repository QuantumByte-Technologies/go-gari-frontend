import { baseApi } from "./baseApi";
import type {
  PricingCalculateParams,
  PricingCalculateResponse,
} from "@/types/api/pricing";

// ─── Pricing API ─────────────────────────────────────────────────
const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Calculate pricing for a car rental */
    calculatePricing: builder.query<
      PricingCalculateResponse,
      PricingCalculateParams
    >({
      query: ({ car_id, start_date, end_date, with_chauffeur }) => {
        const params = new URLSearchParams({
          car_id: String(car_id),
          start_date,
          end_date,
          with_chauffeur: String(with_chauffeur),
        });
        return `/pricing/calculate/?${params.toString()}`;
      },
    }),
  }),
});

export const { useCalculatePricingQuery } = pricingApi;

export default pricingApi;
