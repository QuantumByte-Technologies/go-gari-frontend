"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>

        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed. Please try again
          or use a different payment method.
        </p>

        <div className="space-y-3">
          {bookingId && (
            <Link
              href="/dashboard"
              className="block w-full bg-[#65AA36] text-white px-6 py-3 rounded-xl font-semibold hover:brightness-95 transition-all"
            >
              Retry Payment
            </Link>
          )}
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#65AA36] border-t-transparent rounded-full" />
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
