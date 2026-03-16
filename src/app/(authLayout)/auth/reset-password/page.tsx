"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo/logo-up.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/schemas/auth";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import type { ApiError } from "@/types/api/common";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", password_confirm: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(data).unwrap();
    } catch (err) {
      const error = err as { data?: ApiError; status?: number };

      if (error.data?.token) {
        setError("root", {
          message: "This reset link is invalid or has expired. Please request a new one.",
        });
      } else if (error.data?.password) {
        setError("password", {
          message: Array.isArray(error.data.password)
            ? error.data.password[0]
            : error.data.password,
        });
      } else {
        setError("root", {
          message: error.data?.detail ?? "Failed to reset password. Please try again.",
        });
      }
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Invalid or missing reset token.
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-[#65aa36] hover:underline font-medium"
          >
            Request a new reset link
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

          {isSuccess ? (
            <SuccessState />
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-[#65aa36]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Reset Your Password
                </h1>
                <p className="text-gray-600 text-sm">
                  Enter your new password below.
                </p>
              </div>

              {/* Error */}
              {errors.root && (
                <motion.div
                  className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.root.message}</span>
                </motion.div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Hidden token field */}
                <input type="hidden" {...register("token")} />

                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#65aa36]" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      {...register("password")}
                      aria-invalid={!!errors.password}
                      className={`w-full pl-12 pr-12 py-3 bg-gray-50/80 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                        errors.password
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-[#65aa36]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-600 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="password_confirm"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#65aa36]" />
                    <input
                      id="password_confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      {...register("password_confirm")}
                      aria-invalid={!!errors.password_confirm}
                      className={`w-full pl-12 pr-12 py-3 bg-gray-50/80 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                        errors.password_confirm
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-[#65aa36]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-600 transition-colors"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirm && (
                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                      {errors.password_confirm.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#65aa36] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#5a982f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                          ease: "linear",
                        }}
                      />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SuccessState() {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-[#65aa36]" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Password Reset Successfully
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        Your password has been updated. You can now sign in with your new
        password.
      </p>
      <Link
        href="/auth/signin"
        className="inline-flex items-center gap-2 bg-[#65aa36] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#5a982f] transition-colors"
      >
        Go to Sign In
        <ArrowRight className="w-5 h-5" />
      </Link>
    </motion.div>
  );
}
