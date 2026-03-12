"use client";

import { CheckCircle2, Mail, Phone, User } from "lucide-react";
import type { UserProfile } from "@/types/api/auth";

interface CustomerInfoProps {
  profile: UserProfile | null;
}

export function CustomerInfo({ profile }: CustomerInfoProps) {
  if (!profile) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Customer Information
        </h2>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase();
  const fullName = `${profile.first_name} ${profile.last_name}`.trim();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Customer Information
      </h2>

      <div className="bg-[#65AA36]/5 border border-[#65AA36]/20 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#65AA36] to-[#4a7d29] rounded-full flex items-center justify-center text-white font-bold text-lg">
          {initials || <User className="w-5 h-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-gray-900">{fullName || "—"}</p>
          <p className="text-sm text-gray-600 truncate">
            {profile.phone ?? "—"} {profile.email ? `\u2022 ${profile.email}` : ""}
          </p>
        </div>
        <CheckCircle2 className="w-5 h-5 text-[#65AA36] flex-shrink-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <InfoField
          icon={<User className="w-4 h-4 text-gray-400" />}
          label="Full Name"
          value={fullName}
        />
        <InfoField
          icon={<Mail className="w-4 h-4 text-gray-400" />}
          label="Email"
          value={profile.email}
        />
        <InfoField
          icon={<Phone className="w-4 h-4 text-gray-400" />}
          label="Phone"
          value={profile.phone ?? "—"}
        />
      </div>
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
        {icon}
        <span className="text-sm text-gray-900">{value}</span>
      </div>
    </div>
  );
}
