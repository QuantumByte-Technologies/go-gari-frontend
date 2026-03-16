"use client";

import React from "react";
import type { CarListItem } from "@/types/api/cars";
import { motion } from "framer-motion";
import { stagger } from "@/lib/motion";
import CarCard from "./CarCard";
import { AlertCircle, RefreshCw } from "lucide-react";

type Props = {
  cars: CarListItem[];
  viewMode: "grid" | "list";
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

function CarGridSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  return (
    <div
      className={`grid gap-6 mb-12 ${
        viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
        >
          <div className="h-56 bg-gray-200" />
          <div className="p-6 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-4 mt-4">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-10 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CarGrid({
  cars,
  viewMode,
  favorites,
  onToggleFavorite,
  isLoading,
  isError,
  onRetry,
}: Props) {
  if (isLoading) {
    return <CarGridSkeleton viewMode={viewMode} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load cars
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Something went wrong while fetching available cars. Please try again.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-[#65aa36] text-white rounded-xl hover:bg-[#5a982f] transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No cars found
        </h3>
        <p className="text-sm text-gray-600">
          Try adjusting your filters or search for a different location.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className={`grid gap-6 mb-12 ${
        viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          viewMode={viewMode}
          isFavorite={favorites.includes(car.id)}
          onToggleFavorite={() => onToggleFavorite(car.id)}
        />
      ))}
    </motion.div>
  );
}
