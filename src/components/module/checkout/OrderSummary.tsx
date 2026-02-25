/* eslint-disable @typescript-eslint/no-explicit-any */
// components/checkout/OrderSummary.tsx
"use client";

import { Shield, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";
// import { Button } from "@/components/ui/Button";

interface OrderSummaryProps {
  subtotal: number;
  totalDays: number;
  isSelfDrive: boolean;
  selfDriveDiscount: number;
  insuranceFee: number;
  insurancePlan: "basic" | "premium";
  premiumInsuranceFee: number;
  total: number;
  termsAccepted: boolean;
  onTermsToggle: () => void;
  onSubmit: () => void;
}

export function OrderSummary({
  subtotal,
  totalDays,
  isSelfDrive,
  selfDriveDiscount,
  insuranceFee,
  insurancePlan,
  premiumInsuranceFee,
  total,
  termsAccepted,
  onTermsToggle,
  onSubmit,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>

      <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
        <PriceRow label="Daily rate" value={subtotal} />
        {isSelfDrive && (
          <PriceRow
            label="Self-drive discount"
            value={-(selfDriveDiscount * totalDays)}
            className="text-[#5E9D34]"
          />
        )}
        <PriceRow label="Basic Insurance & Fees" value={insuranceFee} />
        {insurancePlan === "premium" && (
          <PriceRow
            label={`Premium Coverage (${totalDays}d)`}
            value={premiumInsuranceFee * totalDays}
          />
        )}
      </div>

      <div className="flex justify-between items-end mb-6">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-3xl font-bold text-[#5E9D34]">
          ${total.toFixed(2)}
        </span>
      </div>

      <TermsCheckbox checked={termsAccepted} onToggle={onTermsToggle} />

      <Button
        className="w-full mb-4"
        size="lg"
        onClick={onSubmit}
        disabled={!termsAccepted}
      >
        Complete Booking
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" /> SSL Secure
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Money-back guarantee
        </span>
      </div>
    </div>
  );
}

function PriceRow({ label, value, className }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium text-gray-900 ${className || ""}`}>
        {value < 0 ? `-$${Math.abs(value).toFixed(2)}` : `$${value.toFixed(2)}`}
      </span>
    </div>
  );
}

function TermsCheckbox({ checked, onToggle }: any) {
  return (
    <div className="flex items-start gap-2 mb-6">
      <div
        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
          checked ? "bg-[#5E9D34] border-[#5E9D34]" : "border-gray-300"
        }`}
        onClick={onToggle}
      >
        {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
      </div>
      <p className="text-xs text-gray-600 leading-tight">
        I agree to the{" "}
        <span className="text-[#5E9D34] underline cursor-pointer">
          Terms and Conditions
        </span>{" "}
        and{" "}
        <span className="text-[#5E9D34] underline cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>
    </div>
  );
}
