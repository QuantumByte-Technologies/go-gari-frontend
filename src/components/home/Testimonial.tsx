"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Star, Quotes } from "@phosphor-icons/react";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  type: string;
  initials: string;
  color: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rahim A.",
    location: "Dhaka",
    rating: 5,
    text: "Booking was seamless. The car was exactly as described, and the pricing had no surprises. Will definitely use GO GAARI again.",
    type: "Self-Drive",
    initials: "RA",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    name: "Fatima K.",
    location: "Chittagong",
    rating: 5,
    text: "The chauffeur was professional and punctual. Made our family trip to Cox's Bazar so much easier.",
    type: "Chauffeur",
    initials: "FK",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 3,
    name: "Tanvir H.",
    location: "Sylhet",
    rating: 4,
    text: "Best car rental experience in Bangladesh. Clean cars, fair prices, and the support team is always responsive.",
    type: "Self-Drive",
    initials: "TH",
    color: "bg-green-100 text-green-700",
  },
  {
    id: 4,
    name: "Nusrat J.",
    location: "Dhaka",
    rating: 5,
    text: "Booked a chauffeur-driven car for a family event. The driver was professional, punctual, and very courteous. Highly recommend!",
    type: "With Driver",
    initials: "NJ",
    color: "bg-orange-100 text-orange-700",
  },
];

// ✅ typed cubic-bezier tuple
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
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
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export default function TestimonialsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Header */}
          <motion.div className="lg:col-span-4 space-y-6" variants={fadeLeft}>
            <motion.div variants={fadeUp}>
              <p className="text-orange-400 font-semibold tracking-wide uppercase text-sm mb-2">
                What Our Riders Say
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Trusted by thousands across Bangladesh
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                Don&apos;t just take our word for it. Here&apos;s what our
                community has to say about their journeys.
              </p>

              {/* Rating card */}
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 inline-block relative overflow-hidden"
              >
                <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-orange-200/40 blur-2xl" />

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">4.8</span>
                  <div className="flex text-orange-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + s * 0.05, duration: 0.45 }}
                        className="inline-flex"
                      >
                        <Star size={20} weight="fill" />
                      </motion.span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-500 font-medium">
                  Based on 2,400+ reviews
                </p>

                {!reduce && (
                  <motion.div
                    className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-linear-to-r from-transparent via-orange-200/35 to-transparent"
                    initial={{ x: "-80%", opacity: 0 }}
                    whileHover={{ x: "260%", opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE_OUT }}
                  />
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Grid */}
          <div className="lg:col-span-8">
            <motion.div
              variants={container}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {testimonials.map((item) => (
                <motion.article
                  key={item.id}
                  variants={card}
                  whileHover={reduce ? undefined : { y: -6 }}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-orange-400 border-y border-r border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <motion.div
                    className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-orange-400 via-orange-200 to-transparent"
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: EASE_OUT }}
                  />

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${item.color}`}
                        whileHover={
                          reduce ? undefined : { rotate: -6, scale: 1.06 }
                        }
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 16,
                        }}
                      >
                        {item.initials}
                      </motion.div>

                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>
                    </div>

                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.05 * i, duration: 0.35 }}
                          className="inline-flex"
                        >
                          <Star
                            size={14}
                            weight="fill"
                            className={
                              i < item.rating
                                ? "text-orange-400"
                                : "text-gray-200"
                            }
                          />
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="relative mb-4">
                    <motion.div
                      aria-hidden
                      initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: EASE_OUT }}
                      className="absolute -top-2 -left-1 -z-10"
                    >
                      <Quotes
                        size={26}
                        weight="duotone"
                        className="text-orange-100"
                      />
                    </motion.div>

                    <p className="text-gray-600 text-sm leading-relaxed relative z-10 italic">
                      “{item.text}”
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {item.type}
                    </span>
                  </div>

                  <div className="pointer-events-none absolute -bottom-14 -right-14 h-32 w-32 rounded-full bg-orange-200/25 blur-3xl" />
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
