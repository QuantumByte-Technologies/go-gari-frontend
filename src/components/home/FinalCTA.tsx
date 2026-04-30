"use client";

import React, { useCallback, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, DownloadSimple, X } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

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
  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleNavigateToSearch = useCallback(() => {
    router.push("/search-cars");
  }, [router]);

  const handleDownloadClick = useCallback(() => {
    setShowComingSoon(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#1a1a1a] py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]" />

      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute left-[-5%] top-[-10%] h-[30%] w-[30%] rounded-full bg-[#5E9D34] opacity-20 blur-[120px]"
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
          className="absolute bottom-[-10%] right-[-5%] h-[30%] w-[30%] rounded-full bg-orange-500 opacity-20 blur-[120px]"
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
        className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-3xl">
          <motion.h2
            variants={fadeUp}
            className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
          >
            Ready to hit the road?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mb-10 text-xl leading-relaxed text-gray-400"
          >
            Join thousands of riders who trust GO GAARI for their journeys
            across Bangladesh.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div
              whileHover={reduce ? undefined : { y: -3 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={handleNavigateToSearch}
                className="w-full cursor-pointer border-none bg-[#5E9D34] text-white hover:bg-[#4d822b] sm:w-auto"
              >
                <span className="inline-flex items-center gap-2">
                  Find Cars Near You
                  <ArrowRight size={20} weight="bold" />
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
                type="button"
                variant="outline"
                onClick={handleDownloadClick}
                className="w-full cursor-pointer border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white sm:w-auto"
              >
                <span className="inline-flex items-center gap-2">
                  <DownloadSimple size={20} weight="bold" />
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

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />

      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComingSoon(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white p-6 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowComingSoon(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close popup"
              >
                <X size={20} weight="bold" />
              </button>

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                <DownloadSimple size={32} />
              </div>

              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Coming Soon!
              </h3>

              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                Our GO GAARI mobile app is launching soon. Stay tuned for the
                official release.
              </p>

              <Button
                type="button"
                onClick={() => setShowComingSoon(false)}
                className="w-full bg-[#5E9D34] text-white hover:bg-[#4d822b] cursor-pointer"
              >
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
