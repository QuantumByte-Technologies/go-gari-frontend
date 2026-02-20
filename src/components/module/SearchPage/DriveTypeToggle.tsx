"use client";

import React from "react";
import { CheckCircle, SteeringWheel, UserCircle } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  selfDrive: boolean;
  chauffeur: boolean;
  onToggleSelfDrive: () => void;
  onToggleChauffeur: () => void;
};

export default function DriveTypeToggle({
  selfDrive,
  chauffeur,
  onToggleSelfDrive,
  onToggleChauffeur,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={reduce ? undefined : { scale: 0.98 }}
        onClick={onToggleSelfDrive}
        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
          selfDrive
            ? "bg-[#5E9D34] text-white border-[#5E9D34] shadow-md shadow-[#5E9D34]/20"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
        }`}
      >
        <SteeringWheel size={20} weight={selfDrive ? "fill" : "duotone"} />
        Self-Drive
        {selfDrive && (
          <CheckCircle size={16} weight="fill" className="text-white/80" />
        )}
      </motion.button>

      <motion.button
        whileTap={reduce ? undefined : { scale: 0.98 }}
        onClick={onToggleChauffeur}
        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
          chauffeur
            ? "bg-[#5E9D34] text-white border-[#5E9D34] shadow-md shadow-[#5E9D34]/20"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
        }`}
      >
        <UserCircle size={20} weight={chauffeur ? "fill" : "duotone"} />
        Chauffeur
        {chauffeur && (
          <CheckCircle size={16} weight="fill" className="text-white/80" />
        )}
      </motion.button>
    </div>
  );
}
