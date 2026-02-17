"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import logo from "@/assets/logo/logo-up.png";
import Image from "next/image";

// ✅ Cubic-bezier tuples (TypeScript-safe for strict Framer Motion typings)
const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];
const EASE_OUT: [number, number, number, number] = [0, 0, 0.58, 1];
const EASE_LINEAR: [number, number, number, number] = [0, 0, 1, 1];

// ✅ Variants typed to keep TS happy
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

const backgroundVariants: Variants = {
  animate: {
    opacity: [1, 0, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: EASE_IN_OUT,
    },
  },
};

const floatingShapeVariants: Variants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: EASE_IN_OUT,
    },
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated gradient backgrounds */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-green-50"
        variants={backgroundVariants}
        initial="animate"
        animate="animate"
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-green-50 via-white to-gray-100"
        variants={backgroundVariants}
        initial="animate"
        animate="animate"
        style={{ opacity: 0 }}
      />

      {/* Animated background blobs */}
      <AnimatedBackground />

      {/* Floating background shapes */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-green-100 rounded-full opacity-20 blur-3xl"
        variants={floatingShapeVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-32 left-10 w-48 h-48 bg-green-200 rounded-full opacity-20 blur-3xl"
        variants={floatingShapeVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      {/* Main card */}
      <motion.div
        className="relative w-full max-w-md z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
          variants={itemVariants}
        >
          <Link href={"/"} className="w-full">
            <Image src={logo} alt="logo" className="w-auto h-20 mx-auto my-5" />
          </Link>
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            {/* <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
              variants={itemVariants}
            >
              Login
            </motion.h1> */}
            <motion.p
              className="text-gray-600 text-2xl font-bold"
              variants={itemVariants}
            >
              Welcome back
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5 px-8 md:px-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Email/Phone Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Email or Phone Number
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#65aa36]" />
                <input
                  type="text"
                  placeholder="Enter your email or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:border-[#65aa36] focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#65aa36]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:border-[#65aa36] focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-[#65aa36] to-[#65aa36]/50 text-white font-bold py-3 px-6 rounded-xl mt-8 flex items-center justify-center gap-2 hover:shadow-lg hover:from-[#65aa36]/80 hover:to-[#65aa36]/30 disabled:opacity-70 transition-all duration-300 text-lg cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: EASE_LINEAR, // ✅ replaced "linear"
                    }}
                  />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-4 my-6 px-8 md:px-10"
            variants={itemVariants}
          >
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-sm text-gray-500 font-medium">or</span>
            <div className="h-px bg-gray-200 flex-1" />
          </motion.div>

          {/* Footer Links */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm pb-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/auth/signup"
              className="text-[#65aa36]/70 hover:text-[#65aa36] font-semibold transition-colors"
            >
              Create Account
            </Link>
            <span className="hidden sm:inline text-gray-300">•</span>
            <Link
              href="/auth/forgot-password"
              className="text-[#65aa36]/70 hover:text-[#65aa36] font-semibold transition-colors"
            >
              Forgot Password?
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl"
        animate={{
          x: [0, 40, -10, 0],
          y: [0, 20, -10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: EASE_IN_OUT, // ✅ replaced "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 -right-28 h-80 w-80 rounded-full bg-lime-300/25 blur-3xl"
        animate={{
          x: [0, -40, 10, 0],
          y: [0, -20, 10, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: EASE_IN_OUT,
        }}
      />
      <motion.div
        className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        animate={{
          x: [0, 25, -25, 0],
          y: [0, -20, 10, 0],
          scale: [1, 1.08, 0.98, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: EASE_IN_OUT,
        }}
      />
    </div>
  );
}
