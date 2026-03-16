// components/car/PickupLocation.tsx
import type { CarDetail } from "@/types/api/cars";
import { MapPinLine } from "@phosphor-icons/react";

interface Props {
  car: CarDetail;
}

export function PickupLocation({ car }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <MapPinLine size={22} weight="duotone" className="text-blue-600" />
        <h3 className="font-bold text-gray-900">Pickup & Drop-off</h3>
      </div>

      <div className="space-y-4">
        {/* Pickup */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Pickup Location
          </p>
          <p className="text-sm font-bold text-gray-900">
            {car.pickup_location_address || "To be confirmed"}
          </p>
          {car.city && (
            <p className="text-xs text-gray-500 mt-0.5">{car.city}</p>
          )}
        </div>

        {/* Drop-off */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Drop-off Location
          </p>
          <p className="text-sm font-bold text-gray-900">
            {car.dropoff_location_address || "Same as pickup"}
          </p>
        </div>
      </div>
    </div>
  );
}
