"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/logo-up.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/schemas/auth";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import type { ApiError } from "@/types/api/common";

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading, isSuccess }] =
    useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data).unwrap();
    } catch (err) {
      const error = err as { data?: ApiError; status?: number };
      setError("root", {
        message:
          error.data?.detail ?? "Failed to send reset email. Please try again.",
      });
    }
  };

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
            <SuccessState email={getValues("email")} />
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#65aa36]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 text-sm">
                  Enter your email and we&apos;ll send you a link to reset your
                  password.
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
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#65aa36]" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                        errors.email
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-[#65aa36]"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

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
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          )}

          {/* Back link */}
          <div className="text-center mt-6">
            <Link
              href="/auth/signin"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SuccessState({ email }: { email: string }) {
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
      <p className="text-gray-600 text-sm mb-6">
        We&apos;ve sent a password reset link to{" "}
        <span className="font-semibold text-gray-800">{email}</span>. Please
        check your inbox and follow the instructions.
      </p>
      <p className="text-xs text-gray-500">
        Didn&apos;t receive the email? Check your spam folder or try again.
      </p>
    </motion.div>
  );
}
