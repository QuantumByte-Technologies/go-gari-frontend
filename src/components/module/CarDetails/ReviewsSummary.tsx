// components/car/ReviewsSummary.tsx
import { CarData } from "@/types/carType";
import { Star } from "@phosphor-icons/react";
// import type { CarData } from "@/types";

interface Props {
  car: CarData;
}

export function ReviewsSummary({ car }: Props) {
  const distribution = [
    { stars: 5, pct: "80%" },
    { stars: 4, pct: "12%" },
    { stars: 3, pct: "5%" },
    { stars: 2, pct: "2%" },
    { stars: 1, pct: "1%" },
  ];

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h2>

      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          <div className="text-center md:text-left">
            <div className="mb-2 text-5xl font-bold text-gray-900">
              {car.rating.toFixed(1)}
            </div>
            <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  weight="fill"
                  className={
                    star <= Math.round(car.rating)
                      ? "text-[#5E9D34]"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {car.reviews} verified reviews
            </p>
          </div>

          <div className="w-full flex-1 space-y-3">
            {distribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-4">
                <span className="w-3 text-sm font-medium text-gray-600">
                  {row.stars}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#5E9D34]"
                    style={{ width: row.pct }}
                  />
                </div>
                <span className="w-8 text-right text-sm text-gray-400">
                  {row.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
