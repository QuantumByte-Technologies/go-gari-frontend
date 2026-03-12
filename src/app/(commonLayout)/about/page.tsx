"use client";

import React from "react";
import Link from "next/link";
import { Users, Car, MapPin, Star } from "@phosphor-icons/react";

const stats = [
  { icon: MapPin, value: "12+", label: "Cities Served" },
  { icon: Car, value: "500+", label: "Cars Available" },
  { icon: Users, value: "25,000+", label: "Happy Customers" },
  { icon: Star, value: "4.8", label: "Average Rating" },
];

const values = [
  {
    title: "Reliability",
    description:
      "Every vehicle in our fleet is regularly serviced and inspected so you can drive with complete peace of mind.",
  },
  {
    title: "Transparency",
    description:
      "No hidden fees, no surprises. What you see at checkout is exactly what you pay — always in BDT.",
  },
  {
    title: "Accessibility",
    description:
      "From economy hatchbacks to luxury sedans, we offer options for every budget and occasion across Bangladesh.",
  },
  {
    title: "Customer First",
    description:
      "Our 24/7 support team is always ready to help — whether you need roadside assistance or a booking change.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="py-20 px-4 text-white text-center"
        style={{ backgroundColor: "#65AA36" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Go Gaari
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Making car rental simple, affordable, and accessible for everyone in
            Bangladesh.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "#65AA36" }}
            >
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Go Gaari was founded with a simple goal — to remove the hassle
              from renting a car in Bangladesh. Whether you need a vehicle for a
              family trip to Cox&apos;s Bazar, a business meeting in Chattogram,
              or daily commuting in Dhaka, we make the entire process seamless.
              From browsing and booking to pickup and return, every step is
              designed to save you time and effort.
            </p>
          </div>
          <div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "#65AA36" }}
            >
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a Bangladesh where personal mobility is never a
              barrier. By building a technology-driven rental platform with a
              nationwide fleet, we aim to become the country&apos;s most trusted
              mobility partner — empowering individuals, families, and
              businesses to travel on their own terms, whenever and wherever they
              need.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Go Gaari at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon size={40} weight="duotone" color="#65AA36" />
                </div>
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: "#65AA36" }}
                >
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          What We Stand For
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {v.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-gray-600 leading-relaxed">
            Go Gaari is powered by a passionate team of engineers, operations
            specialists, and customer experience professionals based in Dhaka.
            With deep expertise in logistics, technology, and the Bangladeshi
            market, we work around the clock to keep our fleet running and our
            customers happy.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Hit the Road?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Browse our fleet and find the perfect car for your next trip across
          Bangladesh.
        </p>
        <Link
          href="/search-cars"
          className="inline-block px-8 py-3 text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#65AA36" }}
        >
          Browse Cars
        </Link>
      </section>
    </main>
  );
}
