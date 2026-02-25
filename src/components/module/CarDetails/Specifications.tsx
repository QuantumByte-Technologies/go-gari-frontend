// components/car/Specifications.tsx
import { CarData } from "@/types/carType";
import { Gauge, Lightning, BatteryFull, GearSix } from "@phosphor-icons/react";
// import type { CarData } from "@/types";

interface Props {
  car: CarData;
}

export function CarSpecifications({ car }: Props) {
  const items = [
    { icon: Gauge, label: "Top Speed", value: car.specs.speed },
    { icon: Lightning, label: "0-60 mph", value: car.specs.acceleration },
    { icon: BatteryFull, label: "Range", value: car.specs.range },
    { icon: GearSix, label: "Drive", value: car.specs.drive },
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
