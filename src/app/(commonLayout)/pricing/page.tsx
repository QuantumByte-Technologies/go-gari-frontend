"use client";

import React from "react";
import Link from "next/link";
import { Check } from "@phosphor-icons/react";

const tiers = [
  {
    name: "Economy",
    description: "Compact cars for daily commutes and city driving.",
    price: "3,500",
    examples: "Toyota Axio, Suzuki Swift, Honda Fit",
    features: [
      "Air conditioning",
      "Unlimited mileage within city",
      "Basic insurance included",
      "Free cancellation (24h notice)",
    ],
  },
  {
    name: "Premium",
    description: "Comfortable sedans for business and family trips.",
    price: "6,000",
    examples: "Toyota Allion, Honda Civic, Nissan Bluebird",
    popular: true,
    features: [
      "Everything in Economy",
      "Premium interior & comfort",
      "Unlimited mileage",
      "Priority roadside assistance",
    ],
  },
  {
    name: "SUV",
    description: "Spacious SUVs for group travel and long-distance trips.",
    price: "9,000",
    examples: "Toyota Land Cruiser Prado, Mitsubishi Pajero",
    features: [
      "Everything in Premium",
      "Seats up to 7 passengers",
      "Ideal for highways & rural roads",
      "Extra luggage capacity",
    ],
  },
  {
    name: "Luxury",
    description: "Top-tier vehicles for special occasions and executives.",
    price: "15,000",
    examples: "Toyota Crown, Mercedes-Benz, BMW 5 Series",
    features: [
      "Everything in SUV",
      "Chauffeur available on request",
      "Premium leather interior",
      "Complimentary water & Wi-Fi",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="py-20 px-4 text-white text-center"
        style={{ backgroundColor: "#65AA36" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Transparent Pricing
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Simple daily rates in BDT. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl border p-6 flex flex-col ${
                tier.popular
                  ? "border-2 shadow-lg"
                  : "border-gray-200"
              }`}
              style={
                tier.popular ? { borderColor: "#65AA36" } : undefined
              }
            >
              {tier.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-semibold text-white rounded-full"
                  style={{ backgroundColor: "#E8722A" }}
                >
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">
                {tier.description}
              </p>

              <div className="mb-4">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "#65AA36" }}
                >
                  ৳{tier.price}
                </span>
                <span className="text-gray-400 text-sm ml-1">/ day</span>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                e.g. {tier.examples}
              </p>

              <ul className="space-y-2 mb-6 flex-grow">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Check
                      size={16}
                      weight="bold"
                      className="shrink-0 mt-0.5"
                      color="#65AA36"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/search-cars"
                className="block text-center py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
                style={
                  tier.popular
                    ? { backgroundColor: "#65AA36", color: "#fff" }
                    : {
                        backgroundColor: "transparent",
                        color: "#65AA36",
                        border: "2px solid #65AA36",
                      }
                }
              >
                Browse {tier.name} Cars
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Pricing Info */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Pricing Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                Chauffeur Add-On
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Add a professional chauffeur to any booking for{" "}
                <strong className="text-gray-700">৳1,500/day</strong>.
                Our drivers are experienced, licensed, and familiar with routes
                across Bangladesh.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                Weekly Discount
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Book for{" "}
                <strong className="text-gray-700">7 or more days</strong> and
                receive a <strong className="text-gray-700">15% discount</strong>{" "}
                on the total rental cost. The discount is applied automatically
                at checkout.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                No Hidden Fees
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                The price you see includes basic insurance and standard mileage.
                Fuel, tolls, and optional extras are clearly listed before you
                confirm your booking.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                Secure Payments
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                All payments are processed via{" "}
                <strong className="text-gray-700">SSLCommerz</strong> — accept
                bKash, Nagad, Visa, Mastercard, and net banking. Your payment
                data is fully encrypted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Find Your Ideal Rental
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Compare cars and prices, then book in minutes — all in BDT with no
          surprises.
        </p>
        <Link
          href="/search-cars"
          className="inline-block px-8 py-3 text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#65AA36" }}
        >
          Search Cars
        </Link>
      </section>
    </main>
  );
}
