"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, Spinner } from "@phosphor-icons/react";
import { useGetBookingsQuery } from "@/redux/api/bookingsApi";
import { useCancelBookingMutation } from "@/redux/api/bookingsApi";
import { useInitiatePaymentMutation } from "@/redux/api/paymentsApi";
import type { BookingListItem, BookingStatus } from "@/types/api/bookings";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BookingCard from "./BookingCard";

type BookingTab = "upcoming" | "active" | "completed" | "cancelled";

const TAB_TO_STATUSES: Record<BookingTab, BookingStatus[]> = {
  upcoming: ["pending_payment", "confirmed"],
  active: ["active"],
  completed: ["completed"],
  cancelled: ["cancelled", "refunded"],
};

export default function TripsSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const tabs: BookingTab[] = useMemo(
    () => ["upcoming", "active", "completed", "cancelled"],
    [],
  );

  const { data, isLoading, error } = useGetBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [initiatePayment] = useInitiatePaymentMutation();

  const allBookings = data?.results ?? [];

  // Filter bookings by active tab's status set
  const filteredBookings = useMemo(() => {
    const statuses = TAB_TO_STATUSES[activeTab];
    return allBookings.filter((b) => statuses.includes(b.status));
  }, [allBookings, activeTab]);

  const upcomingCount = useMemo(() => {
    const statuses = TAB_TO_STATUSES.upcoming;
    return allBookings.filter((b) => statuses.includes(b.status)).length;
  }, [allBookings]);

  const handleCancel = async (booking: BookingListItem) => {
    try {
      await cancelBooking(booking.id).unwrap();
      toast.success("Booking cancelled successfully");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  const handlePay = async (booking: BookingListItem) => {
    try {
      const result = await initiatePayment({
        booking_id: booking.id,
      }).unwrap();
      window.location.href = result.payment_url;
    } catch {
      toast.error("Failed to initiate payment");
    }
  };

  const handleViewDetails = (booking: BookingListItem) => {
    router.push(`/bookings/${booking.id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="trips-loading">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 w-96 bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">Failed to load bookings</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
      </div>

      {/* Booking Status Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
            {tab === "upcoming" && upcomingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#5E9D34] text-white text-xs rounded-full">
                {upcomingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car size={32} weight="duotone" className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "upcoming"
                ? "You don't have any upcoming bookings."
                : `No ${activeTab} bookings to show.`}
            </p>
            {activeTab === "upcoming" && (
              <Button onClick={() => router.push("/search")}>Book a Car</Button>
            )}
          </div>
        ) : (
          filteredBookings.map((booking, index) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              index={index}
              onCancel={() => handleCancel(booking)}
              onPay={() => handlePay(booking)}
              onViewDetails={() => handleViewDetails(booking)}
            />
          ))
        )}
      </div>
    </div>
  );
}
