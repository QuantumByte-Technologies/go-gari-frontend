"use client";

import React from "react";
import { motion } from "framer-motion";
import type { DriveType, DriveTypeOption } from "./types";
import { Button } from "@/components/ui/button";

type Props = {
  value: DriveType;
  onChange: (v: DriveType) => void;
  options: readonly DriveTypeOption[];
};

export function DriveTypeToggle({ value, onChange, options }: Props) {
  return (
    <div className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-5 sm:pb-6">
      <div className="flex flex-wrap md:flex-nowrap items-stretch bg-gray-50 rounded-2xl p-1.5 relative shadow-inner border border-gray-100 gap-1.5 md:gap-0">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = value === opt.id;

          return (
            <Button
              key={opt.id}
              type="button"
              variant="ghost"
              onClick={() => onChange(opt.id)}
              className={[
                "relative z-10 flex items-center justify-center gap-2.5 font-bold transition-colors duration-200",
                "outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "h-12 md:h-12", // ✅ use valid tailwind classes
                "w-[calc(50%-3px)] md:w-auto md:flex-1", // ✅ 2 per row on mobile, 3 in row on md+
                "px-3 sm:px-4",
                "text-sm md:text-base",
                "whitespace-normal md:whitespace-nowrap", // ✅ allow wrap on mobile
              ].join(" ")}
            >
              {isActive && (
                <motion.div
                  layoutId="driveTypeIndicator"
                  className="absolute inset-0 bg-[#5E9D34] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <div className="absolute inset-0 bg-primary/5 rounded-xl" />
                </motion.div>
              )}

              <span className="relative z-10 flex items-center gap-2.5">
                <Icon
                  size={20}
                  weight={isActive ? "fill" : "duotone"}
                  className={isActive ? "text-white" : "text-gray-400"}
                />
                <span className={isActive ? "text-white" : "text-gray-500"}>
                  {opt.label}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
