/* eslint-disable @typescript-eslint/no-explicit-any */
// components/checkout/PaymentMethod.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Lock } from "lucide-react";
// import { Input } from "@/components/ui/Input";
import type {
  PaymentMethod as PaymentMethodType,
  WalletProvider,
  FormData,
} from "@/types/checkout";
import { Input } from "./Input";

interface PaymentMethodProps {
  paymentMethod: PaymentMethodType;
  walletProvider: WalletProvider;
  formData: FormData;
  errors: Record<string, string>;
  onPaymentMethodChange: (method: PaymentMethodType) => void;
  onWalletProviderChange: (provider: WalletProvider) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PaymentMethod({
  paymentMethod,
  walletProvider,
  formData,
  errors,
  onPaymentMethodChange,
  onWalletProviderChange,
  onInputChange,
}: PaymentMethodProps) {
  const walletProviders: WalletProvider[] = ["bkash", "nagad", "rocket"];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <Lock className="w-3 h-3" />
          Secure Payment
        </div>
      </div>

      <div className="space-y-4">
        {/* Mobile Wallet Option */}
        <PaymentOption
          type="wallet"
          selected={paymentMethod === "wallet"}
          icon={<Smartphone className="w-5 h-5 text-gray-700" />}
          label="Mobile Wallet"
          badges={[
            { text: "bKash", bg: "bg-pink-600" },
            { text: "Nagad", bg: "bg-orange-500" },
          ]}
          onClick={() => onPaymentMethodChange("wallet")}
        >
          {paymentMethod === "wallet" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pl-8 space-y-4"
            >
              <div className="flex gap-4">
                {walletProviders.map((provider) => (
                  <button
                    key={provider}
                    onClick={(e) => {
                      e.stopPropagation();
                      onWalletProviderChange(provider);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      walletProvider === provider
                        ? "bg-[#5E9D34] text-white border-[#5E9D34]"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {provider}
                  </button>
                ))}
              </div>

              <Input
                label={`${walletProvider.charAt(0).toUpperCase() + walletProvider.slice(1)} Number`}
                name="walletNumber"
                value={formData.walletNumber}
                onChange={onInputChange}
                error={errors.walletNumber}
                placeholder="01XXX-XXXXXX"
              />
            </motion.div>
          )}
        </PaymentOption>

        {/* Card Option */}
        <PaymentOption
          type="card"
          selected={paymentMethod === "card"}
          icon={<CreditCard className="w-5 h-5 text-gray-700" />}
          label="Credit / Debit Card"
          badges={[
            { text: "VISA", bg: "bg-blue-600" },
            { text: "MC", bg: "bg-red-500" },
          ]}
          onClick={() => onPaymentMethodChange("card")}
        >
          {paymentMethod === "card" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pl-8 grid grid-cols-2 gap-4"
            >
              <div className="col-span-2">
                <Input
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={onInputChange}
                  error={errors.cardNumber}
                  placeholder="0000 0000 0000 0000"
                />
              </div>

              <Input
                label="Expiry Date"
                name="cardExpiry"
                value={formData.cardExpiry}
                onChange={onInputChange}
                error={errors.cardExpiry}
                placeholder="MM/YY"
              />

              <Input
                label="CVV"
                name="cardCvv"
                value={formData.cardCvv}
                onChange={onInputChange}
                error={errors.cardCvv}
                placeholder="123"
              />

              <div className="col-span-2">
                <Input
                  label="Cardholder Name"
                  name="cardName"
                  value={formData.cardName}
                  onChange={onInputChange}
                  error={errors.cardName}
                  placeholder="John Doe"
                />
              </div>
            </motion.div>
          )}
        </PaymentOption>
      </div>
    </div>
  );
}

// Helper component for payment options
function PaymentOption({
  type,
  selected,
  icon,
  label,
  badges,
  onClick,
  children,
}: any) {
  return (
    <div
      className={`border rounded-xl p-4 cursor-pointer transition-all ${
        selected
          ? "border-[#5E9D34] bg-green-50/30"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            selected ? "border-[#5E9D34]" : "border-gray-300"
          }`}
        >
          {selected && <div className="w-3 h-3 rounded-full bg-[#5E9D34]" />}
        </div>
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-gray-900">{label}</span>
        </div>
        <div className="flex gap-2 ml-auto">
          {badges.map((badge: any, index: number) => (
            <div
              key={index}
              className={`w-8 h-5 ${badge.bg} rounded text-[8px] text-white flex items-center justify-center`}
            >
              {badge.text}
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
