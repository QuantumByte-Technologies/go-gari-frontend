"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Car } from "@phosphor-icons/react";
import { Toggle } from "../ui/toggle";

export function DriveTypeSection() {
  const [isChauffeur, setIsChauffeur] = useState(false);

  const container = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.12,
          delayChildren: 0.05,
        },
      },
    }),
    [],
  );

  const fadeLeft = useMemo(
    () => ({
      hidden: { opacity: 0, x: -18 },
      show: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring" as const, // Add 'as const' to fix the type
          stiffness: 120,
          damping: 18,
          mass: 0.7,
        },
      },
    }),
    [],
  );

  const card = useMemo(
    () => ({
      hidden: { opacity: 0, y: 18, scale: 0.98 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring" as const, // Add 'as const' to fix the type
          stiffness: 140,
          damping: 18,
          mass: 0.6,
        },
      },
    }),
    [],
  );

  // Helper function to handle drive type selection
  const handleDriveTypeChange = (chauffeurMode: boolean) => {
    setIsChauffeur(chauffeurMode);
  };

  return (
    <section className="py-20 md:py-32 bg-gray-50 overflow-hidden relative">
      {/* Decorative Orange Dot Pattern */}
      <div
        className="absolute top-10 right-10 w-24 h-24 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#E8722A 2px, transparent 2px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Content */}
          <motion.div variants={fadeLeft} className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-[#5E9D34] font-semibold tracking-wide uppercase text-sm mb-2">
                Choose How You Drive
              </h2>

              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Self-drive or chauffeur-driven — it&apos;s your call.
              </h3>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                GO GAARI lets you choose how you want to travel. Whether you
                prefer the freedom of driving yourself or the ease of having a
                professional driver, the choice stays with you.
              </p>

              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-fit">
                {/* Toggle with visual feedback */}
                <div className="flex items-center gap-3">
                  <Toggle
                    pressed={isChauffeur}
                    onPressedChange={handleDriveTypeChange}
                    aria-label="Toggle chauffeur mode"
                    className="data-[state=on]:bg-[#5E9D34] data-[state=on]:text-white border cursor-pointer"
                  />
                  <span className="text-sm font-medium">
                    {isChauffeur ? "Chauffeur Mode" : "Self-Drive Mode"}
                  </span>
                </div>

                <span className="text-sm font-medium text-gray-600">
                  Toggle between self-drive and chauffeur-driven options
                </span>
              </div>

              {/* Live preview of selected mode */}
              <motion.div
                key={isChauffeur ? "chauffeur" : "self"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-[#5E9D34]/5 rounded-lg border border-[#5E9D34]/20"
              >
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-[#5E9D34]">
                    {isChauffeur ? "Chauffeur-Driven" : "Self-Drive"} selected:
                  </span>{" "}
                  {isChauffeur
                    ? "Professional driver will be assigned to your booking."
                    : "You'll have full control of the vehicle during your rental."}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Self Drive Card */}
            <motion.button
              type="button"
              variants={card}
              onClick={() => handleDriveTypeChange(false)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              className={[
                "will-change-transform text-left p-8 rounded-2xl border-2 transition-all duration-300 relative group overflow-hidden",
                !isChauffeur
                  ? "bg-white border-[#5E9D34] shadow-lg shadow-[#5E9D34]/10"
                  : "bg-white border-transparent shadow-sm hover:shadow-md opacity-80 hover:opacity-100",
              ].join(" ")}
            >
              <div
                className={[
                  "absolute top-0 left-0 right-0 h-1 bg-orange-500 transition-opacity duration-300",
                  !isChauffeur ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />

              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Car size={28} weight="duotone" className="text-[#5E9D34]" />
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Self-Drive
              </h4>

              <p className="text-gray-600 leading-relaxed">
                Take full control of the drive. Ideal for independence,
                flexibility, and personal travel on your own schedule.
              </p>

              <div
                className={[
                  "absolute top-4 right-4 w-2 h-2 rounded-full bg-[#5E9D34] transition-opacity duration-300",
                  !isChauffeur ? "opacity-100 animate-pulse" : "opacity-0",
                ].join(" ")}
              />
            </motion.button>

            {/* Chauffeur Card */}
            <motion.button
              type="button"
              variants={card}
              onClick={() => handleDriveTypeChange(true)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              className={[
                "will-change-transform text-left p-8 rounded-2xl border-2 transition-all duration-300 relative group overflow-hidden",
                isChauffeur
                  ? "bg-white border-[#5E9D34] shadow-lg shadow-[#5E9D34]/10"
                  : "bg-white border-transparent shadow-sm hover:shadow-md opacity-80 hover:opacity-100",
              ].join(" ")}
            >
              <div
                className={[
                  "absolute top-0 left-0 right-0 h-1 bg-orange-500 transition-opacity duration-300",
                  isChauffeur ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />

              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <UserCheck
                  size={28}
                  weight="duotone"
                  className="text-[#5E9D34]"
                />
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Chauffeur-Driven
              </h4>

              <p className="text-gray-600 leading-relaxed">
                Sit back and relax while an experienced driver takes care of the
                road — perfect for workdays, airport trips, or when you simply
                don&apos;t want to drive.
              </p>

              <div
                className={[
                  "absolute top-4 right-4 w-2 h-2 rounded-full bg-[#5E9D34] transition-opacity duration-300",
                  isChauffeur ? "opacity-100 animate-pulse" : "opacity-0",
                ].join(" ")}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
