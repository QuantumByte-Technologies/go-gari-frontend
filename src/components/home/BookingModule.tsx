// components/home/booking/BookingModule.tsx
"use client";

import React, { useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CalendarBlank,
  Clock,
  MagnifyingGlass,
  MapPinLine,
} from "@phosphor-icons/react";
import { DriveType } from "../module/Hero/types";
import {
  CAR_TYPES,
  CITY_OPTIONS,
  DEFAULTS,
  DRIVE_TYPES,
} from "../module/Hero/constants";
import { DriveTypeToggle } from "../module/Hero/DriveTypeToggle";
import { CarTypeGrid } from "../module/Hero/CarTypeGrid";
import { FieldSelect } from "../module/Hero/FieldSelect";
import { FieldInput } from "../module/Hero/FieldInput";
import { SelectedCarBanner } from "../module/Hero/SelectedCarBanner";

// import { DriveTypeToggle } from "./DriveTypeToggle";
// import { CarTypeGrid } from "./CarTypeGrid";
// import { FieldSelect } from "./FieldSelect";
// import { FieldInput } from "./FieldInput";
// import { SelectedCarBanner } from "./SelectedCarBanner";

export function BookingModule() {
  const router = useRouter();

  const [driveType, setDriveType] = useState<DriveType>(DEFAULTS.driveType);
  const [selectedCarType, setSelectedCarType] = useState<string | null>(
    DEFAULTS.carTypeId,
  );

  const selectedCar = useMemo(
    () => CAR_TYPES.find((c) => c.id === selectedCarType),
    [selectedCarType],
  );

  const handleNavigateToSearch = useCallback(() => {
    router.push("/search-cars"); // change to your real route
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative w-full"
    >
      <div className="bg-white max-w-6xl mx-auto rounded-3xl shadow-2xl shadow-black/20 overflow-hidden border border-white/20 backdrop-blur-sm">
        <div className="h-1.5 w-full bg-linear-to-r from-primary via-orange-500 to-primary" />

        {/* Top: Drive type + car type */}
        <div className="bg-white border-b border-gray-100 relative z-10">
          <DriveTypeToggle
            value={driveType}
            onChange={setDriveType}
            options={DRIVE_TYPES}
          />
          <CarTypeGrid
            value={selectedCarType}
            onChange={setSelectedCarType}
            options={CAR_TYPES}
          />
        </div>

        {/* Fields */}
        <div className="p-6 sm:p-8 md:p-10 bg-[#fafafa] relative">
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={driveType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-end"
              >
                <FieldSelect
                  label={
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <MapPinLine
                        size={16}
                        weight="duotone"
                        className="text-primary"
                      />
                      Pickup City
                    </label>
                  }
                  placeholder="Select pickup city"
                  options={CITY_OPTIONS}
                />

                <FieldSelect
                  label={
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <MapPinLine
                        size={16}
                        weight="duotone"
                        className="text-primary"
                      />
                      Drop-off City
                    </label>
                  }
                  placeholder="Select drop-off city"
                  options={CITY_OPTIONS}
                />

                <FieldInput
                  label={
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <CalendarBlank
                        size={16}
                        weight="duotone"
                        className="text-primary"
                      />
                      Pickup Date
                    </label>
                  }
                  type="date"
                />

                <FieldInput
                  label={
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <CalendarBlank
                        size={16}
                        weight="duotone"
                        className="text-primary"
                      />
                      Return Date
                    </label>
                  }
                  type="date"
                />

                <FieldInput
                  label={
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <Clock
                        size={16}
                        weight="duotone"
                        className="text-primary"
                      />
                      Pickup Time
                    </label>
                  }
                  type="time"
                  defaultValue="10:00"
                />

                {/* Search */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-primary rounded-2xl blur opacity-20 animate-pulse" />
                  <button
                    onClick={handleNavigateToSearch}
                    className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 text-base font-bold relative z-10 border-t border-white/20 text-primary-foreground flex items-center justify-center gap-2 hover:opacity-95 transition-opacity bg-[#66aa3e]"
                  >
                    <MagnifyingGlass size={24} weight="bold" />
                    Find Cars
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <SelectedCarBanner selectedCar={selectedCar} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
