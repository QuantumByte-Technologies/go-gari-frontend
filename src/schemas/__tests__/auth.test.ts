import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  otpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileUpdateSchema,
} from "@/schemas/auth";

// ─── loginSchema ─────────────────────────────────────────────────
describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ─── registerSchema ──────────────────────────────────────────────
describe("registerSchema", () => {
  const validData = {
    email: "test@example.com",
    phone: "+8801712345678",
    first_name: "Test",
    last_name: "User",
    password: "Password123!",
    password_confirm: "Password123!",
  };

  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts with optional dob and country", () => {
    const result = registerSchema.safeParse({
      ...validData,
      dob: "1990-01-01",
      country: "Bangladesh",
    });
    expect(result.success).toBe(true);
  });

  it("accepts null dob", () => {
    const result = registerSchema.safeParse({
      ...validData,
      dob: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password_confirm: "DifferentPassword",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("password_confirm");
    }
  });

  it("rejects phone shorter than 10 characters", () => {
    const result = registerSchema.safeParse({
      ...validData,
      phone: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "short",
      password_confirm: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty first_name", () => {
    const result = registerSchema.safeParse({
      ...validData,
      first_name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty last_name", () => {
    const result = registerSchema.safeParse({
      ...validData,
      last_name: "",
    });
    expect(result.success).toBe(false);
  });
});

// ─── otpSchema ───────────────────────────────────────────────────
describe("otpSchema", () => {
  it("accepts valid OTP", () => {
    const result = otpSchema.safeParse({
      phone: "+8801712345678",
      code: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects OTP that is not exactly 6 digits", () => {
    const result = otpSchema.safeParse({
      phone: "+8801712345678",
      code: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects OTP with non-digit characters", () => {
    const result = otpSchema.safeParse({
      phone: "+8801712345678",
      code: "12345a",
    });
    expect(result.success).toBe(false);
  });

  it("rejects OTP longer than 6 digits", () => {
    const result = otpSchema.safeParse({
      phone: "+8801712345678",
      code: "1234567",
    });
    expect(result.success).toBe(false);
  });
});

// ─── forgotPasswordSchema ────────────────────────────────────────
describe("forgotPasswordSchema", () => {
  it("accepts valid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "user@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "not-email",
    });
    expect(result.success).toBe(false);
  });
});

// ─── resetPasswordSchema ─────────────────────────────────────────
describe("resetPasswordSchema", () => {
  it("accepts valid reset data", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123token",
      password: "NewPass123!",
      password_confirm: "NewPass123!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123token",
      password: "NewPass123!",
      password_confirm: "Different!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty token", () => {
    const result = resetPasswordSchema.safeParse({
      token: "",
      password: "NewPass123!",
      password_confirm: "NewPass123!",
    });
    expect(result.success).toBe(false);
  });
});

// ─── profileUpdateSchema ─────────────────────────────────────────
describe("profileUpdateSchema", () => {
  it("accepts valid profile data", () => {
    const result = profileUpdateSchema.safeParse({
      first_name: "John",
      last_name: "Doe",
    });
    expect(result.success).toBe(true);
  });

  it("accepts with optional fields", () => {
    const result = profileUpdateSchema.safeParse({
      first_name: "John",
      last_name: "Doe",
      dob: "1990-01-15",
      country: "Bangladesh",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty first_name", () => {
    const result = profileUpdateSchema.safeParse({
      first_name: "",
      last_name: "Doe",
    });
    expect(result.success).toBe(false);
  });

  it("rejects country longer than 100 characters", () => {
    const result = profileUpdateSchema.safeParse({
      first_name: "John",
      last_name: "Doe",
      country: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});
