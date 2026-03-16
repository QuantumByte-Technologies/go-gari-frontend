"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, RotateCcw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo/logo-up.png";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/redux/api/authApi";
import type { ApiError } from "@/types/api/common";
import { toast } from "sonner";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const otpValue = otp.join("");
  const isOtpComplete = otpValue.length === OTP_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpComplete || !phone) return;

    try {
      await verifyOtp({ phone, otp: otpValue }).unwrap();
      toast.success("Phone number verified successfully!");
      router.push("/auth/signin");
    } catch (err) {
      const error = err as { data?: ApiError; status?: number };
      setError(
        error.data?.detail ?? "Invalid or expired OTP. Please try again.",
      );
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !phone) return;

    try {
      await resendOtp({ phone }).unwrap();
      toast.success("OTP sent successfully!");
      setCountdown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      const error = err as { data?: ApiError; status?: number };
      toast.error(error.data?.detail ?? "Failed to resend OTP.");
    }
  };

  if (!phone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-gray-600">No phone number provided.</p>
          <Link
            href="/auth/signup"
            className="text-[#65aa36] hover:underline font-medium"
          >
            Go back to sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-gray-100 via-white to-green-50">
      <motion.div
        className="relative w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8">
          <Link href={"/"} className="w-full">
            <Image
              src={logo}
              alt="logo"
              className="w-auto h-16 mx-auto mb-6"
            />
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-[#65aa36]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Phone
            </h1>
            <p className="text-gray-600 text-sm">
              We&apos;ve sent a {OTP_LENGTH}-digit code to{" "}
              <span className="font-semibold text-gray-800">{phone}</span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* OTP Input */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  aria-label={`OTP digit ${index + 1}`}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                    error
                      ? "border-red-300 focus:border-red-500"
                      : digit
                        ? "border-[#65aa36] bg-green-50/50"
                        : "border-gray-200 focus:border-[#65aa36]"
                  }`}
                />
              ))}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!isOtpComplete || isVerifying}
              className="w-full bg-[#65aa36] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#5a982f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: isOtpComplete ? 1.02 : 1 }}
              whileTap={{ scale: isOtpComplete ? 0.98 : 1 }}
            >
              {isVerifying ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 mb-2">
              Didn&apos;t receive the code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isResending}
              className="text-sm font-semibold text-[#65aa36] hover:text-[#5a982f] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </div>

          {/* Back link */}
          <div className="text-center mt-4">
            <Link
              href="/auth/signup"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
