"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  UsersThree,
  Gauge,
  GasPump,
  Star,
  ArrowRight,
} from "@phosphor-icons/react";
import { Button } from "../ui/button";

const cars = [
  {
    id: 1,
    name: "Tesla Model 3 Long Range",
    type: "Electric",
    year: 2023,
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "TOP RATED",
    badgeColor: "bg-[#5E9D34]",
    rating: 4.9,
    seats: 5,
    transmission: "Auto",
    mileage: "358 mi",
    price: 89,
    total: 623,
  },
  {
    id: 2,
    name: "Range Rover Sport",
    type: "Petrol",
    year: 2022,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "CHAUFFEUR READY",
    badgeColor: "bg-orange-500",
    rating: 4.8,
    seats: 7,
    transmission: "Auto",
    mileage: "21 MPG",
    price: 145,
    total: 1015,
  },
  {
    id: 3,
    name: "Toyota Corolla",
    type: "Hybrid",
    year: 2023,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "BEST VALUE",
    badgeColor: "bg-[#5E9D34]",
    rating: 4.7,
    seats: 5,
    transmission: "Auto",
    mileage: "52 MPG",
    price: 42,
    total: 294,
  },
] as const;

export interface NearbyCarsProps {
  onNavigateToDetails?: (carId: number) => void;
}

export function NearbyCars({ onNavigateToDetails }: NearbyCarsProps) {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (carId: number) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId],
    );
  };

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

          <motion.button
            type="button"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors group"
          >
            View All Cars
            <ArrowRight
              size={20}
              weight="bold"
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.button>
        </div>

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Car */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:row-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
          >
            <div className="relative h-72 lg:h-full min-h-75 bg-gray-100">
              <Image
                src={cars[0].image}
                alt={cars[0].name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />

              <div
                className={`absolute top-4 left-4 ${cars[0].badgeColor} text-white text-xs font-bold px-3 py-1 rounded-md`}
              >
                {cars[0].badge}
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite(cars[0].id)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                aria-label={
                  favorites.includes(cars[0].id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Heart
                  size={22}
                  weight={favorites.includes(cars[0].id) ? "fill" : "regular"}
                  className={
                    favorites.includes(cars[0].id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-2xl font-bold text-gray-900">
                  {cars[0].name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star size={20} weight="fill" className="text-orange-400" />
                  <span className="text-base font-semibold text-gray-900">
                    {cars[0].rating}
                  </span>
                </div>
              </div>

              <p className="text-base text-gray-600 mb-6">
                {cars[0].type} • {cars[0].year}
              </p>

              <div className="flex items-center gap-6 mb-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <UsersThree
                    size={20}
                    weight="duotone"
                    className="text-gray-500"
                  />
                  <span>{cars[0].seats} Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge size={20} weight="duotone" className="text-gray-500" />
                  <span>{cars[0].transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GasPump
                    size={20}
                    weight="duotone"
                    className="text-gray-500"
                  />
                  <span>{cars[0].mileage}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ${cars[0].price}
                    </span>
                    <span className="text-sm text-gray-600">/day</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Total ${cars[0].total} (inc. taxes)
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => onNavigateToDetails?.(cars[0].id)}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Other Cars */}
          <div className="flex flex-col gap-8">
            {cars.slice(1).map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row"
              >
                <div className="relative h-48 sm:w-48 sm:h-auto bg-gray-100 shrink-0">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    className="object-cover"
                  />
                  <div
                    className={`absolute top-4 left-4 ${car.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-md`}
                  >
                    {car.badge}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-lg font-bold text-gray-900">
                        {car.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          weight="fill"
                          className="text-orange-400"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          {car.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-3">
                      {car.type} • {car.year}
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
                        <Gauge
                          size={16}
                          weight="duotone"
                          className="text-gray-500"
                        />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GasPump
                          size={16}
                          weight="duotone"
                          className="text-gray-500"
                        />
                        <span>{car.mileage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-gray-900">
                        ${car.price}
                      </span>
                      <span className="text-xs text-gray-600">/day</span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => onNavigateToDetails?.(car.id)}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors"
          >
            View All Cars <ArrowRight size={20} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
}
