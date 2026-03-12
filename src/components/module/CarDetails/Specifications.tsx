// components/car/Specifications.tsx
import type { CarDetail } from "@/types/api/cars";
import { Gauge, GasPump, GearSix, UsersThree } from "@phosphor-icons/react";

interface Props {
  car: CarDetail;
}

/** Human-readable transmission label */
function transmissionLabel(t: CarDetail["transmission"]): string {
  return t === "auto" ? "Automatic" : "Manual";
}

/** Human-readable fuel type label */
function fuelLabel(f: CarDetail["fuel_type"]): string {
  const map: Record<CarDetail["fuel_type"], string> = {
    petrol: "Petrol",
    diesel: "Diesel",
    electric: "Electric",
    hybrid: "Hybrid",
    cng: "CNG",
  };
  return map[f];
}

/** Human-readable drive option label */
function driveLabel(d: CarDetail["drive_option"]): string {
  const map: Record<CarDetail["drive_option"], string> = {
    both: "Self / Chauffeur",
    self_drive_only: "Self Drive Only",
    chauffeur_only: "Chauffeur Only",
  };
  return map[d];
}

export function CarSpecifications({ car }: Props) {
  const items = [
    { icon: UsersThree, label: "Seats", value: `${car.seats} Seats` },
    { icon: GearSix, label: "Transmission", value: transmissionLabel(car.transmission) },
    { icon: GasPump, label: "Fuel Type", value: fuelLabel(car.fuel_type) },
    { icon: Gauge, label: "Drive Option", value: driveLabel(car.drive_option) },
  ];

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Specifications</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((spec, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <spec.icon
              size={24}
              weight="duotone"
              className="mb-3 text-[#5E9D34]"
            />
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {spec.label}
            </p>
            <p className="text-lg font-bold text-gray-900">{spec.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
