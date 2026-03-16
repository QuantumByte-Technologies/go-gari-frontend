// components/pricing/PricingCard.tsx
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Lightning, Car as CarIcon } from "@phosphor-icons/react";
import type { CarDetail } from "@/types/api/cars";
import { useCalculatePricingQuery } from "@/redux/api/pricingApi";
import { cn } from "@/lib/utils";
import { formatBDT } from "@/utils/checkout";
import { PrimaryButton, Toggle } from "./ui";
import { TimeInput } from "./TimeInput";
import { DateRangePicker } from "@/components/ui/date-picker";

interface Props {
  car: CarDetail;
}

/** Get tomorrow's date as YYYY-MM-DD */
function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

/** Get a date N days from now as YYYY-MM-DD */
function getDatePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function PricingCard({ car }: Props) {
  const router = useRouter();

  const [startDate, setStartDate] = useState(getTomorrow());
  const [endDate, setEndDate] = useState(getDatePlusDays(4));
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [isSelfDrive, setIsSelfDrive] = useState(
    car.drive_option === "self_drive_only",
  );

  const driveType = isSelfDrive ? "self_drive" as const : "with_chauffeur" as const;

  // Only allow self-drive toggle if the car supports both
  const canToggleDrive = car.drive_option === "both";

  // Calculate pricing via API
  const {
    data: pricing,
    isLoading: isPricingLoading,
    isFetching: isPricingFetching,
  } = useCalculatePricingQuery(
    {
      car_id: car.id,
      start_date: startDate,
      end_date: endDate,
      drive_type: driveType,
    },
    {
      skip: !startDate || !endDate || startDate >= endDate,
    },
  );

  const canCheckout = useMemo(() => {
    if (!startDate || !endDate) return false;
    return new Date(endDate) > new Date(startDate);
  }, [startDate, endDate]);

  const handleCheckout = () => {
    // Store booking draft in localStorage for the checkout page
    const draft = {
      carId: car.id,
      carName: car.name,
      startDate,
      endDate,
      pickupTime,
      dropoffTime,
      driveType,
      pricing: pricing
        ? {
            numDays: pricing.num_days,
            ratePerDay: pricing.rate_per_day,
            subtotal: pricing.subtotal,
            discountPercentage: pricing.discount_percentage,
            discountAmount: pricing.discount_amount,
            grandTotal: pricing.grand_total,
          }
        : null,
    };
    try {
      localStorage.setItem("booking_draft", JSON.stringify(draft));
    } catch {
      // Ignore localStorage errors
    }
    router.push("/checkout");
  };

  const isCalculating = isPricingLoading || isPricingFetching;
  const ratePerDay = parseFloat(car.rate_per_day);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      {/* Price header */}
      <div className="mb-2 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-gray-900">
          {formatBDT(car.rate_per_day)}
        </span>
        <span className="text-gray-500">/day</span>
      </div>

      {car.drive_option !== "self_drive_only" && (
        <p className="mb-2 text-xs text-gray-500">
          With chauffeur: {formatBDT(car.chauffeur_rate_per_day)}/day
        </p>
      )}

      <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#5E9D34]">
        <Lightning size={14} weight="fill" />
        Instant Confirmation
      </div>

      {/* Date selection */}
      <div className="mb-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          minDate={new Date(getTomorrow())}
        />
      </div>

      {/* Time inputs */}
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

      {/* Self-drive toggle */}
      {canToggleDrive && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <CarIcon size={18} weight="duotone" className="text-gray-700" />
              <p className="font-bold text-gray-900">Self-Drive</p>
            </div>
            <p className="text-xs text-gray-500">
              {formatBDT(car.rate_per_day)}/day without chauffeur
            </p>
          </div>

          <Toggle
            isOn={isSelfDrive}
            onToggle={() => setIsSelfDrive((v) => !v)}
            ariaLabel="Self-drive toggle"
          />
        </div>
      )}

      {/* Price breakdown */}
      <div className="mb-6 space-y-3 border-b border-gray-100 pb-6">
        {isCalculating ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ) : pricing ? (
          <>
            <PriceRow
              label={`Rate per day (${pricing.num_days} day${pricing.num_days > 1 ? "s" : ""})`}
              value={formatBDT(pricing.rate_per_day)}
            />
            <PriceRow label="Subtotal" value={formatBDT(pricing.subtotal)} />
            {parseFloat(pricing.discount_amount) > 0 && (
              <PriceRow
                label={`Discount (${pricing.discount_percentage}%)`}
                value={`-${formatBDT(pricing.discount_amount)}`}
                className="text-[#5E9D34]"
              />
            )}
          </>
        ) : (
          <PriceRow
            label="Estimated daily rate"
            value={formatBDT(car.rate_per_day)}
          />
        )}
      </div>

      {/* Total */}
      <div className="mb-6 flex items-end justify-between">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-[#5E9D34]">
          {isCalculating ? (
            <span className="inline-block h-7 w-24 animate-pulse bg-gray-100 rounded" />
          ) : pricing ? (
            formatBDT(pricing.grand_total)
          ) : (
            formatBDT(ratePerDay)
          )}
        </span>
      </div>

      <PrimaryButton onClick={handleCheckout} disabled={!canCheckout || isCalculating}>
        Continue to Book
      </PrimaryButton>

      <p className="mt-3 text-center text-xs text-gray-400">
        Free cancellation until 24h before pickup
      </p>
    </div>
  );
}

function PriceRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={cn("font-medium text-gray-900", className)}>
        {value}
      </span>
    </div>
  );
}
