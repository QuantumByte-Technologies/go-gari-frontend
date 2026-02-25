// components/car/HeaderSection.tsx
import { CarData } from "@/types/carType";
import { cn } from "@/utils/utils";
import {
  ShareNetwork,
  Heart,
  Lightning,
  UsersThree,
  CheckCircle,
} from "@phosphor-icons/react";
// import type { CarData } from "@/types";

interface Props {
  car: CarData;
  isLiked: boolean;
  onToggleLike: () => void;
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

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Lightning size={18} weight="duotone" className="text-[#5E9D34]" />
            {car.type}
          </span>

          <span className="flex items-center gap-1.5">
            <UsersThree size={18} weight="duotone" className="text-[#5E9D34]" />
            {car.seats} Seats
          </span>

          {car.features.map((feature, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <CheckCircle
                size={18}
                weight="duotone"
                className="text-[#5E9D34]"
              />
              {feature}
            </span>
          ))}
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
