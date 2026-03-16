// components/car/HeaderSection.tsx
import type { CarDetail } from "@/types/api/cars";
import { cn } from "@/lib/utils";
import {
  ShareNetwork,
  Heart,
  Lightning,
  UsersThree,
  GearSix,
  GasPump,
} from "@phosphor-icons/react";

interface Props {
  car: CarDetail;
  isLiked: boolean;
  onToggleLike: () => void;
}

/** Human-readable category label */
function categoryLabel(cat: CarDetail["category"]): string {
  const map: Record<CarDetail["category"], string> = {
    economy: "Economy",
    premium: "Premium",
    suv: "SUV",
  };
  return map[cat];
}

/** Human-readable transmission label */
function transmissionLabel(t: CarDetail["transmission"]): string {
  return t === "auto" ? "Automatic" : "Manual";
}

/** Human-readable fuel type label */
function fuelLabel(f: CarDetail["fuel_type"]): string {
  const map: Record<CarDetail["fuel_type"], string> = {
    petrol: "Petrol",
    diesel: "Diesel",
    electric: "Electric",
    hybrid: "Hybrid",
    cng: "CNG",
  };
  return map[f];
}

export function CarHeader({ car, isLiked, onToggleLike }: Props) {
  const handleShare = () => {
    if (typeof window !== "undefined" && window?.location?.href) {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          {car.name}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {car.brand} {car.model} &bull; {car.year}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Lightning size={18} weight="duotone" className="text-[#5E9D34]" />
            {categoryLabel(car.category)}
          </span>

          <span className="flex items-center gap-1.5">
            <UsersThree size={18} weight="duotone" className="text-[#5E9D34]" />
            {car.seats} Seats
          </span>

          <span className="flex items-center gap-1.5">
            <GearSix size={18} weight="duotone" className="text-[#5E9D34]" />
            {transmissionLabel(car.transmission)}
          </span>

          <span className="flex items-center gap-1.5">
            <GasPump size={18} weight="duotone" className="text-[#5E9D34]" />
            {fuelLabel(car.fuel_type)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ShareNetwork size={18} weight="duotone" />
          Share
        </button>

        <button
          type="button"
          onClick={onToggleLike}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            isLiked
              ? "border-red-100 bg-red-50 text-red-500"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
          )}
        >
          <Heart size={18} weight={isLiked ? "fill" : "duotone"} />
          Save
        </button>
      </div>
    </div>
  );
}
