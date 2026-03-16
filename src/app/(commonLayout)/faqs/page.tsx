"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";

const faqs = [
  {
    question: "How do I book a car on Go Gaari?",
    answer:
      "Simply search for available cars by selecting your pickup location, dates, and preferred vehicle category. Once you find a car you like, click 'Book Now', fill in your details, and complete the payment. You'll receive a confirmation via email and SMS within minutes.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We process all payments securely through SSLCommerz — Bangladesh's leading payment gateway. You can pay using bKash, Nagad, Rocket, Visa, Mastercard, American Express, or net banking from most Bangladeshi banks.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "You can cancel your booking free of charge up to 24 hours before the scheduled pickup time. Cancellations made within 24 hours of pickup are subject to a cancellation fee equal to one day's rental. No-shows are charged the full booking amount.",
  },
  {
    question: "What documents do I need to rent a car?",
    answer:
      "You'll need a valid National ID Card (NID) and a valid Bangladeshi driving license. For self-drive rentals, your license must be current and match the vehicle class you're renting. International visitors can use an International Driving Permit (IDP) along with their passport.",
  },
  {
    question: "What is the minimum age to rent a car?",
    answer:
      "You must be at least 21 years old to rent a car from Go Gaari. For Premium and Luxury category vehicles, the minimum age is 25. All drivers must hold a valid driving license for at least 1 year.",
  },
  {
    question: "Is insurance included in the rental price?",
    answer:
      "Yes, basic third-party insurance is included with every rental at no extra cost. This covers third-party liability as required by Bangladeshi law. We also offer comprehensive insurance as an optional add-on for full peace of mind, which covers damage to the rental vehicle as well.",
  },
  {
    question: "What is the fuel policy?",
    answer:
      "All cars are provided with a full tank of fuel. You are expected to return the car with a full tank as well. If the car is returned with less fuel, a refueling charge will be applied based on current fuel prices plus a ৳500 service fee.",
  },
  {
    question: "What happens if I return the car late?",
    answer:
      "A grace period of 30 minutes is allowed. After that, late returns are charged at an hourly rate (1/8th of the daily rate per hour) for up to 4 hours. Returns delayed by more than 4 hours will be charged an additional full day's rental.",
  },
  {
    question: "Do you offer chauffeur-driven rentals?",
    answer:
      "Yes! You can add a professional chauffeur to any booking for ৳1,500 per day. Our chauffeurs are experienced, licensed, and familiar with routes across Bangladesh. You can request a chauffeur during the booking process or add one later from your dashboard.",
  },
  {
    question: "Can I take the car outside Dhaka or across districts?",
    answer:
      "Absolutely. You're free to drive anywhere within Bangladesh. However, for trips outside your pickup city, please inform us during booking so we can ensure your insurance coverage and provide relevant travel tips. Inter-district tolls and ferry charges are the renter's responsibility.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left gap-4 cursor-pointer"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <CaretDown
          size={20}
          weight="bold"
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          color="#65AA36"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
}

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="py-20 px-4 text-white text-center"
        style={{ backgroundColor: "#65AA36" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Everything you need to know about renting a car with Go Gaari.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div>
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-500 mb-8">
            Our support team is available 24/7. Reach out to us and we&apos;ll
            get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search-cars"
              className="inline-block px-8 py-3 text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#65AA36" }}
            >
              Browse Cars
            </Link>
            <a
              href="mailto:support@gogaari.com"
              className="inline-block px-8 py-3 font-semibold rounded-lg transition-opacity hover:opacity-90"
              style={{
                color: "#65AA36",
                border: "2px solid #65AA36",
              }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
