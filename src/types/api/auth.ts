// ─── Auth API types ──────────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────
export type VerificationStatus = "pending" | "approved" | "rejected";
export type UserType = "local" | "foreign";

// ── Request types ────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  dob?: string | null;
  country?: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface ResendOtpRequest {
  phone: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirm: string;
}

export interface ProfileUpdateRequest {
  first_name: string;
  last_name: string;
  dob?: string | null;
  country?: string;
}

// ── Response types ───────────────────────────────────────────────
export interface UserProfile {
  id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  dob: string | null;
  country: string;
  user_type: UserType;
  is_phone_verified: boolean;
  is_verified: boolean;
  verification_status: VerificationStatus;
  date_joined: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
  phone: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh: string;
}

export interface VerificationStatusResponse {
  is_phone_verified: boolean;
  is_verified: boolean;
  verification_status: VerificationStatus;
  documents: import("./documents").UserDocument[];
}
