"use client";

import React from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
// import { EASE_OUT } from "@/lib/motion";

export default function ResultsHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="flex items-center justify-between mb-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort by:</span>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-sm font-medium">
          Recommended <span className="text-gray-400">▾</span>
        </button>
      </div>
    </motion.div>
  );
}
