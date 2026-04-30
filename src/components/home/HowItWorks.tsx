"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import Image from "next/image";
import { Button } from "../ui/button";

import image1 from "../../assets/image1.jpeg";
import image2 from "../../assets/image2.jpeg";
import image3 from "../../assets/image3.jpeg";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "Find your ride",
    description:
      "Search by location, date, and type. Every car is verified and ready.",
    image: image3,
  },
  {
    title: "Verify and pay",
    description:
      "Secure payment through bKash, Nagad, or card. No surprises, no hidden fees.",
    image: image2,
  },
  {
    title: "Enjoy the drive",
    description:
      "Return with a few photos. That's it. No paperwork, no hassle.",
    image: image1,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function HowItWorks() {
  const router = useRouter();
  return (
    <section id="how-it-works" className="bg-gray-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#65aa36]"
            >
              Process
            </motion.p>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl"
            >
              Three steps from search to the open road
            </motion.h2>
          </div>

          <div className="flex flex-col justify-center">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-lg text-gray-600"
            >
              Find what you need, verify it&#39;s yours, and drive. Simple as
              that.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button className="w-full sm:w-auto bg-[#66aa3e] hover:bg-green-700 cursor-pointer">
                Browse cars
              </Button>

              <Button
                variant="outline"
                className="gap-2 bg-white cursor-pointer"
                onClick={() => router.push("/how-it-works")}
              >
                Learn more
                <ArrowRight size={18} weight="bold" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`group relative cursor-pointer ${
                index === 1 ? "lg:mt-16" : index === 2 ? "lg:mt-32" : ""
              }`}
            >
              {/* Step Number */}
              <div className="absolute -left-4 -top-6 z-20 flex h-16 w-16 items-center justify-center rounded-full border-4 border-gray-50 bg-[#65aa36] text-2xl font-bold text-white shadow-lg">
                {index + 1}
              </div>

              {/* Image */}
              <div className="relative mb-6 h-80 overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow duration-300 group-hover:shadow-2xl">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-fill w-full h-full transition-transform duration-500 group-hover:scale-110"
                  priority={index === 0}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Hover CTA */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#65aa36] px-4 py-2 text-sm font-semibold text-white">
                    Step {index + 1}
                    <ArrowRight size={16} weight="bold" />
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="mb-3 px-2 text-3xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#65aa36]">
                {step.title}
              </h3>

              <p className="px-2 leading-relaxed text-gray-600">
                {step.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
