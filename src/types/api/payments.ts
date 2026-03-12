// ─── Payments API types ──────────────────────────────────────────

/** Request to initiate a payment via SSLCommerz */
export interface PaymentInitiateRequest {
  booking_id: number;
}

/** Response from payment initiation */
export interface PaymentInitiateResponse {
  payment_url: string;
  tran_id: string;
}

/** Refund record from client dashboard */
export interface RefundListItem {
  id: number;
  booking_id: string;
  amount: string; // decimal as string
  status: string;
  created_at: string;
}
