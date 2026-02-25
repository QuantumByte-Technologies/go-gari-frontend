// components/pricing/RentalModeSelector.tsx
import { motion } from "framer-motion";
import { Clock, CalendarBlank, CalendarDots } from "@phosphor-icons/react";
import { RentalMode } from "@/types/carType";
import { cn } from "@/utils/utils";
// import type { RentalMode } from "@/types";

interface Props {
  rentalMode: RentalMode;
  onModeChange: (mode: RentalMode) => void;
}

export function RentalModeSelector({ rentalMode, onModeChange }: Props) {
  const modes: { id: RentalMode; label: string; icon: React.ElementType }[] = [
    { id: "days", label: "Days", icon: Clock },
    { id: "weekly", label: "Weekly", icon: CalendarBlank },
    { id: "monthly", label: "Monthly", icon: CalendarDots },
  ];

  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-gray-700">
        Rental Period
      </label>

      <div className="relative flex rounded-xl bg-gray-100 p-1">
        <motion.div
          className="absolute bottom-1 top-1 rounded-lg bg-white shadow-sm"
          animate={{
            left:
              rentalMode === "days"
                ? "4px"
                : rentalMode === "weekly"
                  ? "calc(33.33% + 1px)"
                  : "calc(66.66% - 2px)",
            width: "calc(33.33% - 5px)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />

        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-colors",
              rentalMode === mode.id ? "text-[#5E9D34]" : "text-gray-500",
            )}
          >
            <mode.icon
              size={14}
              weight={rentalMode === mode.id ? "fill" : "duotone"}
            />
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
