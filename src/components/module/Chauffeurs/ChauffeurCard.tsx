"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Star, ShieldCheck, SteeringWheel } from "@phosphor-icons/react";
import type { ChauffeurListItem } from "@/types/api/chauffeurs";
import { Button } from "@/components/ui/button";
import { cardIn, EASE_OUT } from "@/lib/motion";
import { useRouter } from "next/navigation";

type Props = {
  chauffeur: ChauffeurListItem;
  index?: number;
};

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";

export default function ChauffeurCard({ chauffeur, index = 0 }: Props) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={cardIn}
      initial={prefersReduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.05, ease: EASE_OUT }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Photo */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={chauffeur.photo || FALLBACK_PHOTO}
          alt={chauffeur.user}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {chauffeur.is_verified && (
          <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck size={14} weight="fill" />
            Verified
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1">
          {chauffeur.user}
        </h3>

        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Star size={16} weight="fill" className="text-amber-400" />
            {chauffeur.average_rating}
          </span>
          <span className="flex items-center gap-1">
            <SteeringWheel size={16} weight="duotone" className="text-gray-400" />
            {chauffeur.experience_years}yr{chauffeur.experience_years !== 1 ? "s" : ""}
          </span>
          <span className="text-gray-400">
            {chauffeur.total_trips} trips
          </span>
        </div>

        <Button
          onClick={() => router.push(`/chauffeurs/${chauffeur.id}`)}
          className="w-full bg-[#65AA36] hover:bg-[#5A9930] text-white"
        >
          View Profile
        </Button>
      </div>
    </motion.div>
  );
}
