"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Heart,
  Star,
  UsersThree,
  Gauge,
  GasPump,
} from "@phosphor-icons/react";
import type { CarListItem } from "@/types/api/cars";
import { Button } from "@/components/ui/button";
import { cardIn, EASE_OUT } from "@/lib/motion";
import { formatBDT } from "@/utils/checkout";
import { useRouter } from "next/navigation";

type Props = {
  car: CarListItem;
  viewMode: "grid" | "list";
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

/** Map drive_option enum to a human-readable badge label */
function driveLabel(option: CarListItem["drive_option"]): string {
  switch (option) {
    case "self_drive_only":
      return "Self Drive";
    case "chauffeur_only":
      return "Chauffeur";
    case "both":
      return "Self / Chauffeur";
  }
}

/** Map transmission enum to display text */
function transmissionLabel(t: CarListItem["transmission"]): string {
  return t === "auto" ? "Automatic" : "Manual";
}

/** Map fuel_type enum to display text */
function fuelLabel(f: CarListItem["fuel_type"]): string {
  const map: Record<CarListItem["fuel_type"], string> = {
    petrol: "Petrol",
    diesel: "Diesel",
    octane: "Octane",
    electric: "Electric",
    hybrid: "Hybrid",
    cng: "CNG",
  };
  return map[f];
}

/** Map category to badge color */
function categoryBadge(
  cat: CarListItem["category"],
): { label: string; color: string } | null {
  switch (cat) {
    case "premium":
      return { label: "Premium", color: "bg-amber-600" };
    case "suv":
      return { label: "SUV", color: "bg-blue-700" };
    default:
      return null;
  }
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

export default function CarCard({
  car,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const reduce = useReducedMotion();
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  const imageUrl =
    car.primary_image && !imgError ? car.primary_image : FALLBACK_IMAGE;

  const badge = categoryBadge(car.category);

  return (
    <motion.article
      variants={cardIn}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      onClick={() => router.push(`/search-cars/${car.id}`)}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        <motion.img
          key={imageUrl}
          src={imageUrl}
          alt={car.name}
          className="w-full h-full object-cover object-center"
          initial={{ opacity: 0.7, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          onError={() => setImgError(true)}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {badge && (
            <div
              className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-md`}
            >
              {badge.label}
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-md">
            {driveLabel(car.drive_option)}
          </div>
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          aria-label="Toggle favorite"
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
        >
          <Heart
            size={22}
            weight={isFavorite ? "fill" : "regular"}
            className={isFavorite ? "text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-xl font-bold text-gray-900">{car.name}</h4>
          {car.city && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap ml-2">
              {car.city}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {car.brand} {car.model} &bull; {car.year}
        </p>

        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <UsersThree size={18} weight="duotone" className="text-gray-500" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge size={18} weight="duotone" className="text-gray-500" />
            <span>{transmissionLabel(car.transmission)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GasPump size={18} weight="duotone" className="text-gray-500" />
            <span>{fuelLabel(car.fuel_type)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {formatBDT(car.rate_per_day)}
              </span>
              <span className="text-sm text-gray-600">/day</span>
            </div>
            {car.drive_option !== "self_drive_only" && (
              <p className="text-xs text-gray-500">
                With chauffeur: {formatBDT(car.chauffeur_rate_per_day)}/day
              </p>
            )}
          </div>

          <Button
            onClick={(e) => { e.stopPropagation(); router.push(`/search-cars/${car.id}`); }}
            className="bg-[#65aa36] hover:bg-[#65aa36]/80 cursor-pointer"
          >
            Book Now
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
