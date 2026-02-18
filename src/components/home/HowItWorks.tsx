/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "../ui/button";

const steps = [
  {
    title: "Find your ride",
    description:
      "Search by location, date, and type. Every car is verified and ready.",
    image:
      "https://cdn.magicpatterns.com/uploads/qwPQ6FP2GiJFq9f8X9HufX/Picture_2.gif",
  },
  {
    title: "Verify and pay",
    description:
      "Secure payment through bKash, Nagad, or card. No surprises, no hidden fees.",
    image:
      "https://cdn.magicpatterns.com/uploads/pGCiJkJjKvcki15p65b3YL/Picture_1.gif",
  },
  {
    title: "Enjoy the drive",
    description:
      "Return with a few photos. That's it. No paperwork, no hassle.",
    image:
      "https://cdn.magicpatterns.com/uploads/rq2nngTYZCQTfp5shjVC5z/picture_3.png",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold tracking-wider uppercase text-[#65aa36] mb-4"
            >
              Process
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Three steps from search to the open road
            </motion.h2>
          </div>

          <div className="flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 mb-6"
            >
              Find what you need, verify it&#39;s yours, and drive. Simple as
              that.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              {/* FIXED: Changed from variant="primary" to variant="default" */}
              <Button variant="default">Browse cars</Button>

              {/* FIXED: Using native button instead of Button component for the one with icon */}
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Learn more
                <ArrowRight size={18} weight="bold" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group cursor-pointer relative ${
                index === 1 ? "lg:mt-16" : index === 2 ? "lg:mt-32" : ""
              }`}
            >
              {/* Step Number */}
              <div className="absolute -top-6 -left-4 z-20 w-16 h-16 rounded-full bg-[#65aa36] text-white text-2xl font-bold flex items-center justify-center shadow-lg border-4 border-gray-50">
                {index + 1}
              </div>

              <div className="relative overflow-hidden rounded-3xl mb-6 h-80 shadow-lg group-hover:shadow-2xl transition-shadow duration-300 bg-white">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <span className="inline-flex items-center gap-2 bg-[#65aa36] text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Step {index + 1}
                    <ArrowRight size={16} weight="bold" />
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#65aa36] transition-colors duration-300 px-2">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-relaxed px-2">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
