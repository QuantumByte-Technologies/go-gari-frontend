// components/car/PickupLocation.tsx
import { MapPinLine } from "@phosphor-icons/react";

export function PickupLocation() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <MapPinLine size={22} weight="duotone" className="text-blue-600" />
        <h3 className="font-bold text-gray-900">Pickup Location</h3>
      </div>

      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-blue-50">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Map"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-900 shadow-md">
            <MapPinLine size={14} weight="fill" className="text-red-500" />
            San Francisco
          </div>
        </div>
      </div>

      <p className="text-sm font-bold text-gray-900">
        SFO International Airport
      </p>
      <p className="text-xs text-gray-500">
        Terminal 2, Level 1, Parking Garage
      </p>
    </div>
  );
}
