"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo/logo-up.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/schemas/auth";
import { useRegisterMutation } from "@/redux/api/authApi";
import type { ApiError } from "@/types/api/common";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      phone: "",
      first_name: "",
      last_name: "",
      password: "",
      password_confirm: "",
      dob: undefined,
      country: "Bangladesh",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreeTerms) return;

    try {
      const result = await registerUser(data).unwrap();
      toast.success("Account created! Please verify your phone number.");
      // Navigate to OTP verification with the phone number
      router.push(`/auth/verify-otp?phone=${encodeURIComponent(data.phone)}`);
    } catch (err) {
      const error = err as { data?: ApiError; status?: number };

      if (error.data) {
        // Map field-level API errors to form fields
        const fieldMap: Record<string, keyof RegisterFormData> = {
          email: "email",
          phone: "phone",
          first_name: "first_name",
          last_name: "last_name",
          password: "password",
          password_confirm: "password_confirm",
        };

        let hasFieldError = false;
        for (const [apiField, formField] of Object.entries(fieldMap)) {
          if (error.data[apiField]) {
            const msg = Array.isArray(error.data[apiField])
              ? (error.data[apiField] as string[])[0]
              : (error.data[apiField] as string);
            setError(formField, { message: msg });
            hasFieldError = true;
          }
        }

        if (!hasFieldError) {
          setError("root", {
            message:
              error.data.detail || "Registration failed. Please try again.",
          });
        }
      } else {
        setError("root", {
          message: "Something went wrong. Please try again.",
        });
      }
    }
  };

  // Smooth "push" transition between steps
  const stepVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 sm:py-12">
      {/* Animated background blobs */}
      <AnimatedBackground />

      <div
        className="
          relative z-10
          [--primary:142_71%_45%]
          [--primary-foreground:0_0%_100%]
          [--ring:142_71%_45%]
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur rounded-xl shadow-lg border"
        >
          <Link href={"/"} className="w-full">
            <Image src={logo} alt="logo" className="w-auto h-20 mx-auto my-5" />
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Join GO GAARI to start your journey today
            </p>
          </div>

          {/* API / root error */}
          {errors.root && (
            <motion.div
              className="mx-8 mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.root.message}</span>
            </motion.div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 px-8"
            noValidate
          >
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Personal Information Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-[#65aa36]" />
                  <h2 className="text-lg font-bold text-foreground">
                    Personal Information
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="first_name"
                        className="text-sm font-medium mb-2"
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="first_name"
                          type="text"
                          placeholder="John"
                          {...register("first_name")}
                          aria-invalid={!!errors.first_name}
                          className={`pl-10 h-11 ${errors.first_name ? "border-red-400" : ""}`}
                        />
                      </div>
                      {errors.first_name && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="last_name"
                        className="text-sm font-medium mb-2"
                      >
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="last_name"
                          type="text"
                          placeholder="Doe"
                          {...register("last_name")}
                          aria-invalid={!!errors.last_name}
                          className={`pl-10 h-11 ${errors.last_name ? "border-red-400" : ""}`}
                        />
                      </div>
                      {errors.last_name && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium mb-2"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register("email")}
                          aria-invalid={!!errors.email}
                          className={`pl-10 h-11 ${errors.email ? "border-red-400" : ""}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium mb-2"
                      >
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+880 1XXX-XXXXXX"
                          {...register("phone")}
                          aria-invalid={!!errors.phone}
                          className={`pl-10 h-11 ${errors.phone ? "border-red-400" : ""}`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth and Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="dob"
                        className="text-sm font-medium mb-2"
                      >
                        Date of Birth{" "}
                        <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="dob"
                          type="date"
                          {...register("dob")}
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="country"
                        className="text-sm font-medium mb-2"
                      >
                        Country{" "}
                        <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="Bangladesh"
                        {...register("country")}
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium mb-2"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          {...register("password")}
                          aria-invalid={!!errors.password}
                          className={`pl-10 pr-10 h-11 ${errors.password ? "border-red-400" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-600 transition-colors"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="password_confirm"
                        className="text-sm font-medium mb-2"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password_confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          {...register("password_confirm")}
                          aria-invalid={!!errors.password_confirm}
                          className={`pl-10 pr-10 h-11 ${errors.password_confirm ? "border-red-400" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-600 transition-colors"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.password_confirm && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.password_confirm.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3"
              >
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) =>
                    setAgreeTerms(checked as boolean)
                  }
                  className="mt-1 data-[state=checked]:bg-[#65aa36] data-[state=checked]:border-[#65aa36] cursor-pointer"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-foreground cursor-pointer"
                >
                  <p>
                    I confirm that the information provided is accurate and I
                    agree to the{" "}
                    <Link
                      href={"#"}
                      className="text-[#65aa36] hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="text-[#65aa36] hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </Label>
              </motion.div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={!agreeTerms || isLoading}
                    className="h-11 bg-[#65aa36] hover:bg-[#65aa36]/90 text-[hsl(var(--primary-foreground))] font-semibold cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Helper */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground pb-4">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-[#65aa36] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
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
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 -right-28 h-80 w-80 rounded-full bg-lime-300/25 blur-3xl"
        animate={{
          x: [0, -40, 10, 0],
          y: [0, -20, 10, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        animate={{
          x: [0, 25, -25, 0],
          y: [0, -20, 10, 0],
          scale: [1, 1.08, 0.98, 1],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
