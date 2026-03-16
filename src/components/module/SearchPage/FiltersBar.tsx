"use client";

import React, { useEffect, useRef } from "react";
import {
  SquaresFour,
  ListBullets,
  Money,
  Armchair,
  GearSix,
  Drop,
  Car,
  X,
} from "@phosphor-icons/react";
import FilterDropdown from "./FilterDropdown";

export type FilterKey = "price" | "seats" | "transmission" | "fuel" | "carType";

type Props = {
  openFilter: FilterKey | null;
  setOpenFilter: (k: FilterKey | null) => void;

  selectedPrice: string | null;
  setSelectedPrice: (v: string | null) => void;

  selectedSeats: string | null;
  setSelectedSeats: (v: string | null) => void;

  selectedTransmission: string | null;
  setSelectedTransmission: (v: string | null) => void;

  selectedFuel: string | null;
  setSelectedFuel: (v: string | null) => void;

  selectedCarType: string | null;
  setSelectedCarType: (v: string | null) => void;

  activeFilterCount: number;
  onClearAll: () => void;

  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;

  options: {
    PRICE_RANGES: string[];
    SEAT_OPTIONS: string[];
    TRANSMISSION_OPTIONS: string[];
    FUEL_OPTIONS: string[];
    CAR_TYPE_OPTIONS: string[];
  };
};

export default function FiltersBar(props: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        props.setOpenFilter(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [props]);

  return (
    <div
      ref={ref}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
    >
      <div className="flex items-center gap-2.5 flex-wrap">
        <FilterDropdown
          filterKey="price"
          icon={Money}
          label="Price Range"
          openFilter={props.openFilter}
          setOpenFilter={props.setOpenFilter}
          selectedValue={props.selectedPrice}
          onSelect={props.setSelectedPrice}
          options={props.options.PRICE_RANGES}
        />
        <FilterDropdown
          filterKey="seats"
          icon={Armchair}
          label="Seats"
          openFilter={props.openFilter}
          setOpenFilter={props.setOpenFilter}
          selectedValue={props.selectedSeats}
          onSelect={props.setSelectedSeats}
          options={props.options.SEAT_OPTIONS}
        />
        <FilterDropdown
          filterKey="transmission"
          icon={GearSix}
          label="Transmission"
          openFilter={props.openFilter}
          setOpenFilter={props.setOpenFilter}
          selectedValue={props.selectedTransmission}
          onSelect={props.setSelectedTransmission}
          options={props.options.TRANSMISSION_OPTIONS}
        />
        <FilterDropdown
          filterKey="fuel"
          icon={Drop}
          label="Fuel Type"
          openFilter={props.openFilter}
          setOpenFilter={props.setOpenFilter}
          selectedValue={props.selectedFuel}
          onSelect={props.setSelectedFuel}
          options={props.options.FUEL_OPTIONS}
        />
        <FilterDropdown
          filterKey="carType"
          icon={Car}
          label="Car Type"
          openFilter={props.openFilter}
          setOpenFilter={props.setOpenFilter}
          selectedValue={props.selectedCarType}
          onSelect={props.setSelectedCarType}
          options={props.options.CAR_TYPE_OPTIONS}
        />

        {props.activeFilterCount > 0 && (
          <button
            onClick={props.onClearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={14} weight="bold" />
            Clear all ({props.activeFilterCount})
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => props.setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              props.viewMode === "grid"
                ? "bg-[#5E9D34] text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <SquaresFour size={18} weight="duotone" />
          </button>
          <button
            onClick={() => props.setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              props.viewMode === "list"
                ? "bg-[#5E9D34] text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <ListBullets size={18} weight="duotone" />
          </button>
        </div>
      </div>
    </div>
  );
}
