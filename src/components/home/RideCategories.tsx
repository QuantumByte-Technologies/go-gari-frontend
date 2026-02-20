"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Tag } from "@phosphor-icons/react";

type Category = {
  title: string;
  description: string;
  image: string;
};

const categories: Category[] = [
  {
    title: "Sedans",
    description:
      "Comfortable and spacious, sedans are ideal for road trips with family or group outings where space and comfort matter.",
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Hatchbacks",
    description:
      "Compact, economical, and city-friendly. Hatchbacks are perfect for daily commutes and navigating busy streets.",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Luxury / Premium Cars",
    description:
      "For moments when the drive itself matters. Premium cars offer elevated comfort and refined interiors.",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "SUVs & Family Cars",
    description:
      "Designed for space, comfort, and versatility — perfect for family travel and longer trips.",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
];

// ✅ typed cubic-bezier tuple
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export default function RideCategories() {
  const reduce = useReducedMotion();

  return (
    <section className="py-20 bg-gray-50">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <motion.h2
            variants={fadeUp}
            className="text-[#5E9D34] font-semibold tracking-wide uppercase text-sm mb-2"
          >
            Choose Your Ride
          </motion.h2>

          <motion.h3
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            The right car for your kind of day
          </motion.h3>

          <motion.div
            variants={fadeUp}
            className="space-y-4 text-gray-600 text-lg"
          >
            <p>
              Whether you&apos;re traveling with family, heading out for a solo
              trip, or simply in the mood for a great drive, GO GAARI offers
              flexible car options to match every plan.
            </p>
            <p>
              From everyday city rides to premium experiences, choose from a
              wide range of well-maintained cars — clearly priced and ready when
              you are.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((c) => (
            <motion.article
              key={c.title}
              variants={card}
              whileHover={reduce ? undefined : { y: -8 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              className="group relative h-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 bg-gray-200"
            >
              {/* Image */}
              <motion.img
                src={c.image}
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                initial={false}
                whileHover={reduce ? undefined : { scale: 1.08 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              />

              {/* Overlays (crossfade) */}
              <motion.div
                className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent"
                initial={{ opacity: 0.92 }}
                whileHover={reduce ? undefined : { opacity: 0.05 }}
                transition={{ duration: 0.45 }}
              />
              <motion.div
                className="absolute inset-0 bg-linear-to-t from-orange-900/90 via-orange-900/35 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={reduce ? undefined : { opacity: 0.92 }}
                transition={{ duration: 0.45 }}
              />

              {/* Shine sweep */}
              {!reduce && (
                <motion.div
                  className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-linear-to-r from-transparent via-white/15 to-transparent"
                  initial={{ x: "-80%", opacity: 0 }}
                  whileHover={{ x: "260%", opacity: 1 }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                />
              )}

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="will-change-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.span
                      initial={false}
                      whileHover={
                        reduce ? undefined : { rotate: -8, scale: 1.05 }
                      }
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className="inline-flex"
                    >
                      <Tag
                        size={18}
                        weight="duotone"
                        className="text-orange-400 group-hover:text-white transition-colors"
                      />
                    </motion.span>

                    <h4 className="text-xl font-bold">{c.title}</h4>
                  </div>

                  {/* Description reveal */}
                  <p className="text-sm text-gray-200 leading-relaxed">
                    <span className="block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                      {c.description}
                    </span>
                  </p>

                  {/* Bottom accent line */}
                  <motion.div
                    className="mt-4 h-1 w-12 rounded-full bg-orange-500 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={reduce ? undefined : { scaleX: 1 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                  />
                </div>
              </div>

              {/* Border glow */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/25 transition-colors duration-300" />
            </motion.article>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div variants={fadeUp} className="mt-12 text-center">
          <p className="text-lg font-medium text-gray-900">
            Wherever you need to go, there&apos;s a{" "}
            <span className="text-orange-500 font-bold">gaari</span> for it.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
