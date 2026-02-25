// components/home/booking/CarTypeGrid.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CarTypeOption } from "./types";
import { Car, CheckCircle, Users } from "@phosphor-icons/react";

type Props = {
  value: string | null;
  onChange: (id: string) => void;
  options: CarTypeOption[];
};

export function CarTypeGrid({ value, onChange, options }: Props) {
  return (
    <div className="px-6 md:px-10 pb-8">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
        Select Vehicle Type
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {options.map((car) => {
          const isSelected = value === car.id;
          return (
            <motion.button
              key={car.id}
              type="button"
              onClick={() => onChange(car.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={[
                "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 h-full min-h-[100px]",
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-gray-100 bg-white text-gray-600 hover:border-primary/30 hover:bg-gray-50 hover:shadow-md",
              ].join(" ")}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 text-primary">
                  <CheckCircle size={16} weight="fill" />
                </div>
              )}

              <div
                className={[
                  "mb-2 p-2 rounded-full",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-100 text-gray-400",
                ].join(" ")}
              >
                <Car size={24} weight={isSelected ? "fill" : "duotone"} />
              </div>

              <span
                className={[
                  "text-sm font-bold mb-0.5",
                  isSelected ? "text-gray-900" : "text-gray-700",
                ].join(" ")}
              >
                {car.label}
              </span>

              <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Users size={12} weight="duotone" />
                  {car.seats.replace(" seats", "")}
                </span>
                <span className="w-0.5 h-2.5 bg-gray-300 rounded-full" />
                <span className="text-primary font-bold">{car.price}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
