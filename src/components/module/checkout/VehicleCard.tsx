"use client";

import { CheckCircle2, Calendar, MapPin, Car } from "lucide-react";
import type { BookingDraft } from "@/utils/checkout";

interface VehicleCardProps {
  draft: BookingDraft;
}

export function VehicleCard({ draft }: VehicleCardProps) {
  const numDays = draft.pricing?.numDays ?? "—";
  const driveLabel =
    draft.driveType === "self_drive" ? "Self Drive" : "With Chauffeur";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-[#65AA36]" />
        Your Vehicle
      </h2>
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Car className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{draft.carName}</h3>
          <p className="text-sm text-gray-500">{driveLabel}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {numDays} day
              {typeof numDays === "number" && numDays > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {draft.startDate} to{" "}
              {draft.endDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
