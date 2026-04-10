// ─── Pricing API types ───────────────────────────────────────────

/** Parameters for the pricing calculation endpoint */
export interface PricingCalculateParams {
  car_id: number;
  start_date: string;
  end_date: string;
  with_chauffeur: boolean;
}

/** Response from the pricing calculation endpoint */
export interface PricingCalculateResponse {
  num_days: number;
  rate_per_day: string;
  chauffeur_rate_per_day: string;
  subtotal: string;
  discount_percentage: string;
  discount_amount: string;
  grand_total: string;
}
