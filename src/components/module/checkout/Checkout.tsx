"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shield, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { VehicleCard } from "./VehicleCard";
import { CustomerInfo } from "./CustomerInfo";
import { PaymentMethod } from "./PaymentMethod";
import { Breadcrumb } from "./Breadcrumb";
import { useCreateBookingMutation } from "@/redux/api/bookingsApi";
import { useInitiatePaymentMutation } from "@/redux/api/paymentsApi";
import { useGetProfileQuery } from "@/redux/api/authApi";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import {
  getBookingDraft,
  clearBookingDraft,
  formatBDT,
  type BookingDraft,
} from "@/utils/checkout";
import type { BookingCreateRequest } from "@/types/api/bookings";

export default function CheckoutPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // ─── Booking draft from localStorage ──────────────────────────
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    const d = getBookingDraft();
    setDraft(d);
    setDraftLoaded(true);
  }, []);

  // ─── Redirect if not authenticated ────────────────────────────
  useEffect(() => {
    if (draftLoaded && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [draftLoaded, isAuthenticated, router]);

  // ─── Profile query ────────────────────────────────────────────
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  // ─── Location state ───────────────────────────────────────────
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [sameAsPickup, setSameAsPickup] = useState(true);

  // ─── Terms acceptance ─────────────────────────────────────────
  const [termsAccepted, setTermsAccepted] = useState(false);

  // ─── Mutations ────────────────────────────────────────────────
  const [createBooking, { isLoading: isCreating }] =
    useCreateBookingMutation();
  const [initiatePayment, { isLoading: isInitiating }] =
    useInitiatePaymentMutation();

  const isSubmitting = isCreating || isInitiating;

  // ─── Form validation ──────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!pickupAddress.trim()) {
      newErrors.pickupAddress = "Pickup address is required";
    }
    if (!sameAsPickup && !dropoffAddress.trim()) {
      newErrors.dropoffAddress = "Drop-off address is required";
    }
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [pickupAddress, dropoffAddress, sameAsPickup, termsAccepted]);

  // ─── Submit handler ───────────────────────────────────────────
  const handleSubmit = async () => {
    if (!draft || !validate()) return;

    const bookingPayload: BookingCreateRequest = {
      car_id: draft.carId,
      start_date: draft.startDate,
      end_date: draft.endDate,
      drive_type: draft.driveType,
      pickup_location: {
        address: pickupAddress.trim(),
      },
      dropoff_location: {
        address: sameAsPickup
          ? pickupAddress.trim()
          : dropoffAddress.trim(),
      },
    };

    try {
      // Step 1: Create booking
      const booking = await createBooking(bookingPayload).unwrap();
      toast.success("Booking created successfully!");

      // Step 2: Initiate SSLCommerz payment
      try {
        const payment = await initiatePayment({
          booking_id: booking.id,
        }).unwrap();

        // Step 3: Clean up and redirect to SSLCommerz
        clearBookingDraft();
        window.location.href = payment.payment_url;
      } catch {
        // Payment initiation failed — booking was created though
        toast.error(
          "Payment could not be initiated. You can pay from your dashboard.",
        );
        clearBookingDraft();
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } };
      toast.error(
        apiErr?.data?.detail ?? "Failed to create booking. Please try again.",
      );
    }
  };

  // ─── Loading / no-draft states ────────────────────────────────
  if (!draftLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#65AA36]" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              No Booking Information Found
            </h1>
            <p className="text-gray-600 mb-6 max-w-md">
              It looks like you haven&apos;t selected a car to book yet. Please
              browse our cars and select your dates to continue.
            </p>
            <button
              onClick={() => router.push("/search-cars")}
              className="bg-[#65AA36] text-white px-6 py-3 rounded-xl font-semibold hover:brightness-95 transition-all"
            >
              Browse Cars
            </button>
          </div>
        </main>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    {
      label: "Car Details",
      onClick: () => router.push(`/search-cars/${draft.carId}`),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Forms */}
          <div className="lg:col-span-7 space-y-8">
            <VehicleCard draft={draft} />
            <CustomerInfo profile={profile ?? null} />

            {/* Location Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Pickup & Drop-off Location
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => {
                      setPickupAddress(e.target.value);
                      if (errors.pickupAddress) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.pickupAddress;
                          return next;
                        });
                      }
                    }}
                    placeholder="e.g. Dhanmondi 27, Dhaka"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#65AA36] focus:border-transparent outline-none transition ${
                      errors.pickupAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.pickupAddress && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.pickupAddress}
                    </p>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsPickup}
                    onChange={(e) => setSameAsPickup(e.target.checked)}
                    className="w-4 h-4 text-[#65AA36] rounded border-gray-300 focus:ring-[#65AA36]"
                  />
                  <span className="text-sm text-gray-600">
                    Drop-off at same location
                  </span>
                </label>

                {!sameAsPickup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drop-off Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={dropoffAddress}
                      onChange={(e) => {
                        setDropoffAddress(e.target.value);
                        if (errors.dropoffAddress) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.dropoffAddress;
                            return next;
                          });
                        }
                      }}
                      placeholder="e.g. Banani 11, Dhaka"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#65AA36] focus:border-transparent outline-none transition ${
                        errors.dropoffAddress
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.dropoffAddress && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.dropoffAddress}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <PaymentMethod />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Booking Summary
                </h2>

                {/* Vehicle Summary */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {draft.carName}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {draft.driveType.replace("_", " ")}
                    </p>
                  </div>
                </div>

                {/* Booking Dates */}
                <div className="space-y-2 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium text-gray-900">
                      {draft.startDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">End Date</span>
                    <span className="font-medium text-gray-900">
                      {draft.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pickup Time</span>
                    <span className="font-medium text-gray-900">
                      {draft.pickupTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Drop-off Time</span>
                    <span className="font-medium text-gray-900">
                      {draft.dropoffTime}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                {draft.pricing && (
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                    <PriceRow
                      label={`Rate per day (${draft.pricing.numDays} day${draft.pricing.numDays > 1 ? "s" : ""})`}
                      value={formatBDT(draft.pricing.ratePerDay)}
                    />
                    <PriceRow
                      label="Subtotal"
                      value={formatBDT(draft.pricing.subtotal)}
                    />
                    {parseFloat(draft.pricing.discountAmount) > 0 && (
                      <PriceRow
                        label={`Discount (${draft.pricing.discountPercentage}%)`}
                        value={`-${formatBDT(draft.pricing.discountAmount)}`}
                        className="text-[#65AA36]"
                      />
                    )}
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-[#65AA36]">
                    {draft.pricing
                      ? formatBDT(draft.pricing.grandTotal)
                      : "Calculating..."}
                  </span>
                </div>

                {/* Terms & Submit */}
                <TermsCheckbox
                  checked={termsAccepted}
                  onToggle={() => setTermsAccepted(!termsAccepted)}
                  error={errors.terms}
                />

                <button
                  onClick={handleSubmit}
                  disabled={!termsAccepted || isSubmitting}
                  className="w-full h-12 bg-[#65AA36] text-white rounded-xl font-bold text-sm hover:brightness-95 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {isCreating
                    ? "Creating Booking..."
                    : isInitiating
                      ? "Initiating Payment..."
                      : "Confirm & Pay"}
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> SSL Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Money-back guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Helper components ──────────────────────────────────────────

function PriceRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium text-gray-900 ${className ?? ""}`}>
        {value}
      </span>
    </div>
  );
}

function TermsCheckbox({
  checked,
  onToggle,
  error,
}: {
  checked: boolean;
  onToggle: () => void;
  error?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-2">
        <div
          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
            checked ? "bg-[#65AA36] border-[#65AA36]" : "border-gray-300"
          }`}
          onClick={onToggle}
          role="checkbox"
          aria-checked={checked}
          aria-label="Accept terms and conditions"
        >
          {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
        </div>
        <p className="text-xs text-gray-600 leading-tight">
          I agree to the{" "}
          <span className="text-[#65AA36] underline cursor-pointer">
            Terms and Conditions
          </span>{" "}
          and{" "}
          <span className="text-[#65AA36] underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
