/* eslint-disable @typescript-eslint/no-explicit-any */
// components/checkout/RentalPeriod.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import type { RentalMode } from "@/types/checkout";

interface RentalPeriodProps {
  rentalMode: RentalMode;
  daysCount: number;
  weeksCount: number;
  monthlyStart: string;
  monthlyEnd: string;
  totalDays: number;
  onRentalModeChange: (mode: RentalMode) => void;
  onDaysChange: (value: number) => void;
  onWeeksChange: (value: number) => void;
  onMonthlyStartChange: (value: string) => void;
  onMonthlyEndChange: (value: string) => void;
  pickupTime: string;
  dropoffTime: string;
  onPickupTimeChange: (value: string) => void;
  onDropoffTimeChange: (value: string) => void;
}

export function RentalPeriod({
  rentalMode,
  daysCount,
  weeksCount,
  monthlyStart,
  monthlyEnd,
  totalDays,
  onRentalModeChange,
  onDaysChange,
  onWeeksChange,
  onMonthlyStartChange,
  onMonthlyEndChange,
  pickupTime,
  dropoffTime,
  onPickupTimeChange,
  onDropoffTimeChange,
}: RentalPeriodProps) {
  const modes: { id: RentalMode; label: string }[] = [
    { id: "days", label: "Days" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ];

  return (
    <div className="mb-6 pb-6 border-b border-gray-100">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Rental Period
      </label>

      {/* Mode Toggle */}
      <div className="relative bg-gray-100 rounded-xl p-1 flex mb-4">
        <motion.div
          className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm"
          animate={{
            left:
              rentalMode === "days"
                ? "4px"
                : rentalMode === "weekly"
                  ? "calc(33.33% + 1px)"
                  : "calc(66.66% - 2px)",
            width: "calc(33.33% - 5px)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onRentalModeChange(mode.id)}
            className={`relative z-10 flex-1 py-2 rounded-lg text-xs font-semibold transition-colors text-center ${
              rentalMode === mode.id ? "text-[#5E9D34]" : "text-gray-500"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Input based on mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={rentalMode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {rentalMode === "days" && (
            <DaysInput daysCount={daysCount} onChange={onDaysChange} />
          )}
          {rentalMode === "weekly" && (
            <WeeksInput weeksCount={weeksCount} onChange={onWeeksChange} />
          )}
          {rentalMode === "monthly" && (
            <MonthlyInput
              start={monthlyStart}
              end={monthlyEnd}
              totalDays={totalDays}
              onStartChange={onMonthlyStartChange}
              onEndChange={onMonthlyEndChange}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pickup & Drop-off Time */}
      <TimeInputs
        pickupTime={pickupTime}
        dropoffTime={dropoffTime}
        onPickupChange={onPickupTimeChange}
        onDropoffChange={onDropoffTimeChange}
      />
    </div>
  );
}

// Sub-components
function DaysInput({ daysCount, onChange }: any) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="1"
        max="365"
        value={daysCount}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#5E9D34] focus:border-transparent outline-none"
      />
      <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-2.5 rounded-lg border border-gray-200">
        days
      </span>
    </div>
  );
}

function WeeksInput({ weeksCount, onChange }: any) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max="52"
          value={weeksCount}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#5E9D34] focus:border-transparent outline-none"
        />
        <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-2.5 rounded-lg border border-gray-200">
          weeks
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        = {weeksCount * 7} days total
      </p>
    </div>
  );
}

function MonthlyInput({
  start,
  end,
  totalDays,
  onStartChange,
  onEndChange,
}: any) {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Start Date</label>
        <input
          type="date"
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#5E9D34] focus:border-transparent outline-none"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">End Date</label>
        <input
          type="date"
          value={end}
          min={start || undefined}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#5E9D34] focus:border-transparent outline-none"
        />
      </div>
      {start && end && (
        <p className="text-xs font-semibold text-[#5E9D34]">
          {totalDays} days selected
        </p>
      )}
    </div>
  );
}

function TimeInputs({
  pickupTime,
  dropoffTime,
  onPickupChange,
  onDropoffChange,
}: any) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Pickup Time
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => onPickupChange(e.target.value)}
            className="w-full h-10 pl-9 pr-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#5E9D34] focus:border-transparent outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Drop-off Time
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="time"
            value={dropoffTime}
            onChange={(e) => onDropoffChange(e.target.value)}
            className="w-full h-10 pl-9 pr-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#5E9D34] focus:border-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
}
