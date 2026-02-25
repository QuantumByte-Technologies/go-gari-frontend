"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Car } from "@phosphor-icons/react";
import { TripsData, TripTabType } from "@/types/dashboard/types";
import TripCard from "./TripCard";

type Props = {
  trips: TripsData;
  onNavigateToSearch: () => void;
  onNavigateToDetails: (carId: number) => void;
  onNavigateToModifyBooking: (bookingId: string) => void;
};

export default function TripsSection({
  trips,
  onNavigateToSearch,
  onNavigateToDetails,
  onNavigateToModifyBooking,
}: Props) {
  const [tripTab, setTripTab] = useState<TripTabType>("upcoming");
  const tabs: TripTabType[] = useMemo(
    () => ["upcoming", "completed", "cancelled"],
    [],
  );

  const list = trips[tripTab];
  const upcomingCount = trips.upcoming.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Trips</h2>
      </div>

      {/* Trip Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setTripTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
              tripTab === tab
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

      {/* Trip Cards */}
      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car size={32} weight="duotone" className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {tripTab} trips
            </h3>
            <p className="text-gray-500 mb-6">
              {tripTab === "upcoming"
                ? "You don't have any upcoming trips scheduled."
                : `No ${tripTab} trips to show.`}
            </p>
            {tripTab === "upcoming" && (
              <Button onClick={onNavigateToSearch}>Book a Car</Button>
            )}
          </div>
        ) : (
          list.map((trip, index) => (
            <TripCard
              key={trip.id}
              trip={trip}
              tripTab={tripTab}
              index={index}
              onNavigateToSearch={onNavigateToSearch}
              onNavigateToDetails={() => onNavigateToDetails(1)} // keep your original behavior
              onModify={() => onNavigateToModifyBooking(trip.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
