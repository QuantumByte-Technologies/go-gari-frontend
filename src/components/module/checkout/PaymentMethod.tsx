"use client";

import { CreditCard, Smartphone, Lock } from "lucide-react";

/**
 * PaymentMethod component — simplified for SSLCommerz integration.
 *
 * Since SSLCommerz handles all payment method selection and details on their
 * own gateway page, this component is now informational only. It shows the
 * available payment methods that SSLCommerz supports in Bangladesh.
 */
export function PaymentMethod() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <Lock className="w-3 h-3" />
          Secure Payment
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        You will be redirected to SSLCommerz to complete your payment securely.
        The following payment methods are supported:
      </p>

      <div className="space-y-3">
        {/* Mobile Wallets */}
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
          <Smartphone className="w-5 h-5 text-gray-700" />
          <div className="flex-1">
            <span className="font-semibold text-gray-900 text-sm">
              Mobile Wallet
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-auto px-2 h-5 bg-pink-600 rounded text-[8px] text-white flex items-center justify-center">
              bKash
            </span>
            <span className="w-auto px-2 h-5 bg-orange-500 rounded text-[8px] text-white flex items-center justify-center">
              Nagad
            </span>
            <span className="w-auto px-2 h-5 bg-purple-600 rounded text-[8px] text-white flex items-center justify-center">
              Rocket
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
          <CreditCard className="w-5 h-5 text-gray-700" />
          <div className="flex-1">
            <span className="font-semibold text-gray-900 text-sm">
              Credit / Debit Card
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-8 h-5 bg-blue-600 rounded text-[8px] text-white flex items-center justify-center">
              VISA
            </span>
            <span className="w-8 h-5 bg-red-500 rounded text-[8px] text-white flex items-center justify-center">
              MC
            </span>
          </div>
        </div>

        {/* Internet Banking */}
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
          <Lock className="w-5 h-5 text-gray-700" />
          <div className="flex-1">
            <span className="font-semibold text-gray-900 text-sm">
              Internet Banking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
