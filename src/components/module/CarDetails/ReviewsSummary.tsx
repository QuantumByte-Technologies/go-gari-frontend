"use client";

import React from "react";
import { Star, User, ArrowRight } from "@phosphor-icons/react";
import { useGetCarChauffeursQuery } from "@/redux/api/carsApi";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";

export function ReviewsSummary() {
  const params = useParams();
  const router = useRouter();
  const carId = Number(params.id);

  const { data, isLoading } = useGetCarChauffeursQuery(
    { id: carId },
    { skip: !carId || Number.isNaN(carId) },
  );

  const chauffeurs = data?.results ?? [];

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Available Chauffeurs
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (chauffeurs.length === 0) {
    return (
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Chauffeur Service
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <User
            size={40}
            weight="duotone"
            className="text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">
            No chauffeurs currently available for this vehicle.
          </p>
          <button
            onClick={() => router.push("/chauffeurs")}
            className="text-[#65AA36] text-sm font-medium hover:underline mt-2 inline-flex items-center gap-1"
          >
            Browse all chauffeurs <ArrowRight size={14} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Available Chauffeurs
      </h2>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        {chauffeurs.map((chauffeur) => (
          <button
            key={chauffeur.id}
            onClick={() => router.push(`/chauffeurs/${chauffeur.id}`)}
            className="flex items-center gap-4 w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={chauffeur.photo || FALLBACK_PHOTO}
                alt={chauffeur.user}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 group-hover:text-[#65AA36] transition-colors">
                {chauffeur.user}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star size={14} weight="fill" className="text-amber-400" />
                  {chauffeur.average_rating}
                </span>
                <span>{chauffeur.experience_years}yr experience</span>
                <span>{chauffeur.total_trips} trips</span>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-400 group-hover:text-[#65AA36] transition-colors flex-shrink-0"
            />
          </button>
        ))}

        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => router.push("/chauffeurs")}
            className="text-[#65AA36] text-sm font-medium hover:underline inline-flex items-center gap-1"
          >
            View all chauffeurs <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
