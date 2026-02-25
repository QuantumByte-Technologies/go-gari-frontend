/* eslint-disable @typescript-eslint/no-explicit-any */
// components/checkout/InsuranceSelector.tsx
"use client";

import { Shield, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { InsurancePlan } from "@/types/checkout";

interface InsuranceSelectorProps {
  insurancePlan: InsurancePlan;
  totalDays: number;
  onPlanChange: (plan: InsurancePlan) => void;
  insuranceFee: number;
  premiumFee: number;
}

export function InsuranceSelector({
  insurancePlan,
  totalDays,
  onPlanChange,
  insuranceFee,
  premiumFee,
}: InsuranceSelectorProps) {
  return (
    <>
      <div className="mb-6 pb-6 border-b border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#5E9D34]" />
          Insurance Coverage
        </label>
        <div className="space-y-2.5">
          {/* Basic - Included */}
          <InsuranceOption
            type="basic"
            selected={insurancePlan === "basic"}
            title="Basic Coverage"
            badge="Included"
            badgeColor="text-[#5E9D34] bg-[#5E9D34]/10"
            description="Third-party liability, basic collision damage waiver. ৳50,000 deductible applies."
            onClick={() => onPlanChange("basic")}
          />

          {/* Premium - Add-on */}
          <InsuranceOption
            type="premium"
            selected={insurancePlan === "premium"}
            title="Premium Coverage"
            badge={`+$${premiumFee.toFixed(2)}/day`}
            badgeColor="text-gray-700"
            description="Full collision & theft protection, zero deductible, roadside assistance, personal accident cover."
            tags={[
              "Zero Deductible",
              "Theft Protection",
              "Roadside Assist",
              "Personal Accident",
            ]}
            onClick={() => onPlanChange("premium")}
          />
        </div>
      </div>

      {/* Cancellation Policy */}
      <CancellationPolicy />
    </>
  );
}

function InsuranceOption({
  type,
  selected,
  title,
  badge,
  badgeColor,
  description,
  tags,
  onClick,
}: any) {
  return (
    <div
      onClick={onClick}
      className={`relative border rounded-xl p-3.5 cursor-pointer transition-all ${
        selected
          ? "border-[#5E9D34] bg-[#5E9D34]/5"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            selected ? "border-[#5E9D34]" : "border-gray-300"
          }`}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-[#5E9D34]" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-sm font-semibold text-gray-900">{title}</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}
            >
              {badge}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
          {tags && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CancellationPolicy() {
  return (
    <div className="mb-6 pb-6 border-b border-gray-100">
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        Cancellation Policy
      </label>
      <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 space-y-2.5">
        <PolicyItem
          icon={<CheckCircle2 className="w-3 h-3 text-green-600" />}
          bgColor="bg-green-100"
          title="Free cancellation"
          description="Up to 48 hours before pickup — full refund"
        />
        <PolicyItem
          icon={<Clock className="w-3 h-3 text-amber-600" />}
          bgColor="bg-amber-100"
          title="24–48 hours before pickup"
          description="50% refund of total booking amount"
        />
        <PolicyItem
          icon={<AlertCircle className="w-3 h-3 text-red-500" />}
          bgColor="bg-red-100"
          title="Less than 24 hours"
          description="No refund — full charge applies"
        />
      </div>
    </div>
  );
}

function PolicyItem({ icon, bgColor, title, description }: any) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={`w-5 h-5 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-900">{title}</p>
        <p className="text-[11px] text-gray-500">{description}</p>
      </div>
    </div>
  );
}
