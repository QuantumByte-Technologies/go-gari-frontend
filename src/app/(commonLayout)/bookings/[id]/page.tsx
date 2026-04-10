"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetBookingByIdQuery } from "@/redux/api/bookingsApi";
import { useInitiatePaymentMutation } from "@/redux/api/paymentsApi";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";
import { formatBDT } from "@/utils/checkout";
import {
  CaretRight,
  Car,
  CalendarBlank,
  MapPin,
  CurrencyDollar,
  Clock,
  User,
  Tag,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Pending Payment", color: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", color: "bg-purple-100 text-purple-700" },
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const bookingId = Number(params.id);

  const { data: booking, isLoading, isError } = useGetBookingByIdQuery(bookingId, {
    skip: !isAuthenticated || isNaN(bookingId),
  });

  const [initiatePayment, { isLoading: isPaying }] = useInitiatePaymentMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, router]);

  const handlePay = async () => {
    if (!booking) return;
    try {
      const result = await initiatePayment({ booking_id: booking.id }).unwrap();
      window.location.href = result.payment_url;
    } catch {
      toast.error("Failed to initiate payment");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#65AA36]" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking not found</h1>
          <p className="text-gray-600 mb-6">This booking doesn&apos;t exist or you don&apos;t have access to it.</p>
          <Button onClick={() => router.push("/dashboard?tab=trips")}>Back to My Trips</Button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[booking.status] ?? { label: booking.status, color: "bg-gray-100 text-gray-700" };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => router.push("/dashboard?tab=trips")} className="hover:text-[#5E9D34] transition-colors">
            My Trips
          </button>
          <CaretRight size={14} weight="bold" />
          <span className="text-gray-900 font-medium">Booking {booking.booking_id}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{booking.car_name}</h1>
              <p className="text-gray-500">{booking.car_brand} {booking.car_model}</p>
            </div>
            <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Tag size={16} weight="duotone" />
            <span>Booking ID: <span className="font-mono font-medium text-gray-700">{booking.booking_id}</span></span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Dates */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <CalendarBlank size={16} weight="duotone" className="text-[#5E9D34]" />
              Trip Dates
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Start Date</span>
                <span className="text-sm font-medium text-gray-900">{booking.start_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">End Date</span>
                <span className="text-sm font-medium text-gray-900">{booking.end_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium text-gray-900">{booking.num_days} day{booking.num_days > 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>

          {/* Drive Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Car size={16} weight="duotone" className="text-[#5E9D34]" />
              Drive Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Drive Type</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {booking.drive_type.replace("_", " ")}
                </span>
              </div>
              {booking.chauffeur_name && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Chauffeur</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <User size={14} weight="duotone" />
                    {booking.chauffeur_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Locations */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <MapPin size={16} weight="duotone" className="text-[#5E9D34]" />
              Locations
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">Pickup</span>
                <p className="text-sm font-medium text-gray-900">{booking.pickup_location_address || "—"}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Drop-off</span>
                <p className="text-sm font-medium text-gray-900">{booking.dropoff_location_address || "—"}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <CurrencyDollar size={16} weight="duotone" className="text-[#5E9D34]" />
              Pricing
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rate per day</span>
                <span className="text-sm font-medium text-gray-900">{formatBDT(booking.rate_per_day)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">{formatBDT(booking.subtotal)}</span>
              </div>
              {parseFloat(booking.discount_amount) > 0 && (
                <div className="flex justify-between text-[#5E9D34]">
                  <span className="text-sm">Discount ({booking.discount_percentage}%)</span>
                  <span className="text-sm font-medium">-{formatBDT(booking.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-[#5E9D34]">{formatBDT(booking.grand_total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expiry notice */}
        {booking.status === "pending_payment" && booking.expires_at && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Clock size={20} weight="fill" className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Payment required</p>
              <p className="text-xs text-amber-600 mt-0.5">
                This booking expires on {new Date(booking.expires_at).toLocaleString()}. Please complete payment before then.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/search-cars/${booking.car}`)}
          >
            View Car
          </Button>
          {booking.status === "pending_payment" && (
            <Button
              onClick={handlePay}
              disabled={isPaying}
              className="bg-[#65AA36] hover:bg-[#5E9D34]"
            >
              {isPaying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Pay Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
