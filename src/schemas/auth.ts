import { z } from "zod";

// ─── Login ───────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Register ────────────────────────────────────────────────────
export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    first_name: z.string().min(1, "First name is required").max(150),
    last_name: z.string().min(1, "Last name is required").max(150),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    password_confirm: z.string().min(1, "Please confirm your password"),
    dob: z.string().nullable().optional(),
    country: z.string().max(100).optional(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ["password_confirm"],
  });

// ─── OTP Verification ───────────────────────────────────────────
export const otpSchema = z.object({
  phone: z.string().min(10, "Phone number is required"),
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

// ─── Forgot Password ────────────────────────────────────────────
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ─── Reset Password ─────────────────────────────────────────────
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ["password_confirm"],
  });

// ─── Profile Update ─────────────────────────────────────────────
export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(150),
  last_name: z.string().min(1, "Last name is required").max(150),
  dob: z.string().nullable().optional(),
  country: z.string().max(100).optional(),
});

// ─── Inferred types for form usage ──────────────────────────────
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
