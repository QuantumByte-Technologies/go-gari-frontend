// components/home/booking/FieldInput.tsx
"use client";

import React from "react";
import { Clock } from "@phosphor-icons/react";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

type Props = {
  label: React.ReactNode;
  type: "date" | "time";
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  /** For date type: disable dates before this */
  minDate?: Date;
};

export function FieldInput({ label, type, value, onChange, defaultValue, minDate }: Props) {
  if (type === "date") {
    return (
      <div className="space-y-2">
        <div className="ml-1">{label}</div>
        <DatePicker
          value={value ?? ""}
          onChange={onChange ?? (() => {})}
          minDate={minDate}
          className="w-full h-14 rounded-2xl shadow-sm border-gray-200"
          captionLayout="dropdown"
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 3}
        />
      </div>
    );
  }

  // Time input — styled to match the date picker button
  const displayTime = value || defaultValue || "";

  return (
    <div className="space-y-2">
      <div className="ml-1">{label}</div>
      <div className="relative">
        <Clock
          size={18}
          weight="duotone"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
        />
        <input
          type="time"
          value={value ?? defaultValue ?? ""}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={!onChange}
          className={cn(
            "w-full h-14 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl",
            "focus:ring-2 focus:ring-primary focus:border-primary outline-none",
            "text-base font-medium transition-all shadow-sm hover:border-gray-300",
            !displayTime && "text-muted-foreground"
          )}
        />
      </div>
    </div>
  );
}
