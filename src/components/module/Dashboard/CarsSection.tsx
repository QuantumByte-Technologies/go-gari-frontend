/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Car,
  GasPump,
  Gauge,
  Heart,
  Star,
  UsersThree,
} from "@phosphor-icons/react";
import { useGetCarsQuery } from "@/redux/api/carsApi";
import { useRouter } from "next/navigation";

const CITY_FILTERS = ["All", "Dhaka", "Sylhet", "Chittagong", "Cox's Bazar"] as const;

export default function CarsSection() {
  const router = useRouter();
  const [cityFilter, setCityFilter] = useState<string>("All");

  const { data, isLoading, error } = useGetCarsQuery(
    cityFilter === "All" ? {} : { city: cityFilter },
  );

  const cars = data?.results ?? [];

  const onNavigateToDetails = (carId: number) => {
    router.push(`/cars/${carId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="cars-loading">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-2">
          {CITY_FILTERS.map((city) => (
            <div
              key={city}
              className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">Failed to load cars</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Browse Cars by City
        </h2>
      </div>

      {/* City Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CITY_FILTERS.map((city) => (
          <button
            key={city}
            onClick={() => setCityFilter(city)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              cityFilter === city
                ? "bg-[#5E9D34] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-[#5E9D34]"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {cars.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car size={32} weight="duotone" className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No cars available
          </h3>
          <p className="text-gray-500">
            No cars found in {cityFilter}. Try a different city.
          </p>
        </div>
      ) : (
        /* Car Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-56 bg-gray-100">
                {car.primary_image ? (
                  <img
                    src={car.primary_image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car
                      size={48}
                      weight="duotone"
                      className="text-gray-300"
                    />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-[#5E9D34] text-white text-xs font-bold px-3 py-1 rounded-md">
                  {car.city}
                </div>
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                  <Heart
                    size={22}
                    weight="regular"
                    className="text-gray-400"
                  />
                </button>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xl font-bold text-gray-900">
                    {car.name}
                  </h4>
                </div>

                <p className="text-sm text-gray-600 mb-4 capitalize">
                  {car.category}
                </p>

                <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <UsersThree
                      size={18}
                      weight="duotone"
                      className="text-gray-500"
                    />
                    <span>{car.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gauge
                      size={18}
                      weight="duotone"
                      className="text-gray-500"
                    />
                    <span className="capitalize">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GasPump
                      size={18}
                      weight="duotone"
                      className="text-gray-500"
                    />
                    <span className="capitalize">{car.fuel_type}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      ৳{parseFloat(car.rate_per_day).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">/day</span>
                  </div>
                  <Button
                    size="default"
                    onClick={() => onNavigateToDetails(car.id)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
