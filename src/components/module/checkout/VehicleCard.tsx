// components/checkout/VehicleCard.tsx
"use client";

import { CheckCircle2, Calendar, MapPin } from "lucide-react";
import type { CarData } from "@/types/checkout";

interface VehicleCardProps {
  car: CarData;
  rentalLabel: string;
}

export function VehicleCard({ car, rentalLabel }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-[#5E9D34]" />
        Your Vehicle
      </h2>
      <div className="flex gap-4 items-start">
        <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{car.name}</h3>
          <p className="text-sm text-gray-500">{car.type} • 2023</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {rentalLabel}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Dhaka
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
