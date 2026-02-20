"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, DownloadSimple } from "@phosphor-icons/react";
import { Button } from "../ui/button";

// ✅ typed cubic-bezier tuple so TS won't treat it as number[]
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE_OUT },
  },
};

export default function FinalCTA() {
  const reduce = useReducedMotion();

  return (
    <section className="relative py-24 overflow-hidden bg-[#1a1a1a]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          aria-hidden
          className="absolute top-[-10%] left-[-5%] w-[30%] h-[30%] bg-[#5E9D34] rounded-full blur-[120px] opacity-20"
          animate={
            reduce
              ? undefined
              : { x: [0, 18, 0], y: [0, -10, 0], scale: [1, 1.06, 1] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 9, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.div
          aria-hidden
          className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-orange-500 rounded-full blur-[120px] opacity-20"
          animate={
            reduce
              ? undefined
              : { x: [0, -18, 0], y: [0, 10, 0], scale: [1, 1.06, 1] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }
        />

        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
            animate={{ backgroundPosition: ["0px 0px", "44px 44px"] }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Ready to hit the road?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-xl text-gray-400 mb-10 leading-relaxed"
          >
            Join thousands of riders who trust GO GAARI for their journeys
            across Bangladesh.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={reduce ? undefined : { y: -3 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto bg-[#5E9D34] hover:bg-[#4d822b] text-white border-none">
                <span className="inline-flex items-center gap-2">
                  Find Cars Near You
                  <motion.span
                    className="inline-flex"
                    initial={false}
                    whileHover={reduce ? undefined : { x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  >
                    <ArrowRight size={20} weight="bold" />
                  </motion.span>
                </span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={reduce ? undefined : { y: -3 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <motion.span
                    className="inline-flex"
                    initial={false}
                    whileHover={
                      reduce ? undefined : { rotate: -10, scale: 1.03 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <DownloadSimple size={20} weight="bold" />
                  </motion.span>
                  Download App
                </span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-8 text-sm text-gray-500">
            No hidden fees • Verified cars • 24/7 support
          </motion.p>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black/25 to-transparent" />
    </section>
  );
}
