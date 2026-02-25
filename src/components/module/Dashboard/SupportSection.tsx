"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CaretDown,
  EnvelopeSimple,
  Headset,
  Phone,
  Warning,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { FAQ_DATA } from "@/types/dashboard/data";

export default function SupportSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Customer Support</h2>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-[#5E9D34]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Phone size={24} weight="duotone" className="text-[#5E9D34]" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
          <p className="text-[#5E9D34] font-semibold">+880 1234-567890</p>
          <p className="text-xs text-gray-500 mt-1">24/7 Support</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <WhatsappLogo size={24} weight="fill" className="text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
          <p className="text-green-600 font-semibold">+880 1234-567890</p>
          <p className="text-xs text-gray-500 mt-1">Quick Response</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <EnvelopeSimple
              size={24}
              weight="duotone"
              className="text-blue-600"
            />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Email</h3>
          <p className="text-blue-600 font-semibold">support@gogaari.com</p>
          <p className="text-xs text-gray-500 mt-1">Response within 24h</p>
        </div>
      </div>

      {/* Emergency Card */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Warning size={28} weight="fill" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Emergency Roadside Assistance</h3>
            <p className="text-red-100">
              Available 24/7 for all active rentals
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold">16789</p>
            <p className="text-red-100 text-sm">Toll-free</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Headset size={20} weight="duotone" className="text-[#5E9D34]" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === index ? null : index)
                }
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>
                <CaretDown
                  size={20}
                  weight="bold"
                  className={`text-gray-400 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-gray-600 text-sm">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
