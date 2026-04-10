"use client";

import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { pageIn } from "@/lib/motion";
import { useGetCarsQuery } from "@/redux/api/carsApi";
import type { CarSearchParams } from "@/types/api/cars";
import SearchHeader from "./SearchHeader";
import FiltersBar from "./FiltersBar";
import ResultsHeader from "./ResultsHeader";
import CarGrid from "./CarGrid";
import Pagination from "@/components/common/Car-Pagination";

// BDT price ranges
const PRICE_RANGES = [
  { label: "Under ৳2,000/day", min: 0, max: 2000 },
  { label: "৳2,000 – ৳5,000/day", min: 2000, max: 5000 },
  { label: "৳5,000 – ৳10,000/day", min: 5000, max: 10000 },
  { label: "৳10,000 – ৳20,000/day", min: 10000, max: 20000 },
  { label: "৳20,000+/day", min: 20000, max: undefined },
] as const;

const SEAT_OPTIONS = ["2 Seats", "4 Seats", "5 Seats", "7 Seats"];
const TRANSMISSION_OPTIONS = ["Automatic", "Manual"];
const FUEL_OPTIONS = ["Petrol", "Diesel", "Octane", "Electric", "Hybrid", "CNG"];
const CAR_TYPE_OPTIONS = ["Economy", "Premium", "SUV"];

type FilterKey = "price" | "seats" | "transmission" | "fuel" | "carType";

/**
 * Read a search param as string or null.
 */
function param(sp: URLSearchParams, key: string): string | null {
  return sp.get(key) || null;
}

export default function CarSearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

  // ── Read filter state from URL search params ──────────────────
  const currentPage = Number(searchParams.get("page") ?? 1);
  const selectedPrice = param(searchParams, "price_label");
  const selectedSeats = param(searchParams, "seats_label");
  const selectedTransmission = param(searchParams, "transmission_label");
  const selectedFuel = param(searchParams, "fuel_label");
  const selectedCarType = param(searchParams, "category_label");
  const searchQuery = param(searchParams, "search");
  const selfDrive = searchParams.get("drive") !== "chauffeur";
  const chauffeur = searchParams.get("drive") !== "self";

  // ── Build API query params from URL ───────────────────────────
  const queryParams = useMemo<CarSearchParams>(() => {
    const params: CarSearchParams = { page: currentPage };

    // Search
    const search = searchParams.get("search");
    if (search) params.search = search;

    // City
    const city = searchParams.get("city");
    if (city) params.city = city;

    // Drive option
    const drive = searchParams.get("drive");
    if (drive === "self") params.drive_option = "self_drive_only";
    else if (drive === "chauffeur") params.drive_option = "chauffeur_only";

    // Price range
    if (selectedPrice) {
      const range = PRICE_RANGES.find((r) => r.label === selectedPrice);
      if (range) {
        params.min_price = range.min;
        if (range.max !== undefined) params.max_price = range.max;
      }
    }

    // Seats
    if (selectedSeats) {
      const n = parseInt(selectedSeats, 10);
      if (!Number.isNaN(n)) params.seats = n;
    }

    // Transmission
    if (selectedTransmission) {
      params.transmission =
        selectedTransmission === "Automatic" ? "auto" : "manual";
    }

    // Fuel type
    if (selectedFuel) {
      const fuelMap: Record<string, CarSearchParams["fuel_type"]> = {
        Petrol: "petrol",
        Diesel: "diesel",
        Octane: "octane",
        Electric: "electric",
        Hybrid: "hybrid",
        CNG: "cng",
      };
      params.fuel_type = fuelMap[selectedFuel];
    }

    // Category
    if (selectedCarType) {
      const catMap: Record<string, CarSearchParams["category"]> = {
        Economy: "economy",
        Premium: "premium",
        SUV: "suv",
      };
      params.category = catMap[selectedCarType];
    }

    // Dates
    const start = searchParams.get("start_date");
    const end = searchParams.get("end_date");
    if (start) params.start_date = start;
    if (end) params.end_date = end;

    // Ordering
    const ordering = searchParams.get("ordering");
    if (ordering) params.ordering = ordering;

    return params;
  }, [
    currentPage,
    searchParams,
    selectedPrice,
    selectedSeats,
    selectedTransmission,
    selectedFuel,
    selectedCarType,
  ]);

  // ── API call ──────────────────────────────────────────────────
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetCarsQuery(queryParams);

  const totalCount = data?.count ?? 0;
  const cars = data?.results ?? [];
  const totalPages = Math.ceil(totalCount / 10); // Assuming 10 per page

  // ── URL updater ───────────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const sp = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          sp.delete(key);
        } else {
          sp.set(key, value);
        }
      }
      // Reset to page 1 when filters change
      if (!("page" in updates)) {
        sp.delete("page");
      }
      router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

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
    updateParams({
      price_label: null,
      seats_label: null,
      transmission_label: null,
      fuel_label: null,
      category_label: null,
    });
  };

  // ── Derived display text ──────────────────────────────────────
  const city = searchParams.get("city") ?? "Dhaka";
  const title = isLoading
    ? "Searching..."
    : `${totalCount} car${totalCount !== 1 ? "s" : ""} available in ${city}`;
  const subtitle = isLoading
    ? "Looking for the best cars for you"
    : totalCount > 0
      ? "Results matching your filters"
      : "Try adjusting your filters";

  return (
    <motion.main
      variants={pageIn}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gray-50"
    >
      <SearchHeader
        locationDefault={city}
        selfDrive={selfDrive}
        chauffeur={chauffeur}
        onSearch={(q: string) => updateParams({ search: q || null })}
        onToggleSelfDrive={() =>
          updateParams({
            drive: selfDrive && !chauffeur ? null : "self",
          })
        }
        onToggleChauffeur={() =>
          updateParams({
            drive: chauffeur && !selfDrive ? null : "chauffeur",
          })
        }
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FiltersBar
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          selectedPrice={selectedPrice}
          setSelectedPrice={(v) => updateParams({ price_label: v })}
          selectedSeats={selectedSeats}
          setSelectedSeats={(v) => updateParams({ seats_label: v })}
          selectedTransmission={selectedTransmission}
          setSelectedTransmission={(v) =>
            updateParams({ transmission_label: v })
          }
          selectedFuel={selectedFuel}
          setSelectedFuel={(v) => updateParams({ fuel_label: v })}
          selectedCarType={selectedCarType}
          setSelectedCarType={(v) => updateParams({ category_label: v })}
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
          cars={cars}
          viewMode={viewMode}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isLoading={isLoading || isFetching}
          isError={isError}
          onRetry={refetch}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(p) => updateParams({ page: String(p) })}
          />
        )}
      </section>
    </motion.main>
  );
}
