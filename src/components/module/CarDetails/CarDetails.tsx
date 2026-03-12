// app/cars/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useGetCarByIdQuery } from "@/redux/api/carsApi";
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

function CarDetailSkeleton() {
  return (
    <div className="bg-gray-50 font-sans mt-20">
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="flex gap-4">
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-5 bg-gray-200 rounded w-20" />
            <div className="h-5 bg-gray-200 rounded w-28" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left column */}
          <div className="space-y-12 lg:col-span-8">
            <div className="aspect-[16/10] bg-gray-200 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-7 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
          {/* Right column */}
          <div className="lg:col-span-4">
            <div className="h-96 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

function CarDetailError({
  onRetry,
  onGoBack,
}: {
  onRetry: () => void;
  onGoBack: () => void;
}) {
  return (
    <div className="bg-gray-50 font-sans mt-20">
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Car not found
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            We couldn&apos;t load the details for this car. It may have been
            removed or there was a connection issue.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="px-5 py-2.5 bg-[#65aa36] text-white rounded-xl hover:bg-[#5a982f] font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onGoBack}
              className="px-5 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CarDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const carId = Number(params.id);

  const {
    data: car,
    isLoading,
    isError,
    refetch,
  } = useGetCarByIdQuery(carId, {
    skip: !carId || Number.isNaN(carId),
  });

  const [isLiked, setIsLiked] = useLocalStorage(
    `liked_car_${carId}`,
    false,
  );

  if (isLoading) {
    return <CarDetailSkeleton />;
  }

  if (isError || !car) {
    return (
      <CarDetailError onRetry={refetch} onGoBack={() => router.back()} />
    );
  }

  // Derive gallery images: use images array sorted by order, or fallback
  const galleryImages =
    car.images.length > 0
      ? [...car.images]
          .sort((a, b) => a.order - b.order)
          .map((img) => img.image)
      : [
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        ];

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
            <CarImageGallery name={car.name} images={galleryImages} />

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
            <ReviewsSummary />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <PricingCard car={car} />
              <PickupLocation car={car} />

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
