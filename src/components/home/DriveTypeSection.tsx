"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Car, UserCheck, CheckCircle } from "@phosphor-icons/react";
import { Toggle } from "../ui/toggle";

const driveOptions = [
  {
    id: "self",
    title: "Self-Drive",
    label: "Self-Drive Mode",
    icon: Car,
    description:
      "Take full control of the drive. Ideal for independence, flexibility, and personal travel on your own schedule.",
    preview: "You’ll have full control of the vehicle during your rental.",
  },
  {
    id: "chauffeur",
    title: "Chauffeur-Driven",
    label: "Chauffeur Mode",
    icon: UserCheck,
    description:
      "Sit back and relax while an experienced driver takes care of the road — perfect for workdays, airport trips, or when you simply don’t want to drive.",
    preview: "A professional driver will be assigned to your booking.",
  },
] as const;

type DriveType = (typeof driveOptions)[number]["id"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.7,
    },
  },
};

export function DriveTypeSection() {
  const [selectedDriveType, setSelectedDriveType] = useState<DriveType>("self");

  const isChauffeur = selectedDriveType === "chauffeur";

  const selectedOption = driveOptions.find(
    (option) => option.id === selectedDriveType,
  )!;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50/40 py-20 md:py-32">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute right-8 top-8 h-28 w-28 rounded-full bg-[#5E9D34]/10 blur-2xl" />
      <div className="pointer-events-none absolute bottom-12 left-8 h-36 w-36 rounded-full bg-orange-400/10 blur-3xl" />

      <div
        className="pointer-events-none absolute right-10 top-10 h-24 w-24 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#E8722A 2px, transparent 2px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12"
        >
          {/* Left Content */}
          <motion.div variants={fadeUpVariants} className="lg:col-span-5">
            <span className="mb-4 inline-flex rounded-full border border-[#5E9D34]/20 bg-[#5E9D34]/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#5E9D34]">
              Choose How You Drive
            </span>

            <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
              Self-drive or chauffeur-driven — it&apos;s your call.
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              GO GAARI lets you choose how you want to travel. Whether you
              prefer the freedom of driving yourself or the ease of having a
              professional driver, the choice stays with you.
            </p>

            {/* Toggle Box */}
            <div className="mb-5 w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:w-fit">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Toggle
                    pressed={isChauffeur}
                    onPressedChange={(pressed) =>
                      setSelectedDriveType(pressed ? "chauffeur" : "self")
                    }
                    aria-label="Toggle chauffeur mode"
                    className="cursor-pointer border data-[state=on]:bg-[#5E9D34] data-[state=on]:text-white"
                  />

                  <span className="font-semibold text-gray-900">
                    {selectedOption.label}
                  </span>
                </div>

                <span className="text-sm text-gray-500">
                  Switch between driving options
                </span>
              </div>
            </div>

            {/* Selected Preview */}
            <motion.div
              key={selectedDriveType}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#5E9D34]/20 bg-[#5E9D34]/10 p-5"
            >
              <div className="flex gap-3">
                <CheckCircle
                  size={22}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-[#5E9D34]"
                />

                <p className="text-sm leading-relaxed text-gray-700">
                  <span className="font-semibold text-[#5E9D34]">
                    {selectedOption.title} selected:
                  </span>{" "}
                  {selectedOption.preview}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-7"
          >
            {driveOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedDriveType === option.id;

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  variants={fadeUpVariants}
                  onClick={() => setSelectedDriveType(option.id)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  aria-pressed={isSelected}
                  className={[
                    "group relative overflow-hidden rounded-3xl border-2 bg-white p-8 text-left transition-all duration-300",
                    isSelected
                      ? "border-[#5E9D34] shadow-xl shadow-[#5E9D34]/15"
                      : "border-transparent shadow-sm hover:border-[#5E9D34]/25 hover:shadow-lg",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "absolute inset-x-0 top-0 h-1.5 bg-orange-500 transition-opacity duration-300",
                      isSelected ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  />

                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={[
                        "flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                        isSelected
                          ? "bg-[#5E9D34] text-white"
                          : "bg-gradient-to-br from-green-50 to-green-100 text-[#5E9D34]",
                      ].join(" ")}
                    >
                      <Icon size={32} weight="duotone" />
                    </div>

                    <div
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300",
                        isSelected
                          ? "border-[#5E9D34] bg-[#5E9D34] text-white"
                          : "border-gray-200 text-transparent",
                      ].join(" ")}
                    >
                      <CheckCircle size={18} weight="fill" />
                    </div>
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    {option.title}
                  </h3>

                  <p className="leading-relaxed text-gray-600">
                    {option.description}
                  </p>

                  <div className="mt-8 text-sm font-semibold text-[#5E9D34]">
                    {isSelected ? "Currently selected" : "Select this option"}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
