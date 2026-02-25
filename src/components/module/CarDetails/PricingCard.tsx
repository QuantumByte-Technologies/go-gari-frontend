/* eslint-disable @typescript-eslint/no-explicit-any */
// components/pricing/PricingCard.tsx
import { useState, useMemo } from "react";
import { Lightning, Clock, Car as CarIcon } from "@phosphor-icons/react";
// import type { CarData, RentalMode, BookingDraft } from "@/types";
import { cn, diffDaysInclusive } from "@/utils/utils";
import { PrimaryButton, Toggle } from "./ui";
import { RentalModeSelector } from "./RentalModeSelector";
import { RentalInput } from "./RentalInput";
import { TimeInput } from "./TimeInput";
import { BookingDraft, CarData, RentalMode } from "@/types/carType";
// import { clampInt, diffDaysInclusive } from "@/utils";

interface Props {
  car: CarData;
  onCheckout: (payload: BookingDraft) => void;
}

export function PricingCard({ car, onCheckout }: Props) {
  const [rentalMode, setRentalMode] = useState<RentalMode>("days");
  const [daysCount, setDaysCount] = useState(3);
  const [weeksCount, setWeeksCount] = useState(1);
  const [monthlyStart, setMonthlyStart] = useState("");
  const [monthlyEnd, setMonthlyEnd] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [isSelfDrive, setIsSelfDrive] = useState(false);

  const selfDriveDiscount = 30;
  const insuranceFee = 32.5;

  const totalDays = useMemo(() => {
    if (rentalMode === "days") return Math.max(1, daysCount);
    if (rentalMode === "weekly") return Math.max(1, weeksCount) * 7;
    if (rentalMode === "monthly") {
      if (monthlyStart && monthlyEnd)
        return diffDaysInclusive(monthlyStart, monthlyEnd);
      return 30;
    }
    return 1;
  }, [rentalMode, daysCount, weeksCount, monthlyStart, monthlyEnd]);

  const getRentalLabel = useMemo(() => {
    if (rentalMode === "days")
      return `${daysCount} day${daysCount > 1 ? "s" : ""}`;
    if (rentalMode === "weekly")
      return `${weeksCount} week${weeksCount > 1 ? "s" : ""} (${totalDays} days)`;
    if (rentalMode === "monthly") {
      if (monthlyStart && monthlyEnd) return `${totalDays} days`;
      return "30 days";
    }
    return "";
  }, [rentalMode, daysCount, weeksCount, totalDays, monthlyStart, monthlyEnd]);

  const subtotal = useMemo(() => car.price * totalDays, [car.price, totalDays]);
  const discount = useMemo(
    () => (isSelfDrive ? selfDriveDiscount * totalDays : 0),
    [isSelfDrive, totalDays],
  );
  const total = useMemo(
    () => subtotal - discount + insuranceFee,
    [subtotal, discount, insuranceFee],
  );

  const canCheckout = useMemo(() => {
    if (rentalMode !== "monthly") return true;
    if (monthlyStart && monthlyEnd)
      return new Date(monthlyEnd) >= new Date(monthlyStart);
    return true;
  }, [rentalMode, monthlyStart, monthlyEnd]);

  const handleCheckout = () => {
    const payload: BookingDraft = {
      carId: car.id,
      rentalMode,
      totalDays,
      daysCount,
      weeksCount,
      monthlyStart: monthlyStart || null,
      monthlyEnd: monthlyEnd || null,
      pickupTime,
      dropoffTime,
      isSelfDrive,
      pricing: {
        perDay: car.price,
        subtotal,
        insuranceFee,
        discount,
        total,
      },
    };
    onCheckout(payload);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-2 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-gray-900">${car.price}</span>
        <span className="text-gray-500">/day</span>
      </div>

      <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#5E9D34]">
        <Lightning size={14} weight="fill" />
        Instant Confirmation
      </div>

      <RentalModeSelector
        rentalMode={rentalMode}
        onModeChange={setRentalMode}
      />

      <RentalInput
        rentalMode={rentalMode}
        daysCount={daysCount}
        weeksCount={weeksCount}
        monthlyStart={monthlyStart}
        monthlyEnd={monthlyEnd}
        totalDays={totalDays}
        onDaysChange={setDaysCount}
        onWeeksChange={setWeeksCount}
        onMonthlyStartChange={setMonthlyStart}
        onMonthlyEndChange={setMonthlyEnd}
      />

      <div className="mb-6 grid grid-cols-2 gap-3">
        <TimeInput
          label="Pickup Time"
          value={pickupTime}
          onChange={setPickupTime}
        />
        <TimeInput
          label="Drop-off Time"
          value={dropoffTime}
          onChange={setDropoffTime}
        />
      </div>

      <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <CarIcon size={18} weight="duotone" className="text-gray-700" />
            <p className="font-bold text-gray-900">Self-Drive</p>
          </div>
          <p className="text-xs text-gray-500">
            Save ${selfDriveDiscount}/day - No driver
          </p>
        </div>

        <Toggle
          isOn={isSelfDrive}
          onToggle={() => setIsSelfDrive((v) => !v)}
          ariaLabel="Self-drive toggle"
        />
      </div>

      <div className="mb-6 space-y-3 border-b border-gray-100 pb-6">
        <PriceRow label={`Daily rate (${getRentalLabel})`} value={subtotal} />
        {isSelfDrive && (
          <PriceRow
            label="Self-drive discount"
            value={-discount}
            className="text-[#5E9D34]"
          />
        )}
        <PriceRow label="Airport pickup" value={0} isFree />
        <PriceRow label="Insurance & Fees" value={insuranceFee} />
      </div>

      <div className="mb-6 flex items-end justify-between">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-[#5E9D34]">
          ${total.toFixed(2)}
        </span>
      </div>

      <PrimaryButton onClick={handleCheckout} disabled={!canCheckout}>
        Continue to Book
      </PrimaryButton>

      <p className="mt-3 text-center text-xs text-gray-400">
        Free cancellation until 24h before pickup
      </p>
    </div>
  );
}

function PriceRow({ label, value, isFree, className }: any) {
  if (isFree) {
    return (
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold text-[#5E9D34]">FREE</span>
      </div>
    );
  }

  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={cn("font-medium text-gray-900", className)}>
        {value < 0 ? `-$${Math.abs(value).toFixed(2)}` : `$${value.toFixed(2)}`}
      </span>
    </div>
  );
}
