"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
      width="18"
      height="18"
      fill="currentColor"
    >
      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L165,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z" />
    </svg>
  );
}

export function JourneyShowcase() {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Built for Every Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600"
          >
            Find your perfect rental for driving in Dhaka, exploring Sylhet, or
            weekend getaways to Cox&apos;s Bazar.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          {/* Tile 1: The Premium Showcase (Hero Tile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group shadow-lg"
          >
            <Image
              src="/image/Gemini_Generated_Image_swgfurswgfurswgf.png"
              alt="Happy family on a road trip"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
              <span className="inline-block px-3 py-1 bg-[#5E9D34] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                Premium SUV
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Family Adventure
              </h3>
              <p className="text-gray-200 text-lg max-w-xl leading-relaxed">
                The best mix of comfort and space. Includes premium SUVs (e.g.,
                Toyota Land Cruiser). Perfect for long family trips outside the
                city.
              </p>
            </div>
          </motion.div>

          {/* Tile 2: The Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden group shadow-lg"
          >
            <Image
              src="/image/image23.png"
              alt="Happy travelers at Cox's Bazar"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="text-yellow-400" />
                ))}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Memories on the Move
              </h3>
              <p className="text-gray-200 text-sm italic mb-4">
                &quot;Perfect for our drive down the scenic Marine Drive! We
                loved how smooth the sedan was.&quot;
              </p>
              <p className="text-[#5E9D34] font-semibold text-sm">
                — Sadia, Dhaka Traveler
              </p>
            </div>
          </motion.div>

          {/* Tile 3: The Functional Choice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden group shadow-lg"
          >
            <Image
              src="/image/Gemini_Generated_Image_u0bvx4u0bvx4u0bv.png"
              alt="Friends loading gear for a road trip"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl font-bold text-white mb-3">
                Choose Your Adventure
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                4x4 options, spacious trucks, and reliable off-road support.
                Ready for any terrain or equipment you bring.
              </p>
            </div>
          </motion.div>

          {/* Tile 4: The Experience / Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-3 relative rounded-3xl overflow-hidden group shadow-lg"
          >
            <Image
              src="/image/Gemini_Generated_Image_eqzteceqzteceqzt.png"
              alt="Car interior with AC and sunset drive"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/30" />
            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center w-full md:w-2/3">
              <h3 className="text-3xl font-bold text-white mb-4">
                It&apos;s What&apos;s Inside That Counts
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                Comfort in Every Mile. Enjoy standard-fit AC, modern
                entertainment systems, and the option for premium interiors in
                our select fleet.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
