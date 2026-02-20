"use client";

import React from "react";
// import type { Car } from "@/types/car";
import { motion } from "framer-motion";
import { Car } from "@/types/car";
import { stagger } from "@/lib/motion";
import CarCard from "./CarCard";
// import { stagger } from "@/lib/motion";
// import CarCard from "./CarCard";

type Props = {
  cars: Car[];
  viewMode: "grid" | "list";
  favorites: number[];
  onToggleFavorite: (id: number) => void;
};

export default function CarGrid({
  cars,
  viewMode,
  favorites,
  onToggleFavorite,

}: Props) {
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
