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

/** Get tomorrow's date as YYYY-MM-DD */
function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function BookingModule() {
  const router = useRouter();

  const [driveType, setDriveType] = useState<DriveType>(DEFAULTS.driveType);
  const [selectedCarType, setSelectedCarType] = useState<string | null>(
    DEFAULTS.carTypeId,
  );
  const [pickupCity, setPickupCity] = useState<string>("");
  const [dropoffCity, setDropoffCity] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("10:00");

  const selectedCar = useMemo(
    () => CAR_TYPES.find((c) => c.id === selectedCarType),
    [selectedCarType],
  );

  const handleNavigateToSearch = useCallback(() => {
    const params = new URLSearchParams();

    if (pickupCity) params.set("city", pickupCity);
    if (pickupDate) params.set("start_date", pickupDate);
    if (returnDate) params.set("end_date", returnDate);

    // Map drive type to backend drive_option
    if (driveType === "self") params.set("drive", "self");
    else if (driveType === "driver") params.set("drive", "chauffeur");

    // Map car type to backend category
    const categoryMap: Record<string, string> = {
      sedan: "economy",
      suv: "suv",
      luxury: "premium",
    };
    if (selectedCarType && categoryMap[selectedCarType]) {
      params.set("category_label", categoryMap[selectedCarType] === "economy" ? "Economy" : categoryMap[selectedCarType] === "suv" ? "SUV" : "Premium");
    }

    const qs = params.toString();
    router.push(`/search-cars${qs ? `?${qs}` : ""}`);
  }, [router, pickupCity, pickupDate, returnDate, driveType, selectedCarType]);

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
                  value={pickupCity}
                  onChange={setPickupCity}
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
                  value={dropoffCity}
                  onChange={setDropoffCity}
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
                  value={pickupDate}
                  onChange={(val) => {
                    setPickupDate(val);
                    // Clear return date if it's now before pickup
                    if (val && returnDate && val >= returnDate) {
                      setReturnDate("");
                    }
                  }}
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
                  value={returnDate}
                  onChange={(val) => setReturnDate(val)}
                  minDate={pickupDate ? new Date(pickupDate + "T00:00:00") : new Date()}
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
                  value={pickupTime}
                  onChange={setPickupTime}
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
