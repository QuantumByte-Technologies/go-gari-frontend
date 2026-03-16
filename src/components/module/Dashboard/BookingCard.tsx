"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CalendarBlank,
  CaretRight,
  CheckCircle,
  Clock,
  CreditCard,
  XCircle,
  ArrowClockwise,
} from "@phosphor-icons/react";
import type { BookingListItem } from "@/types/api/bookings";

type Props = {
  booking: BookingListItem;
  index: number;
  onCancel: () => void;
  onPay: () => void;
  onViewDetails: () => void;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending_payment: {
    label: "Pending Payment",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  active: {
    label: "Active",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    color: "bg-purple-100 text-purple-700",
    icon: ArrowClockwise,
  },
};

export default function BookingCard({
  booking,
  index,
  onCancel,
  onPay,
  onViewDetails,
}: Props) {
  const isCancelled =
    booking.status === "cancelled" || booking.status === "refunded";
  const isPendingPayment = booking.status === "pending_payment";
  const statusConfig = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.confirmed;
  const StatusIcon = statusConfig.icon;

  const driveLabel =
    booking.drive_type === "with_chauffeur" ? "With Chauffeur" : "Self-Drive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-2xl border overflow-hidden ${
        isCancelled ? "border-red-200 bg-red-50/30" : "border-gray-200"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 text-xs font-bold rounded-full inline-flex items-center gap-1 ${statusConfig.color}`}
              >
                <StatusIcon size={12} weight="bold" />
                {statusConfig.label}
              </span>
              <span className="text-xs text-gray-500">
                {booking.booking_id}
              </span>
            </div>

            <h3
              className={`text-xl font-bold ${isCancelled ? "text-gray-500 line-through" : "text-gray-900"}`}
            >
              {booking.car_name}
            </h3>
            <p className="text-sm text-gray-500">{driveLabel}</p>
          </div>

          <div className="text-right">
            <p
              className={`text-xl font-bold ${isCancelled ? "text-gray-400 line-through" : "text-[#5E9D34]"}`}
            >
              ৳{parseFloat(booking.grand_total).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {booking.car_brand}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <CalendarBlank
              size={16}
              weight="duotone"
              className="text-gray-400"
            />
            {new Date(booking.start_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            -{" "}
            {new Date(booking.end_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPendingPayment && (
            <>
              <Button size="sm" onClick={onPay}>
                <CreditCard size={16} weight="bold" className="mr-2" />
                Pay Now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </>
          )}

          {booking.status === "completed" && (
            <Button
              size="sm"
              onClick={() => (window.location.href = "/search")}
            >
              <ArrowClockwise size={16} weight="bold" className="mr-2" />
              Book Again
            </Button>
          )}

          {isCancelled && (
            <Button
              size="sm"
              onClick={() => (window.location.href = "/search")}
            >
              <ArrowClockwise size={16} weight="bold" className="mr-2" />
              Rebook
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={onViewDetails}
          >
            View Details{" "}
            <CaretRight size={16} weight="bold" className="ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
