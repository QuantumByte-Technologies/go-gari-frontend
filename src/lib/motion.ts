import type { Variants } from "framer-motion";

// ✅ Typed tuple so TS doesn't complain about easing
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const pageIn: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

export const cardIn: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};
