// components/pricing/RentalInput.tsx
import { motion, AnimatePresence } from "framer-motion";
import { CalendarBlank } from "@phosphor-icons/react";
import { clampInt } from "@/utils/utils";

interface Props {
  rentalMode: "days" | "weekly" | "monthly";
  daysCount: number;
  weeksCount: number;
  monthlyStart: string;
  monthlyEnd: string;
  totalDays: number;
  onDaysChange: (value: number) => void;
  onWeeksChange: (value: number) => void;
  onMonthlyStartChange: (value: string) => void;
  onMonthlyEndChange: (value: string) => void;
}

export function RentalInput({
  rentalMode,
  daysCount,
  weeksCount,
  monthlyStart,
  monthlyEnd,
  totalDays,
  onDaysChange,
  onWeeksChange,
  onMonthlyStartChange,
  onMonthlyEndChange,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={rentalMode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="mb-6"
      >
        {rentalMode === "days" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Number of Days
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={365}
                value={daysCount}
                onChange={(e) =>
                  onDaysChange(clampInt(e.target.value, 1, 365, 1))
                }
                className="h-12 flex-1 rounded-xl border border-gray-200 px-4 text-lg font-semibold text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
              />
              <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-500">
                days
              </span>
            </div>
          </div>
        )}

        {rentalMode === "weekly" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Number of Weeks
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={52}
                value={weeksCount}
                onChange={(e) =>
                  onWeeksChange(clampInt(e.target.value, 1, 52, 1))
                }
                className="h-12 flex-1 rounded-xl border border-gray-200 px-4 text-lg font-semibold text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
              />
              <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-500">
                weeks
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              = {weeksCount * 7} days total
            </p>
          </div>
        )}

        {rentalMode === "monthly" && (
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Start Date
              </label>
              <div className="relative">
                <CalendarBlank
                  size={18}
                  weight="duotone"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  value={monthlyStart}
                  onChange={(e) => onMonthlyStartChange(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                End Date
              </label>
              <div className="relative">
                <CalendarBlank
                  size={18}
                  weight="duotone"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  value={monthlyEnd}
                  min={monthlyStart || undefined}
                  onChange={(e) => onMonthlyEndChange(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
                />
              </div>
            </div>

            {monthlyStart && monthlyEnd && (
              <div className="rounded-lg border border-[#5E9D34]/15 bg-[#5E9D34]/5 px-3 py-2">
                <p className="text-xs font-semibold text-[#5E9D34]">
                  {totalDays} days selected
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
