// ─── Payments API types ──────────────────────────────────────────

/** Request to initiate a payment via SSLCommerz */
export interface PaymentInitiateRequest {
  booking_id: number;
}

/** Payment record as returned by the backend */
export interface PaymentRecord {
  id: number;
  booking_id: number;
  amount: string;
  currency: string;
  transaction_id: string;
  status: string;
  payment_method: string;
  paid_at: string | null;
  created_at: string;
}

/** Response from payment initiation */
export interface PaymentInitiateResponse {
  payment: PaymentRecord;
  payment_url: string;
}

/** Refund record from client dashboard */
export interface RefundListItem {
  id: number;
  booking_id: string;
  amount: string; // decimal as string
  status: string;
  created_at: string;
}
