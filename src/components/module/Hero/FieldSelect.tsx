// components/home/booking/FieldSelect.tsx
"use client";

import React from "react";
import { CaretDown } from "@phosphor-icons/react";

type Props = {
  label: React.ReactNode;
  placeholder: string;
  options: string[];
};

export function FieldSelect({ label, placeholder, options }: Props) {
  return (
    <div className="space-y-2">
      <div className="ml-1">{label}</div>
      <div className="relative group">
        <select className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base font-medium appearance-none cursor-pointer transition-all h-14 shadow-sm hover:border-gray-300 group-hover:shadow-md">
          <option>{placeholder}</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-40%]">
          <CaretDown size={20} weight="bold" className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
