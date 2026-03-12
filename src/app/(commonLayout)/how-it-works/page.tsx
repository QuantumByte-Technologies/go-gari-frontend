"use client";

import React from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  CreditCard,
  Car,
  Handshake,
} from "@phosphor-icons/react";

const steps = [
  {
    number: 1,
    icon: MagnifyingGlass,
    title: "Browse & Choose a Car",
    description:
      "Search our fleet by location, date, and vehicle type. Filter by category — Economy, Premium, SUV, or Luxury — and compare daily rates in BDT. Every listing includes photos, specs, and transparent pricing.",
  },
  {
    number: 2,
    icon: CreditCard,
    title: "Book & Pay Securely",
    description:
      "Once you've found the right car, confirm your booking in minutes. We use SSLCommerz — Bangladesh's leading payment gateway — so you can pay securely with bKash, Nagad, cards, or net banking. You'll receive instant confirmation via email and SMS.",
  },
  {
    number: 3,
    icon: Car,
    title: "Pick Up Your Car",
    description:
      "Head to the designated pickup location at your scheduled time. Our team will walk you through a quick handover, verify your documents (NID and driving license), and hand over the keys. Need a chauffeur? We'll have one ready for you.",
  },
  {
    number: 4,
    icon: Handshake,
    title: "Enjoy Your Ride & Return",
    description:
      "Drive freely across Bangladesh for the duration of your booking. When your trip is done, return the car to the agreed location. We'll do a quick inspection, and you're all set. It's that simple.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="py-20 px-4 text-white text-center"
        style={{ backgroundColor: "#65AA36" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Renting a car with Go Gaari takes just a few simple steps.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-6 items-start">
              {/* Left: Number + Line */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: "#65AA36" }}
                >
                  <step.icon size={28} weight="bold" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="w-0.5 h-16 mt-2"
                    style={{ backgroundColor: "#65AA36", opacity: 0.3 }}
                  />
                )}
              </div>

              {/* Right: Content */}
              <div className="pt-2">
                <p
                  className="text-sm font-semibold uppercase tracking-wide mb-1"
                  style={{ color: "#65AA36" }}
                >
                  Step {step.number}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Good to Know
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                Flexible Pickup
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Choose from multiple pickup locations across Dhaka, Chattogram,
                Sylhet, and more.
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                24/7 Support
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our support team is available around the clock for roadside
                assistance or booking changes.
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                No Hidden Fees
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                The price you see at booking is the price you pay. Fuel, tolls,
                and extras are clearly listed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Find the perfect car for your next trip in Bangladesh — it only takes
          a minute.
        </p>
        <Link
          href="/search-cars"
          className="inline-block px-8 py-3 text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#65AA36" }}
        >
          Browse Cars Now
        </Link>
      </section>
    </main>
  );
}
