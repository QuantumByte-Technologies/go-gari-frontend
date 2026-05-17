'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, DownloadSimple } from '@phosphor-icons/react';
import { Button } from '../ui/button';

export function FinalCTA() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#1a1a1a]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/image/Gemini_Generated_Image_2g3oex2g3oex2g3o.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[30%] bg-[#5E9D34] rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-orange-500 rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to hit the road?
          </h2>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Join thousands of riders who trust GO GAARI for their journeys
            across Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#5E9D34] hover:bg-[#4d822b] text-white border-none"
              rightIcon={<ArrowRight size={20} weight="bold" />}
            >
              Find Cars Near You
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              leftIcon={<DownloadSimple size={20} weight="bold" />}
            >
              Download App
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}