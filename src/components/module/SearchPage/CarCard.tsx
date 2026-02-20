"use client";

import React, { useMemo, useState } from "react";
// import type { Car } from "@/types/car";
import { motion, useReducedMotion } from "framer-motion";
import {
  CaretLeft,
  CaretRight,
  Heart,
  Star,
  UsersThree,
  Gauge,
  GasPump,
} from "@phosphor-icons/react";
import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { cardIn, EASE_OUT } from "@/lib/motion";
// import { cardIn, EASE_OUT } from "@/lib/motion";

// // ✅ change this to your actual Button path
// import { Button } from "@/components/ui/button";

type Props = {
  car: Car;
  viewMode: "grid" | "list";
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function CarCard({ car, isFavorite, onToggleFavorite }: Props) {
  const reduce = useReducedMotion();
  const [currentImg, setCurrentImg] = useState(0);

  const images = useMemo(
    () => (car.images?.length ? car.images : [car.image]),
    [car],
  );

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((p) => (p + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((p) => (p - 1 + images.length) % images.length);
  };

  return (
    <motion.article
      variants={cardIn}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        <motion.img
          key={images[currentImg]}
          src={images[currentImg]}
          alt={car.name}
          className="w-full h-full object-cover object-center"
          initial={{ opacity: 0.7, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Slider buttons */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={prevImg}
              className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white shadow-sm hover:scale-105 transition-transform"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <button
              onClick={nextImg}
              className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white shadow-sm hover:scale-105 transition-transform"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentImg ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {car.badge && (
            <div
              className={`${car.badgeColor || "bg-gray-900"} text-white text-xs font-bold px-3 py-1 rounded-md`}
            >
              {car.badge}
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-md">
            {car.driveType}
          </div>
        </div>

        {/* Favorite */}
        <button
          onClick={onToggleFavorite}
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
          <div className="flex items-center gap-1">
            <Star size={18} weight="fill" className="text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900">
              {car.rating}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {car.type} • {car.year}
        </p>

        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <UsersThree size={18} weight="duotone" className="text-gray-500" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge size={18} weight="duotone" className="text-gray-500" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GasPump size={18} weight="duotone" className="text-gray-500" />
            <span>{car.mileage}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                ${car.price}
              </span>
              <span className="text-sm text-gray-600">/day</span>
            </div>
            <p className="text-xs text-gray-500">
              Total ${car.total} (inc. taxes)
            </p>
          </div>

          <Button>Book Now</Button>
        </div>
      </div>
    </motion.article>
  );
}
