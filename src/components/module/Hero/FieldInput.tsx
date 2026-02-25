// components/home/booking/FieldInput.tsx
"use client";

import React from "react";

type Props = {
  label: React.ReactNode;
  type: "date" | "time";
  defaultValue?: string;
};

export function FieldInput({ label, type, defaultValue }: Props) {
  return (
    <div className="space-y-2">
      <div className="ml-1">{label}</div>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base font-medium transition-all h-14 shadow-sm hover:border-gray-300"
      />
    </div>
  );
}
