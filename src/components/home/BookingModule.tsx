"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MapPinLine,
  CalendarBlank,
  Clock,
  MagnifyingGlass,
  Car,
  UserCircle,
  CaretDown,
  AirplaneTilt,
  CheckCircle,
  Users,
} from "@phosphor-icons/react";
import { Button } from "../ui/button";

const carTypes = [
  { id: "sedan", label: "Sedan", seats: "4 seats", price: "৳3,500", icon: Car },
  { id: "suv", label: "SUV", seats: "7 seats", price: "৳5,500", icon: Car },
  {
    id: "hatchback",
    label: "Hatchback",
    seats: "4 seats",
    price: "৳2,500",
    icon: Car,
  },
  {
    id: "luxury",
    label: "Luxury",
    seats: "4 seats",
    price: "৳12,000",
    icon: Car,
  },
  {
    id: "microbus",
    label: "Microbus",
    seats: "10+ seats",
    price: "৳7,500",
    icon: Car,
  },
];

const driveTypes = [
  { id: "self" as const, label: "Self Drive", icon: Car },
  { id: "driver" as const, label: "With Driver", icon: UserCircle },
  { id: "airport" as const, label: "Airport Shuttle", icon: AirplaneTilt },
];

export function BookingModule() {
  const router = useRouter();

  const [driveType, setDriveType] = useState<"self" | "driver" | "airport">(
    "self",
  );
  const [selectedCarType, setSelectedCarType] = useState<string | null>(
    "sedan",
  );

  const selectedCar = carTypes.find((c) => c.id === selectedCarType);

  const handleNavigateToSearch = () => {
    router.push("/search-cars"); // change to your actual search page route
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative w-full"
    >
      <div className="bg-white max-w-6xl mx-auto rounded-3xl shadow-2xl shadow-black/20 overflow-hidden border border-white/20 backdrop-blur-sm">
        {/* Top Gradient Accent */}
        <div className="h-1.5 w-full bg-linear-to-r from-[#5E9D34] via-orange-500 to-[#5E9D34]" />

        {/* Top Section - Drive Type & Car Type Selection */}
        <div className="bg-white border-b border-gray-100 relative z-10">
          {/* Drive Type */}
          <div className="px-6 md:px-10 pt-8 pb-6">
            <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 relative shadow-inner border border-gray-100">
              {driveTypes.map((type) => {
                const Icon = type.icon;
                const isActive = driveType === type.id;

                return (
                  <Button
                    key={type.id}
                    onClick={() => setDriveType(type.id)}
                    className="relative z-10 flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 text-sm md:text-base font-bold whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#5E9D34]"
                    type="button"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="driveTypeIndicator"
                        className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      >
                        <div className="absolute inset-0 bg-[#5E9D34]/5 rounded-xl" />
                      </motion.div>
                    )}

                    <span className="relative z-10 flex items-center gap-2.5">
                      <Icon
                        size={22}
                        weight={isActive ? "fill" : "duotone"}
                        className={`transition-colors duration-200 ${
                          isActive ? "text-[#5E9D34]" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`transition-colors duration-200 ${
                          isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {type.label}
                      </span>
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Car Type */}
          <div className="px-6 md:px-10 pb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
              Select Vehicle Type
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {carTypes.map((car) => {
                const isSelected = selectedCarType === car.id;
                return (
                  <motion.button
                    key={car.id}
                    onClick={() => setSelectedCarType(car.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 h-full min-h-25
                      ${
                        isSelected
                          ? "border-[#5E9D34] bg-[#5E9D34]/5 shadow-lg shadow-[#5E9D34]/10"
                          : "border-gray-100 bg-white text-gray-600 hover:border-[#5E9D34]/30 hover:bg-gray-50 hover:shadow-md"
                      }
                    `}
                    type="button"
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-[#5E9D34]">
                        <CheckCircle size={16} weight="fill" />
                      </div>
                    )}

                    <div
                      className={`mb-2 p-2 rounded-full ${
                        isSelected
                          ? "bg-[#5E9D34]/10 text-[#5E9D34]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Car size={24} weight={isSelected ? "fill" : "duotone"} />
                    </div>

                    <span
                      className={`text-sm font-bold mb-0.5 ${isSelected ? "text-gray-900" : "text-gray-700"}`}
                    >
                      {car.label}
                    </span>

                    <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <Users size={12} weight="duotone" />
                        {car.seats.replace(" seats", "")}
                      </span>
                      <span className="w-0.5 h-2.5 bg-gray-300 rounded-full" />
                      <span className="text-[#5E9D34] font-bold">
                        {car.price}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search Fields Area */}
        <div className="p-8 md:p-10 bg-[#fafafa] relative">
          {/* Dotted Pattern Background */}
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-end"
              >
                {/* Pickup City */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">
                    <MapPinLine
                      size={16}
                      weight="duotone"
                      className="text-[#5E9D34]"
                    />
                    Pickup City
                  </label>
                  <div className="relative group">
                    <select className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5E9D34] focus:border-[#5E9D34] outline-none text-base font-medium appearance-none cursor-pointer transition-all h-15 shadow-sm hover:border-gray-300 group-hover:shadow-md">
                      <option>Select pickup city</option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                      <option>Sylhet</option>
                      <option>Cox&apos;s Bazar</option>
                      <option>Rajshahi</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-40%]">
                      <CaretDown
                        size={20}
                        weight="bold"
                        className="text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Drop-off City */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">
                    <MapPinLine
                      size={16}
                      weight="duotone"
                      className="text-[#5E9D34]"
                    />
                    Drop-off City
                  </label>
                  <div className="relative group">
                    <select className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5E9D34] focus:border-[#5E9D34] outline-none text-base font-medium appearance-none cursor-pointer transition-all h-15 shadow-sm hover:border-gray-300 group-hover:shadow-md">
                      <option>Select drop-off city</option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                      <option>Sylhet</option>
                      <option>Cox&apos;s Bazar</option>
                      <option>Rajshahi</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-40%]">
                      <CaretDown
                        size={20}
                        weight="bold"
                        className="text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">
                    <CalendarBlank
                      size={16}
                      weight="duotone"
                      className="text-[#5E9D34]"
                    />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5E9D34] focus:border-[#5E9D34] outline-none text-base font-medium transition-all h-15 shadow-sm hover:border-gray-300"
                  />
                </div>

                {/* Return Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">
                    <CalendarBlank
                      size={16}
                      weight="duotone"
                      className="text-[#5E9D34]"
                    />
                    Return Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5E9D34] focus:border-[#5E9D34] outline-none text-base font-medium transition-all h-15 shadow-sm hover:border-gray-300"
                  />
                </div>

                {/* Pickup Time */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">
                    <Clock
                      size={16}
                      weight="duotone"
                      className="text-[#5E9D34]"
                    />
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    defaultValue="10:00"
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5E9D34] focus:border-[#5E9D34] outline-none text-base font-medium transition-all h-15 shadow-sm hover:border-gray-300"
                  />
                </div>

                {/* Search Button - FIXED: Using native button instead of Button component */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-[#5E9D34] rounded-2xl blur opacity-20 animate-pulse" />
                  <button
                    onClick={handleNavigateToSearch}
                    className="w-full h-15 rounded-2xl shadow-xl shadow-[#5E9D34]/20 text-base font-bold relative z-10 border-t border-white/20 bg-[#5E9D34] text-white flex items-center justify-center gap-2 hover:bg-[#4f8329] transition-colors cursor-pointer"
                  >
                    <MagnifyingGlass size={24} weight="bold" />
                    Find Cars
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Selected Car Info Banner */}
            <AnimatePresence>
              {selectedCar && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 rounded-2xl border border-[#5E9D34]/20 bg-linear-to-r from-[#5E9D34]/10 to-transparent backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-[#5E9D34]/20">
                        <Car
                          size={24}
                          weight="duotone"
                          className="text-[#5E9D34]"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg leading-tight">
                          {selectedCar.label} Selected
                        </p>
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                          <CheckCircle
                            size={14}
                            weight="fill"
                            className="text-[#5E9D34]"
                          />
                          Best for {selectedCar.seats}
                        </p>
                      </div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <p className="text-xl font-bold text-[#5E9D34] flex items-center justify-end gap-1">
                        {selectedCar.price}
                        <span className="text-sm font-medium text-gray-400">
                          /day
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Includes insurance &amp; tax
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
