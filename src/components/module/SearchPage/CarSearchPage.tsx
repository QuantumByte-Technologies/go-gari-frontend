"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Car, FilterKey, PriceRange } from "@/types/car";
import { pageIn } from "@/lib/motion";
import SearchHeader from "./SearchHeader";
import FiltersBar from "./FiltersBar";
import ResultsHeader from "./ResultsHeader";
import CarGrid from "./CarGrid";
import Pagination from "@/components/common/Car-Pagination";

const PRICE_RANGES: PriceRange[] = [
  { label: "Under $50/day", min: 0, max: 50 },
  { label: "$50 – $100/day", min: 50, max: 100 },
  { label: "$100 – $200/day", min: 100, max: 200 },
  { label: "$200 – $500/day", min: 200, max: 500 },
  { label: "$500+/day", min: 500, max: Infinity },
];

const SEAT_OPTIONS = ["2 Seats", "4 Seats", "5 Seats", "7 Seats", "7+ Seats"];
const TRANSMISSION_OPTIONS = ["Automatic", "Manual"];
const FUEL_OPTIONS = ["Petrol", "Diesel", "Electric", "Hybrid"];
const CAR_TYPE_OPTIONS = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Luxury",
  "Microbus",
  "Convertible",
];

export type CarSearchPageProps = {
  cars: Car[];
  title?: string;
  subtitle?: string;
  locationDefault?: string;
  dateText?: string;
};

export default function CarSearchPage({
  cars,
  title = "124 cars available in Dhaka",
  subtitle = "Found results matching your filters on Dec 18 - Dec 22",
  locationDefault = "Dhaka",
  dateText = "Dec 18 - Dec 22",
}: CarSearchPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selfDrive, setSelfDrive] = useState(true);
  const [chauffeur, setChauffeur] = useState(false);

  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string | null>(null);
  const [selectedTransmission, setSelectedTransmission] = useState<
    string | null
  >(null);
  const [selectedFuel, setSelectedFuel] = useState<string | null>(null);
  const [selectedCarType, setSelectedCarType] = useState<string | null>(null);

  const activeFilterCount = [
    selectedPrice,
    selectedSeats,
    selectedTransmission,
    selectedFuel,
    selectedCarType,
  ].filter(Boolean).length;

  const toggleFavorite = (carId: number) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId],
    );
  };

  const clearAllFilters = () => {
    setSelectedPrice(null);
    setSelectedSeats(null);
    setSelectedTransmission(null);
    setSelectedFuel(null);
    setSelectedCarType(null);
  };

  // ✅ Filtering logic
  const filteredCars = useMemo(() => {
    let list = cars;

    // Drive type (if only one selected)
    if (selfDrive !== chauffeur) {
      list = list.filter((c) =>
        selfDrive ? c.driveType === "SELF-DRIVE" : c.driveType === "CHAUFFEUR",
      );
    }

    // Price
    if (selectedPrice) {
      const range = PRICE_RANGES.find((r) => r.label === selectedPrice);
      if (range)
        list = list.filter((c) => c.price >= range.min && c.price < range.max);
    }

    // Seats
    if (selectedSeats) {
      const n = parseInt(selectedSeats, 10);
      if (!Number.isNaN(n))
        list = list.filter((c) =>
          selectedSeats.includes("+") ? c.seats >= n : c.seats === n,
        );
    }

    // Transmission
    if (selectedTransmission) {
      list = list.filter((c) =>
        selectedTransmission === "Automatic"
          ? c.transmission === "Auto"
          : c.transmission === "Manual",
      );
    }

    // Fuel
    if (selectedFuel)
      list = list.filter(
        (c) => c.fuelType.toLowerCase() === selectedFuel.toLowerCase(),
      );

    // Car type
    if (selectedCarType)
      list = list.filter(
        (c) => c.carType.toLowerCase() === selectedCarType.toLowerCase(),
      );

    return list;
  }, [
    cars,
    selfDrive,
    chauffeur,
    selectedPrice,
    selectedSeats,
    selectedTransmission,
    selectedFuel,
    selectedCarType,
  ]);

  return (
    <motion.main
      variants={pageIn}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gray-50"
    >
      <SearchHeader
        locationDefault={locationDefault}
        dateText={dateText}
        selfDrive={selfDrive}
        chauffeur={chauffeur}
        onToggleSelfDrive={() => setSelfDrive((v) => !v)}
        onToggleChauffeur={() => setChauffeur((v) => !v)}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FiltersBar
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          selectedTransmission={selectedTransmission}
          setSelectedTransmission={setSelectedTransmission}
          selectedFuel={selectedFuel}
          setSelectedFuel={setSelectedFuel}
          selectedCarType={selectedCarType}
          setSelectedCarType={setSelectedCarType}
          activeFilterCount={activeFilterCount}
          onClearAll={clearAllFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          options={{
            PRICE_RANGES: PRICE_RANGES.map((p) => p.label),
            SEAT_OPTIONS,
            TRANSMISSION_OPTIONS,
            FUEL_OPTIONS,
            CAR_TYPE_OPTIONS,
          }}
        />

        <ResultsHeader title={title} subtitle={subtitle} />

        <CarGrid
          cars={filteredCars}
          viewMode={viewMode}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        <Pagination currentPage={currentPage} onChange={setCurrentPage} />
      </section>
    </motion.main>
  );
}
