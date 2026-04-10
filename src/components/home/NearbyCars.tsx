"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  UsersThree,
  Gauge,
  GasPump,
  ArrowRight,
} from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { useGetNearbyCarsQuery } from "@/redux/api/carsApi";
import type { CarListItem } from "@/types/api/cars";
import { formatBDT } from "@/utils/checkout";

// Dhaka default coordinates
const DEFAULT_LAT = 23.8103;
const DEFAULT_LNG = 90.4125;
const NEARBY_RADIUS = 20; // km

const TRANSMISSION_LABELS: Record<string, string> = {
  auto: "Automatic",
  manual: "Manual",
};

const FUEL_LABELS: Record<string, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  octane: "Octane",
  hybrid: "Hybrid",
  electric: "Electric",
  cng: "CNG",
};

const CATEGORY_LABELS: Record<string, string> = {
  economy: "ECONOMY",
  premium: "PREMIUM",
  suv: "SUV",
};

const CATEGORY_COLORS: Record<string, string> = {
  economy: "bg-[#5E9D34]",
  premium: "bg-orange-500",
  suv: "bg-blue-500",
};

function CarCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse ${
        featured
          ? "lg:row-span-2 flex flex-col h-full"
          : "flex flex-col sm:flex-row"
      }`}
    >
      <div
        className={`bg-gray-200 ${
          featured
            ? "h-72 lg:h-full min-h-[300px]"
            : "h-48 sm:w-48 sm:h-auto shrink-0"
        }`}
      />
      <div className={`p-${featured ? "8" : "6"} flex-1 space-y-3`}>
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

function FeaturedCarCard({
  car,
  isFavorite,
  onToggleFavorite,
}: {
  car: CarListItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const router = useRouter();
  const categoryLabel = CATEGORY_LABELS[car.category] ?? car.category.toUpperCase();
  const categoryColor = CATEGORY_COLORS[car.category] ?? "bg-[#5E9D34]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => router.push(`/search-cars/${car.id}`)}
      className="lg:row-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="relative h-72 lg:h-full min-h-[300px] bg-gray-100">
        <img
          src={car.primary_image || FALLBACK_IMAGE}
          alt={car.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />

        <div
          className={`absolute top-4 left-4 ${categoryColor} text-white text-xs font-bold px-3 py-1 rounded-md`}
        >
          {categoryLabel}
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={22}
            weight={isFavorite ? "fill" : "regular"}
            className={isFavorite ? "text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      <div className="p-8">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-2xl font-bold text-gray-900">{car.name}</h4>
        </div>

        <p className="text-base text-gray-600 mb-6">
          {FUEL_LABELS[car.fuel_type] ?? car.fuel_type} &bull; {car.year}
        </p>

        <div className="flex items-center gap-6 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <UsersThree size={20} weight="duotone" className="text-gray-500" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={20} weight="duotone" className="text-gray-500" />
            <span>{TRANSMISSION_LABELS[car.transmission] ?? car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <GasPump size={20} weight="duotone" className="text-gray-500" />
            <span>{FUEL_LABELS[car.fuel_type] ?? car.fuel_type}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">
                {formatBDT(car.rate_per_day)}
              </span>
              <span className="text-sm text-gray-600">/day</span>
            </div>
            <p className="text-xs text-gray-500">{car.city}</p>
          </div>

          <Button size="lg" onClick={(e) => { e.stopPropagation(); router.push(`/search-cars/${car.id}`); }}>
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function SmallCarCard({
  car,
  index,
}: {
  car: CarListItem;
  index: number;
}) {
  const router = useRouter();
  const categoryLabel = CATEGORY_LABELS[car.category] ?? car.category.toUpperCase();
  const categoryColor = CATEGORY_COLORS[car.category] ?? "bg-[#5E9D34]";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={() => router.push(`/search-cars/${car.id}`)}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row cursor-pointer"
    >
      <div className="relative h-48 sm:w-48 sm:h-auto bg-gray-100 shrink-0">
        <img
          src={car.primary_image || FALLBACK_IMAGE}
          alt={car.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        <div
          className={`absolute top-4 left-4 ${categoryColor} text-white text-xs font-bold px-3 py-1 rounded-md`}
        >
          {categoryLabel}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-lg font-bold text-gray-900">{car.name}</h4>
          </div>

          <p className="text-xs text-gray-600 mb-3">
            {FUEL_LABELS[car.fuel_type] ?? car.fuel_type} &bull; {car.year}
          </p>

          <div className="flex items-center gap-3 mb-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <UsersThree
                size={16}
                weight="duotone"
                className="text-gray-500"
              />
              <span>{car.seats}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge size={16} weight="duotone" className="text-gray-500" />
              <span>{TRANSMISSION_LABELS[car.transmission] ?? car.transmission}</span>
            </div>
            <div className="flex items-center gap-1">
              <GasPump size={16} weight="duotone" className="text-gray-500" />
              <span>{FUEL_LABELS[car.fuel_type] ?? car.fuel_type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">
              {formatBDT(car.rate_per_day)}
            </span>
            <span className="text-xs text-gray-600">/day</span>
          </div>

          <Button size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/search-cars/${car.id}`); }}>
            Book
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <p className="text-lg text-gray-500 mb-4">
        No cars available in your area right now.
      </p>
      <Button asChild>
        <Link href="/search-cars">Browse All Cars</Link>
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-16">
      <p className="text-lg text-gray-500 mb-4">
        We couldn&apos;t load nearby cars. Please try again.
      </p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  );
}

export function NearbyCars() {
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [favorites, setFavorites] = useState<number[]>([]);

  // Attempt to get user's location
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Permission denied or error — keep defaults
        },
        { timeout: 5000, maximumAge: 300000 },
      );
    }
  }, []);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetNearbyCarsQuery({
    lat: coords.lat,
    lng: coords.lng,
    radius: NEARBY_RADIUS,
  });

  const cars = data?.results ?? [];

  const toggleFavorite = (carId: number) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId],
    );
  };

  // Take up to 3 cars for the featured layout
  const featuredCar = cars[0];
  const otherCars = cars.slice(1, 3);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#5E9D34] font-semibold tracking-wide uppercase text-sm mb-2 inline-block border-b-2 border-orange-400 pb-1"
            >
              Available Now
            </motion.h2>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Cars near you
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed max-w-2xl"
            >
              Browse verified cars available in your area. Each vehicle is
              inspected, insured, and ready for your journey.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/search-cars"
              className="hidden md:flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors group"
            >
              View All Cars
              <ArrowRight
                size={20}
                weight="bold"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CarCardSkeleton featured />
            <div className="flex flex-col gap-8">
              <CarCardSkeleton />
              <CarCardSkeleton />
            </div>
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : cars.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Car */}
            {featuredCar && (
              <FeaturedCarCard
                car={featuredCar}
                isFavorite={favorites.includes(featuredCar.id)}
                onToggleFavorite={() => toggleFavorite(featuredCar.id)}
              />
            )}

            {/* Other Cars */}
            {otherCars.length > 0 && (
              <div className="flex flex-col gap-8">
                {otherCars.map((car, index) => (
                  <SmallCarCard key={car.id} car={car} index={index} />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/search-cars"
            className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors"
          >
            View All Cars <ArrowRight size={20} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
