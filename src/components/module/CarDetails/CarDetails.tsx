// app/cars/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useLocalStorage } from "@/utils/utils";
import { BookingDraft, CAR_DATA } from "@/types/carType";
import { CarHeader } from "./HeaderSection";
import { CarImageGallery } from "./ImageGallery";
import { IncludedInPrice } from "./IncludedInPrice";
import { CarSpecifications } from "./Specifications";
import { SafetySecurity } from "./SafetySecurity";
import { CancellationPolicy } from "./CancellationPolicy";
import { InsuranceCoverage } from "./InsuranceCoverage";
import { ReviewsSummary } from "./ReviewsSummary";
import { PricingCard } from "./PricingCard";
import { PickupLocation } from "./PickupLocation";

export default function CarDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const carId = Number(params.id);

  const car = useMemo(() => {
    return CAR_DATA.find((c) => c.id === carId) ?? CAR_DATA[0];
  }, [carId]);

  const [isLiked, setIsLiked] = useLocalStorage(`liked_car_${car.id}`, false);

  const handleCheckout = (draft: BookingDraft) => {
    try {
      localStorage.setItem("booking_draft", JSON.stringify(draft));
    } catch {}
    router.push("/checkout");
  };

  return (
    <div className="bg-gray-50 font-sans mt-20">
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <CarHeader
            car={car}
            isLiked={isLiked}
            onToggleLike={() => setIsLiked((v) => !v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-12 lg:col-span-8">
            <CarImageGallery name={car.name} images={car.images} />

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                About this vehicle
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                {car.description}
              </p>
            </section>

            <IncludedInPrice />
            <CarSpecifications car={car} />
            <SafetySecurity />
            <CancellationPolicy />
            <InsuranceCoverage />
            <ReviewsSummary car={car} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <PricingCard car={car} onCheckout={handleCheckout} />
              <PickupLocation />

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
