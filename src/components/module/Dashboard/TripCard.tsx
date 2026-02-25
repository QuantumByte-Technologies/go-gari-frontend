/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CalendarBlank,
  MapPinLine,
  Clock,
  CheckCircle,
  XCircle,
  Warning,
  Star,
  ArrowClockwise,
  CaretRight,
} from "@phosphor-icons/react";
import { AnyTrip, TripTabType } from "@/types/dashboard/types";

type Props = {
  trip: AnyTrip;
  tripTab: TripTabType;
  index: number;
  onModify: () => void;
  onNavigateToSearch: () => void;
  onNavigateToDetails: () => void;
};

export default function TripCard({
  trip,
  tripTab,
  index,
  onModify,
  onNavigateToSearch,
  onNavigateToDetails,
}: Props) {
  const isCancelled = tripTab === "cancelled";
  const isCompleted = tripTab === "completed";
  const isUpcoming = tripTab === "upcoming";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-2xl border overflow-hidden ${
        isCancelled ? "border-red-200 bg-red-50/30" : "border-gray-200"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        <div
          className={`w-full md:w-56 h-40 md:h-auto ${isCancelled ? "opacity-60" : ""}`}
        >
          <img
            src={trip.carImage}
            alt={trip.carName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isUpcoming
                      ? "bg-blue-100 text-blue-700"
                      : isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {isUpcoming && (
                    <Clock size={12} weight="bold" className="inline mr-1" />
                  )}
                  {isCompleted && (
                    <CheckCircle
                      size={12}
                      weight="bold"
                      className="inline mr-1"
                    />
                  )}
                  {isCancelled && (
                    <XCircle size={12} weight="bold" className="inline mr-1" />
                  )}
                  {tripTab.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">{trip.id}</span>
              </div>

              <h3
                className={`text-xl font-bold ${isCancelled ? "text-gray-500 line-through" : "text-gray-900"}`}
              >
                {trip.carName}
              </h3>
            </div>

            <div className="text-right">
              <p
                className={`text-xl font-bold ${isCancelled ? "text-gray-400 line-through" : "text-[#5E9D34]"}`}
              >
                ৳{trip.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{trip.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <CalendarBlank
                size={16}
                weight="duotone"
                className="text-gray-400"
              />
              {trip.startDate} - {trip.endDate}
            </div>
            <div className="flex items-center gap-2">
              <MapPinLine
                size={16}
                weight="duotone"
                className="text-gray-400"
              />
              {trip.location}
            </div>
          </div>

          {"reason" in trip && (
            <p className="text-sm text-red-600 mb-4">
              <Warning size={16} weight="fill" className="inline mr-1" />
              Cancelled: {trip.reason}
            </p>
          )}

          {"rating" in trip && (
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  weight="fill"
                  className={
                    star <= (trip.rating || 0)
                      ? "text-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="text-sm text-gray-500 ml-2">Your rating</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {isUpcoming && (
              <>
                <Button variant="outline" size="sm" onClick={onModify}>
                  Modify
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </>
            )}

            {isCompleted && (
              <>
                <Button size="sm" onClick={onNavigateToSearch}>
                  <ArrowClockwise size={16} weight="bold" className="mr-2" />
                  Book Again
                </Button>
                {!("rating" in trip && trip.rating) && (
                  <Button variant="outline" size="sm">
                    Rate Trip
                  </Button>
                )}
              </>
            )}

            {isCancelled && (
              <Button size="sm" onClick={onNavigateToSearch}>
                <ArrowClockwise size={16} weight="bold" className="mr-2" />
                Rebook
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={onNavigateToDetails}
            >
              View Details{" "}
              <CaretRight size={16} weight="bold" className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
