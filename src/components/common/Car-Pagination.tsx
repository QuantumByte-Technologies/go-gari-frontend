"use client";

import React, { useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

type Props = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

/**
 * Generate a page range like [1, 2, 3, "...", 10]
 * Shows first, last, and pages around the current page.
 */
function buildPageRange(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // Always show page 1
  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  // Show pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  // Always show last page
  pages.push(total);

  return pages;
}

export default function Pagination({ currentPage, totalPages, onChange }: Props) {
  const pages = useMemo(
    () => buildPageRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <CaretLeft size={20} weight="bold" />
      </button>

      {pages.map((page, index) => (
        <button
          key={`${page}-${index}`}
          onClick={() => typeof page === "number" && onChange(page)}
          disabled={page === "..."}
          className={`min-w-10 h-10 px-3 rounded-lg font-medium transition-colors ${
            page === currentPage
              ? "bg-[#5E9D34] text-white"
              : page === "..."
                ? "text-gray-400 cursor-default"
                : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <CaretRight size={20} weight="bold" />
      </button>
    </div>
  );
}
