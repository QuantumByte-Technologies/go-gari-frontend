"use client";

import React, { useState, useCallback } from "react";
import { MagnifyingGlass, Spinner, UsersFour } from "@phosphor-icons/react";
import { useGetChauffeursQuery } from "@/redux/api/chauffeursApi";
import ChauffeurCard from "./ChauffeurCard";
import { Button } from "@/components/ui/button";

export default function ChauffeurList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search input
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);

      // Simple debounce with setTimeout
      const timeout = setTimeout(() => {
        setDebouncedSearch(e.target.value);
      }, 300);

      return () => clearTimeout(timeout);
    },
    [],
  );

  const { data, isLoading, isFetching } = useGetChauffeursQuery({
    page,
    search: debouncedSearch || undefined,
  });

  const chauffeurs = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const hasNext = !!data?.next;
  const hasPrevious = !!data?.previous;

  // Loading skeleton
  if (isLoading) {
    return (
      <div data-testid="chauffeur-list-loading">
        {/* Search bar skeleton */}
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse mb-8 max-w-md" />
        {/* Card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-2xl animate-pulse h-72"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative max-w-md mb-8">
        <MagnifyingGlass
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search chauffeurs..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#65AA36] focus:ring-1 focus:ring-[#65AA36] outline-none transition-colors"
        />
        {isFetching && (
          <Spinner
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
          />
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {totalCount} chauffeur{totalCount !== 1 ? "s" : ""} found
      </p>

      {/* Empty state */}
      {chauffeurs.length === 0 && (
        <div className="text-center py-16">
          <UsersFour
            size={48}
            weight="duotone"
            className="text-gray-300 mx-auto mb-4"
          />
          <p className="text-gray-500 text-lg">No chauffeurs found</p>
          {debouncedSearch && (
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search query
            </p>
          )}
        </div>
      )}

      {/* Chauffeur cards grid */}
      {chauffeurs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chauffeurs.map((chauffeur, index) => (
            <ChauffeurCard
              key={chauffeur.id}
              chauffeur={chauffeur}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {(hasNext || hasPrevious) && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            disabled={!hasPrevious || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">Page {page}</span>
          <Button
            variant="outline"
            disabled={!hasNext || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
