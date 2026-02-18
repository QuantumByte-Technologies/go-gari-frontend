"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Car, MapPin, TrendUp } from "@phosphor-icons/react";
import { BookingModule } from "./BookingModule";
import { Button } from "../ui/button";

export function Hero() {
  const router = useRouter();

  const handleNavigateToSearch = () => {
    router.push("/search"); // your search route
  };

  const handleHowItWorks = () => {
    router.push("/how-it-works"); // your how it works route
  };

  return (
    <section className="relative w-full min-h-screen pb-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cdn.magicpatterns.com/uploads/aiGg1Et6ZNeYPSgqBa3EKn/Backgroudn_image.png"
          alt="GO GAARI Car"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Angled Bottom Edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-white z-10"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10 md:pt-48 md:pb-20">
        <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Car rental that fits your drive
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed"
          >
            Book self-drive or chauffeur-driven cars around you — clearly
            priced, carefully verified.
          </motion.p>

          {/* Stats Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center md:justify-start mb-8"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
              <Car size={16} weight="fill" className="text-orange-400" />
              500+ Cars
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
              <MapPin size={16} weight="fill" className="text-orange-400" />
              50+ Cities
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
              <TrendUp size={16} weight="fill" className="text-orange-400" />
              10K+ Trips
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleNavigateToSearch}
            >
              Find cars near you
            </Button>

            {/* FIXED: Using native button instead of Button component for the one with icon */}
            <button
              onClick={handleHowItWorks}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors text-base"
            >
              How it works
              <ArrowRight size={16} weight="bold" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 inline-block"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse" />
              GO GAARI mobile app launching soon
            </span>
          </motion.div>
        </div>

        {/* ✅ BookingModule now has its own router */}
        <BookingModule />
      </div>
    </section>
  );
}
