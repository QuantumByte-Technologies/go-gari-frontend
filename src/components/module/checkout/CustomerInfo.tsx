// components/checkout/CustomerInfo.tsx
"use client";

// import { Input } from "@/components/ui/Input";
import type { FormData } from "@/types/checkout";
import { DEMO_USER } from "@/types/checkout";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Input } from "./Input";

interface CustomerInfoProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomerInfo({
  formData,
  errors,
  onChange,
}: CustomerInfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Customer Information
      </h2>

      <div className="bg-[#5E9D34]/5 border border-[#5E9D34]/20 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#5E9D34] to-[#4a7d29] rounded-full flex items-center justify-center text-white font-bold text-lg">
          {DEMO_USER.initials}
        </div>
        <div>
          <p className="font-bold text-gray-900">{DEMO_USER.fullName}</p>
          <p className="text-sm text-gray-600">
            {DEMO_USER.phone} • {DEMO_USER.email}
          </p>
        </div>
        <CheckCircle2 className="w-5 h-5 text-[#5E9D34] ml-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="md:col-span-2">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            error={errors.fullName}
            icon={<User className="w-4 h-4 text-gray-400" />}
            placeholder="John Doe"
            required
          />
        </div>

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
          icon={<Mail className="w-4 h-4 text-gray-400" />}
          placeholder="john@example.com"
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          error={errors.phone}
          icon={<Phone className="w-4 h-4 text-gray-400" />}
          placeholder="+880 1XXX-XXXXXX"
          required
        />

        <Input
          label="Driving License No."
          name="license"
          value={formData.license}
          onChange={onChange}
          error={errors.license}
          icon={<FileText className="w-4 h-4 text-gray-400" />}
          placeholder="DK-12345678"
          required
        />

        <Input
          label="License Expiry"
          name="expiry"
          type="date"
          value={formData.expiry}
          onChange={onChange}
          error={errors.expiry}
          icon={<Calendar className="w-4 h-4 text-gray-400" />}
          required
        />
      </div>
    </div>
  );
}
