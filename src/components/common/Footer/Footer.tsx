"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPinLine,
  Phone,
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  TwitterLogo,
} from "@phosphor-icons/react";

import logo from "@/assets/logo/logo-up.png"

type FooterLink = { label: string; href: string };
type SocialLink = { label: string; href: string; Icon: React.ElementType };

const quickLinks: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQs", href: "/faqs" },
];

const services: FooterLink[] = [
  { label: "Self-Drive Cars", href: "/services/self-drive" },
  { label: "Chauffeur-Driven", href: "/services/chauffeur" },
  { label: "Corporate Rentals", href: "/services/corporate" },
  { label: "Long-Term Leasing", href: "/services/leasing" },
];

const support: FooterLink[] = [
  { label: "Contact Support", href: "/support" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cancellation Policy", href: "/cancellation" },
];

const locations = [
  { city: "Dhaka", areas: "Gulshan, Banani, Dhanmondi" },
  { city: "Chittagong", areas: "Agrabad, Nasirabad" },
  { city: "Sylhet", areas: "Zindabazar, Ambarkhana" },
];

const socials: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookLogo },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "Twitter", href: "https://twitter.com", Icon: TwitterLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinLogo },
];

function FooterColumn({
  title,
  links,
  delay = 0,
}: {
  title: string;
  links: FooterLink[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="lg:col-span-2"
    >
      <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-gray-400 hover:text-[#5E9D34] transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4"
          >
            <div className="relative h-14 w-42.5 mb-6">
              <Image
                // src="https://cdn.magicpatterns.com/uploads/1GDFNBkQ5bSkb29D4rD52o/Untitled_design.svg"
                src={logo}
                alt="GO GAARI"
                fill
                className="object-contain brightness-0 invert w-fit"
                sizes="1000px"
              />
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted car rental platform in Bangladesh. Book self-drive or
              chauffeur-driven cars with clear pricing and verified vehicles.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a
                href="tel:+8801234567890"
                className="flex items-center gap-3 text-gray-400 hover:text-[#5E9D34] transition-colors group"
              >
                <span className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center group-hover:bg-[#5E9D34] transition-colors">
                  <Phone size={20} weight="duotone" />
                </span>
                <span>+880 1234-567890</span>
              </a>

              <a
                href="mailto:hello@gogaari.com"
                className="flex items-center gap-3 text-gray-400 hover:text-[#5E9D34] transition-colors group"
              >
                <span className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center group-hover:bg-[#5E9D34] transition-colors">
                  <EnvelopeSimple size={20} weight="duotone" />
                </span>
                <span>hello@gogaari.com</span>
              </a>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center hover:bg-[#5E9D34] transition-colors"
                >
                  <Icon size={20} weight="fill" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Columns */}
          <FooterColumn title="Quick Links" links={quickLinks} delay={0.05} />
          <FooterColumn title="Services" links={services} delay={0.1} />
          <FooterColumn title="Support" links={support} delay={0.15} />

          {/* Locations */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="text-white font-bold text-lg mb-4">Our Locations</h3>
            <div className="space-y-4">
              {locations.map((loc) => (
                <div key={loc.city} className="flex items-start gap-2">
                  <MapPinLine
                    size={20}
                    weight="duotone"
                    className="text-[#5E9D34] shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-white font-semibold">{loc.city}</p>
                    <p className="text-sm text-gray-400">{loc.areas}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} GO GAARI. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/language"
                className="text-gray-500 hover:text-[#5E9D34] transition-colors"
              >
                Available in English & বাংলা
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
