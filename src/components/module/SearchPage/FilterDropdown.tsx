"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretDown, CheckCircle, X } from "@phosphor-icons/react";
import type { FilterKey } from "./FiltersBar";
import { EASE_OUT } from "@/lib/motion";

type Props = {
  filterKey: FilterKey;
  icon: React.ElementType;
  label: string;

  openFilter: FilterKey | null;
  setOpenFilter: (k: FilterKey | null) => void;

  selectedValue: string | null;
  onSelect: (val: string | null) => void;

  options: string[];
};

export default function FilterDropdown({
  filterKey,
  icon: Icon,
  label,
  openFilter,
  setOpenFilter,
  selectedValue,
  onSelect,
  options,
}: Props) {
  const isOpen = openFilter === filterKey;
  const hasValue = !!selectedValue;

  return (
    <div className="relative">
      <button
        onClick={() => setOpenFilter(isOpen ? null : filterKey)}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
          hasValue
            ? "bg-[#5E9D34]/10 border-[#5E9D34]/30 text-[#5E9D34]"
            : isOpen
              ? "bg-white border-[#5E9D34] text-gray-900 shadow-md"
              : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm"
        }`}
      >
        <Icon
          size={18}
          weight="duotone"
          className={hasValue ? "text-[#5E9D34]" : "text-gray-500"}
        />
        <span>{selectedValue || label}</span>

        {hasValue ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelect(null);
            }}
            className="ml-0.5 w-4 h-4 rounded-full bg-[#5E9D34]/20 flex items-center justify-center hover:bg-[#5E9D34]/30"
          >
            <X size={10} weight="bold" className="text-[#5E9D34]" />
          </span>
        ) : (
          <CaretDown
            size={14}
            weight="bold"
            className={`transition-transform ${isOpen ? "rotate-180" : ""} ${hasValue ? "text-[#5E9D34]" : "text-gray-400"}`}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
          >
            <div className="p-1.5">
              {options.map((option) => {
                const isSelected = selectedValue === option;
                return (
                  <button
                    key={option}
                    onClick={() => {
                      onSelect(isSelected ? null : option);
                      setOpenFilter(null);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-[#5E9D34]/10 text-[#5E9D34]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      <CheckCircle
                        size={18}
                        weight="fill"
                        className="text-[#5E9D34]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
