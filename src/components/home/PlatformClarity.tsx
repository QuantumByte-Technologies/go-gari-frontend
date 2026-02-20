/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MapPinLine, Wallet, FileText, Headset } from "@phosphor-icons/react";

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
  image: string;
};

const features: Feature[] = [
  {
    icon: MapPinLine,
    title: "Cars monitored throughout the journey",
    description:
      "Each car is GPS-enabled, allowing trips to be monitored while in use.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    icon: Wallet,
    title: "Pricing that makes sense",
    description:
      "By operating as a platform, GO GAARI keeps costs more accessible than traditional car rentals.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    icon: FileText,
    title: "Designed to remove friction",
    description: "Documents, payments, and trip details are handled upfront.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    icon: Headset,
    title: "Help, when it matters",
    description:
      "Support is easy to reach and ready to assist whenever needed.",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
];

// ✅ typed cubic-bezier tuple
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: EASE_OUT },
  },
};

export default function PlatformClarity() {
  const reduce = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="platform-clarity" className="py-20 md:py-28 bg-gray-50">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.p
            variants={fadeUp}
            className="text-[#5E9D34] font-semibold text-sm tracking-wide uppercase mb-4"
          >
            Platform Clarity
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            More than just a listing
          </motion.h2>

          <motion.div variants={fadeUp} className="space-y-4">
            <p className="text-lg text-gray-600 leading-relaxed">
              GO GAARI is built as a complete car-rental platform — not a set of
              listings or brokers.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every booking follows a clear, consistent flow, designed to make
              renting a car feel straightforward and dependable.
            </p>
          </motion.div>
        </div>

        {/* Cards */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => {
            const isHovered = hoveredIndex === index;
            const isOrange = index % 2 !== 0;

            const hoverBg = isOrange ? "bg-orange-500" : "bg-[#5E9D34]";
            const hoverShadow = isOrange
              ? "shadow-orange-500/30"
              : "shadow-[#5E9D34]/30";
            const textHover = isOrange
              ? "group-hover:text-orange-500"
              : "group-hover:text-[#5E9D34]";
            const gradientFrom = isOrange
              ? "from-orange-500"
              : "from-[#5E9D34]";
            const gradientTo = isOrange ? "to-orange-400" : "to-[#7BC043]";

            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                variants={cardIn}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500 cursor-pointer outline-none"
                tabIndex={0}
                role="button"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    animate={
                      reduce ? undefined : { scale: isHovered ? 1.1 : 1 }
                    }
                    transition={{ duration: 0.75, ease: EASE_OUT }}
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* overlays */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent"
                    animate={{ opacity: isHovered ? 0.72 : 0.45 }}
                    transition={{ duration: 0.35 }}
                  />
                  <motion.div
                    className={`absolute inset-0 ${hoverBg}`}
                    animate={{ opacity: isHovered ? 0.18 : 0 }}
                    transition={{ duration: 0.35 }}
                  />

                  {/* icon */}
                  <motion.div
                    className="absolute bottom-4 left-6"
                    animate={
                      reduce
                        ? undefined
                        : {
                            y: isHovered ? -10 : 0,
                            scale: isHovered ? 1.08 : 1,
                          }
                    }
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  >
                    <div
                      className={[
                        "w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md transition-colors duration-300",
                        isHovered
                          ? `${hoverBg} shadow-lg ${hoverShadow}`
                          : "bg-white/20",
                      ].join(" ")}
                    >
                      <Icon size={28} weight="duotone" className="text-white" />
                    </div>
                  </motion.div>

                  {/* shine sweep */}
                  {!reduce && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-linear-to-r from-transparent via-white/15 to-transparent"
                      initial={{ x: "-80%", opacity: 0 }}
                      animate={
                        isHovered
                          ? { x: "260%", opacity: 1 }
                          : { x: "-80%", opacity: 0 }
                      }
                      transition={{ duration: 0.9, ease: EASE_OUT }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-6 pt-5">
                  <motion.h3
                    className={`text-xl font-bold text-gray-900 mb-3 ${textHover} transition-colors duration-300`}
                    animate={reduce ? undefined : { x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {feature.title}
                  </motion.h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    className={`h-0.5 bg-linear-to-r ${gradientFrom} ${gradientTo} mt-4 rounded-full origin-left`}
                    animate={reduce ? undefined : { scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>

                {/* focus ring */}
                <span className="absolute inset-0 rounded-3xl ring-0 ring-orange-400/30 group-focus:ring-4 transition-all" />
              </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
