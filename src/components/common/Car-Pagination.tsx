"use client";

import React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export default function Pagination({
  currentPage,
  onChange,
}: {
  currentPage: number;
  onChange: (p: number) => void;
}) {
  const pages: (number | "...")[] = [1, 2, 3, "...", 12];

  return (
    <div className="flex items-center justify-center gap-2">
      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <CaretLeft size={20} weight="bold" />
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onChange(page)}
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

      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <CaretRight size={20} weight="bold" />
      </button>
    </div>
  );
}
