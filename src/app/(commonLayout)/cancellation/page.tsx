"use client";

import Link from "next/link";

const refundTiers = [
  {
    timeframe: "48+ hours before pickup",
    refund: "100%",
    description: "Full refund to your original payment method",
    highlight: true,
  },
  {
    timeframe: "24–48 hours before pickup",
    refund: "50%",
    description: "Half of the booking amount refunded",
    highlight: false,
  },
  {
    timeframe: "Less than 24 hours",
    refund: "0%",
    description: "No refund — booking amount is non-refundable",
    highlight: false,
  },
  {
    timeframe: "No-show",
    refund: "0%",
    description: "Full charge applies if you fail to pick up the vehicle",
    highlight: false,
  },
];

const additionalPolicies = [
  {
    title: "How to Cancel",
    content:
      "You can cancel your booking from the My Bookings section in your dashboard. Select the booking you wish to cancel and confirm the cancellation. You will receive a confirmation email once the cancellation is processed.",
  },
  {
    title: "Booking Modifications",
    content:
      "You may modify your booking (dates, pickup location, or vehicle) up to 24 hours before the scheduled pickup time, subject to availability. Modifications that result in a lower fare will be refunded as per the tiers above. Modifications that result in a higher fare will require additional payment at the time of change.",
  },
  {
    title: "Early Returns",
    content:
      "If you return the vehicle earlier than the scheduled drop-off time, the remaining unused rental period is non-refundable. The original booking amount stands regardless of early return.",
  },
  {
    title: "Refund Processing",
    content:
      "All eligible refunds are processed through SSLCommerz to your original payment method. Refunds typically take 5–7 business days to reflect in your account, depending on your bank or payment provider.",
  },
  {
    title: "Force Majeure",
    content:
      "In cases of natural disasters, government-imposed restrictions, or other extraordinary circumstances beyond your control, GO GAARI may offer a full refund or reschedule at no extra charge, assessed on a case-by-case basis.",
  },
];

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Cancellation Policy
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Last updated: 1 March 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-gray-700 leading-relaxed mb-8">
          We understand that plans can change. Below is our cancellation and
          refund policy for bookings made on GO GAARI. Please review these
          terms before making a booking.
        </p>

        {/* Refund Tiers */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            Refund Schedule
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {refundTiers.map((tier, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-xl border border-gray-200 p-5 overflow-hidden"
              >
                {tier.highlight && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: "#65AA36" }}
                  />
                )}
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {tier.timeframe}
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: tier.refund === "0%" ? "#EF4444" : "#65AA36",
                    }}
                  >
                    {tier.refund}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Table */}
        <div className="mb-10 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 px-6 py-4 border-b border-gray-200">
            Quick Reference
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cancellation Window
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Refund
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Processing Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    48+ hours before pickup
                  </td>
                  <td
                    className="px-6 py-3 text-sm font-semibold"
                    style={{ color: "#65AA36" }}
                  >
                    100% refund
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    5–7 business days
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    24–48 hours before pickup
                  </td>
                  <td
                    className="px-6 py-3 text-sm font-semibold"
                    style={{ color: "#E8722A" }}
                  >
                    50% refund
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    5–7 business days
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    Less than 24 hours / No-show
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-red-500">
                    No refund
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Policies */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Additional Information
          </h2>
          {additionalPolicies.map((policy, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#65AA36" }}
                />
                {policy.title}
              </h3>
              <p className="text-gray-600 leading-relaxed pl-4">
                {policy.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            Have questions about a cancellation?{" "}
            <Link
              href="/support"
              className="font-medium underline hover:no-underline"
              style={{ color: "#65AA36" }}
            >
              Contact our support team
            </Link>
            . Also see our{" "}
            <Link
              href="/terms"
              className="font-medium underline hover:no-underline"
              style={{ color: "#65AA36" }}
            >
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
