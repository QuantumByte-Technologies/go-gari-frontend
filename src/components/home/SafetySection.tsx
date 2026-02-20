"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  CheckCircle,
  Camera,
  MapTrifold,
  PhoneCall,
} from "@phosphor-icons/react";

const features = [
  {
    icon: CheckCircle,
    text: "Verified cars & drivers — reviewed before every booking.",
  },
  {
    icon: Camera,
    text: "Trip photos for transparency — time-stamped at pickup and return.",
  },
  {
    icon: MapTrifold,
    text: "Live tracking & security — GPS-enabled throughout your journey.",
  },
  {
    icon: PhoneCall,
    text: "Always within reach — 24/7 support via call or WhatsApp.",
  },
] as const;

// ✅ typed cubic-bezier tuple (prevents "number[]" inference)
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

const featureItem: Variants = {
  hidden: { opacity: 0, x: -16, y: 8 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const imageCard: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_OUT },
  },
};

export default function SafetySection() {
  const reduce = useReducedMotion();

  return (
    <section className="py-20 bg-white">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-12 lg:p-16 relative overflow-hidden"
        >
          {/* Decorative accent */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#5E9D34] via-orange-400 to-[#5E9D34]"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          />

          {/* Soft background glow blobs */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-green-200/30 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left: Text */}
            <motion.div variants={fadeLeft}>
              <motion.h2
                variants={fadeUp}
                className="text-[#5E9D34] font-semibold tracking-wide uppercase text-sm mb-2"
              >
                Confidence & Safety
              </motion.h2>

              <motion.h3
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              >
                Built so you can feel confident
              </motion.h3>

              <motion.p
                variants={fadeUp}
                className="text-lg text-gray-600 mb-8 leading-relaxed"
              >
                Every part of GO GAARI is designed to remove uncertainty — so
                you can focus on the drive, not the details.
              </motion.p>

              {/* Feature list */}
              <motion.div variants={container} className="space-y-5">
                {features.map((f, index) => {
                  const isEven = index % 2 === 0;
                  const bgClass = isEven
                    ? "from-green-50 to-green-100"
                    : "from-orange-50 to-orange-100";
                  const iconColor = isEven
                    ? "text-[#5E9D34]"
                    : "text-orange-500";
                  const Icon = f.icon;

                  return (
                    <motion.div
                      key={f.text}
                      variants={featureItem}
                      whileHover={reduce ? undefined : { x: 6 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      }}
                      className="group flex items-start gap-4"
                    >
                      <motion.div
                        className={`relative shrink-0 w-10 h-10 rounded-full bg-linear-to-br ${bgClass} flex items-center justify-center mt-0.5 shadow-sm`}
                        whileHover={
                          reduce
                            ? undefined
                            : { scale: 1.08, rotate: isEven ? -6 : 6 }
                        }
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 16,
                        }}
                      >
                        <Icon
                          size={22}
                          weight="duotone"
                          className={iconColor}
                        />
                        <span className="absolute inset-0 rounded-full ring-0 ring-black/5 group-hover:ring-4 transition-all duration-300" />
                      </motion.div>

                      <div className="flex-1">
                        <p className="text-gray-800 font-medium leading-relaxed">
                          {f.text}
                        </p>

                        <motion.div
                          className={`mt-2 h-1 w-10 rounded-full ${
                            isEven ? "bg-[#5E9D34]" : "bg-orange-500"
                          } origin-left`}
                          initial={{ scaleX: 0 }}
                          whileHover={reduce ? undefined : { scaleX: 1 }}
                          transition={{ duration: 0.35, ease: EASE_OUT }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right: Image card */}
            <motion.div
              variants={imageCard}
              className="relative h-full min-h-80 rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
              whileHover={reduce ? undefined : { y: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                alt="Safe driving"
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                initial={false}
                whileHover={reduce ? undefined : { scale: 1.07 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              />

              <motion.div
                className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
                initial={{ opacity: 0.85 }}
                whileHover={reduce ? undefined : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="absolute inset-0 flex items-end p-8">
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
                  className="text-white text-xl font-medium leading-snug"
                >
                  Book in minutes, drive with confidence — we&apos;re with you
                  from start to finish.
                </motion.p>
              </div>

              {!reduce && (
                <motion.div
                  className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-linear-to-r from-transparent via-white/15 to-transparent"
                  initial={{ x: "-80%", opacity: 0 }}
                  whileHover={{ x: "260%", opacity: 1 }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                />
              )}

              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 hover:ring-white/25 transition-colors duration-300" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
