// components/home/booking/SelectedCarBanner.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CarTypeOption } from "./types";
import { Car, CheckCircle } from "@phosphor-icons/react";

type Props = {
  selectedCar?: CarTypeOption;
};

export function SelectedCarBanner({ selectedCar }: Props) {
  return (
    <AnimatePresence>
      {selectedCar && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-6 p-4 rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 to-transparent backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-primary/20">
                <Car size={24} weight="duotone" className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg leading-tight">
                  {selectedCar.label} Selected
                </p>
                <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="text-primary"
                  />
                  Best for {selectedCar.seats}
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-xl font-bold text-primary flex items-center justify-end gap-1">
                {selectedCar.price}
                <span className="text-sm font-medium text-gray-400">/day</span>
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Includes insurance &amp; tax
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
