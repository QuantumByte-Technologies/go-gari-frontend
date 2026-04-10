"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type City = {
  name: string;
  image: string;
  size: "large" | "normal" | "wide";
  tag?: string;
};

const cities: City[] = [
  {
    name: "Dhaka",
    image:
      "https://images.unsplash.com/photo-1662563013196-f71e724704aa?q=80&w=1329&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size: "large",
    tag: "Popular",
  },
  {
    name: "Sylhet",
    image:
      "https://plus.unsplash.com/premium_photo-1697730309688-cc2a3a573494?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size: "normal",
  },
  {
    name: "Chittagong",
    image:
      "https://images.unsplash.com/photo-1619713277018-c5499173232c?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size: "normal",
  },
  {
    name: "Cox's Bazar",
    image:
      "https://images.unsplash.com/photo-1665651147145-664ebda525e7?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size: "wide",
  },
];

// ✅ Typed cubic-bezier tuple (prevents "number[]" inference)
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const headerItem: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

export default function CitySection() {
  const router = useRouter();
  const reduce = useReducedMotion();

  return (
    <section className="py-20 md:py-32 bg-white">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mb-12">
          <motion.p
            variants={headerItem}
            className="text-sm font-semibold tracking-wider uppercase text-[#5E9D34] mb-4"
          >
            City
          </motion.p>

          <motion.h2
            variants={headerItem}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
          >
            Cities we cover
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-6 h-auto lg:h-150">
          {cities.map((city) => {
            let gridClass = "";
            if (city.size === "large")
              gridClass = "lg:col-span-2 lg:row-span-2";
            else if (city.size === "wide") gridClass = "lg:col-span-2";

            return (
              <motion.article
                key={city.name}
                variants={cardItem}
                whileHover={reduce ? undefined : { y: -6 }}
                whileTap={reduce ? undefined : { scale: 0.985 }}
                onClick={() => router.push(`/search-cars?city=${encodeURIComponent(city.name)}`)}
                className={[
                  "group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer",
                  "bg-gray-100",
                  gridClass,
                  city.size === "normal" ? "aspect-square lg:aspect-auto" : "",
                ].join(" ")}
              >
                <motion.img
                  src={city.image}
                  alt={city.name}
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  initial={false}
                  whileHover={reduce ? undefined : { scale: 1.08 }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                />

                <div className="absolute inset-0 bg-black/10" />
                <motion.div
                  className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent"
                  initial={{ opacity: 0.85 }}
                  whileHover={reduce ? undefined : { opacity: 1 }}
                  transition={{ duration: 0.35 }}
                />

                {city.tag && (
                  <motion.div
                    className="absolute top-6 left-6 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md"
                    initial={{ opacity: 0, scale: 0.9, y: -6 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
                  >
                    {city.tag}
                  </motion.div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold text-white transition-colors duration-300 group-hover:text-orange-400"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: EASE_OUT }}
                  >
                    {city.name}
                  </motion.h3>

                  <motion.div
                    className="h-1 w-12 bg-orange-500 mt-3 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={reduce ? undefined : { scaleX: 1 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                  />

                  {!reduce && (
                    <motion.div
                      className="pointer-events-none absolute -left-1/2 bottom-0 top-0 w-1/2 bg-linear-to-r from-transparent via-white/15 to-transparent rotate-12"
                      initial={{ x: "-80%", opacity: 0 }}
                      whileHover={{ x: "260%", opacity: 1 }}
                      transition={{ duration: 0.9, ease: EASE_OUT }}
                    />
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
