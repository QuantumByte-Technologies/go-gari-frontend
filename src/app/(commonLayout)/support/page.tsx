"use client";

import Link from "next/link";
import {
  Envelope,
  Phone,
  MapPin,
  Clock,
  CaretDown,
} from "@phosphor-icons/react";
import { useState } from "react";

const contactInfo = [
  {
    icon: Envelope,
    label: "Email",
    value: "support@gogari.com",
    href: "mailto:support@gogari.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880-1700-000000",
    href: "tel:+8801700000000",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "House 12, Road 5, Block C, Banani, Dhaka 1213, Bangladesh",
    href: null,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "9:00 AM – 9:00 PM BST, 7 days a week",
    href: null,
  },
];

const faqs = [
  {
    question: "How do I modify or cancel my booking?",
    answer:
      "You can modify or cancel your booking from the My Bookings section in your dashboard. Modifications are allowed up to 24 hours before the scheduled pickup time. For cancellations, please review our Cancellation Policy for refund details.",
  },
  {
    question: "What documents do I need for pickup?",
    answer:
      "You will need to present your original driving licence, a valid national ID or passport, and the booking confirmation (digital or printed). For chauffeur-driven rentals, only your national ID and booking confirmation are required.",
  },
  {
    question: "How long do refunds take to process?",
    answer:
      "Eligible refunds are processed through SSLCommerz and typically take 5–7 business days to reflect in your account, depending on your bank or payment provider.",
  },
  {
    question: "Is there a security deposit?",
    answer:
      "A refundable security deposit may be required for certain vehicle categories, particularly for self-drive rentals. The deposit amount will be clearly shown during the booking process and is refunded within 7 business days after the vehicle is returned in good condition.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <CaretDown
          size={20}
          weight="bold"
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Contact &amp; Support
          </h1>
          <p className="mt-2 text-gray-500">
            We&apos;re here to help with your car rental needs.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Contact Cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-12">
          {contactInfo.map((item, idx) => {
            const Icon = item.icon;
            const content = (
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-gray-300 transition-colors">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#65AA3615" }}
                >
                  <Icon size={22} weight="duotone" color="#65AA36" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-gray-900 font-medium text-sm leading-snug">
                    {item.value}
                  </p>
                </div>
              </div>
            );

            return item.href ? (
              <a
                key={idx}
                href={item.href}
                className="block"
              >
                {content}
              </a>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link
              href="/faqs"
              className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "#65AA36" }}
            >
              View all FAQs
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Helpful Links
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Cancellation Policy", href: "/cancellation" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#65AA36" }}
                />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            Can&apos;t find what you&apos;re looking for? Email us at{" "}
            <a
              href="mailto:support@gogari.com"
              className="font-medium underline hover:no-underline"
              style={{ color: "#65AA36" }}
            >
              support@gogari.com
            </a>{" "}
            and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
