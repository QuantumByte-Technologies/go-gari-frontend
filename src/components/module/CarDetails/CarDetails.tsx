/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShareNetwork,
  Heart,
  Gauge,
  Lightning,
  BatteryFull,
  GearSix,
  MapPinLine,
  ShieldCheck,
  CheckCircle,
  Star,
  UsersThree,
  CalendarBlank,
  Clock,
  CalendarDots,
  Storefront,
  Timer,
  Broom,
  Lifebuoy,
  Headset,
  ShieldPlus,
  Warning,
  XCircle,
  Car as CarIcon,
} from "@phosphor-icons/react";
import { useParams, useRouter } from "next/navigation";

/**
 * ✅ Next.js App Router component (Client Component)
 * - No Navbar, no Footer, no breadcrumb/navigation UI
 * - Componentized layout + better state isolation
 * - Uses next/navigation router for back + checkout routing
 * - Works with Tailwind
 *
 * Usage (App Router):
 * 1) app/cars/[carId]/page.tsx:
 *    export default function Page({ params }: { params: { carId: string } }) {
 *      return <CarDetailsPage carId={Number(params.carId)} />
 *    }
 *
 * Optional:
 * - Provide `checkoutHref` (default: /checkout)
 * - Provide `backHref` (default: router.back())
 */

// -----------------------------
// Mock data (replace with API later)
// -----------------------------
type CarType = "Electric" | "Petrol" | "Hybrid";

type CarData = {
  id: number;
  name: string;
  type: CarType;
  seats: number;
  rating: number;
  reviews: number;
  price: number; // per day
  images: string[];
  description: string;
  specs: {
    speed: string;
    acceleration: string;
    range: string;
    drive: string;
  };
  features: string[];
};

const CAR_DATA: CarData[] = [
  {
    id: 1,
    name: "Tesla Model 3 Long Range",
    type: "Electric",
    seats: 5,
    rating: 4.9,
    reviews: 124,
    price: 89,
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Experience the pinnacle of electric performance with the Tesla Model 3. Designed for speed, range, and unparalleled technology, this vehicle offers a seamless driving experience. Whether you're navigating urban streets or cruising the open highway, the Model 3 provides instant torque and a quiet, premium cabin.",
    specs: {
      speed: "162 mph",
      acceleration: "3.1s",
      range: "358 mi",
      drive: "AWD Dual",
    },
    features: ["Autopilot enabled", "Premium Sound", "Glass Roof"],
  },
  {
    id: 2,
    name: "Range Rover Sport",
    type: "Petrol",
    seats: 7,
    rating: 4.8,
    reviews: 85,
    price: 145,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609520505218-7421da356d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "The Range Rover Sport combines dynamic sporting personality with the peerless refinement you expect. Its muscular stance and powerful engine make it perfect for those who demand performance without compromising on luxury or off-road capability.",
    specs: {
      speed: "155 mph",
      acceleration: "4.3s",
      range: "450 mi",
      drive: "AWD",
    },
    features: ["Meridian Sound", "Air Suspension", "Panoramic Roof"],
  },
  {
    id: 3,
    name: "Toyota Corolla",
    type: "Hybrid",
    seats: 5,
    rating: 4.7,
    reviews: 210,
    price: 42,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1623869675781-804f84b3c52d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Reliable, efficient, and comfortable. The Toyota Corolla Hybrid is the perfect choice for city driving and longer commutes. With excellent fuel economy and a spacious interior, it delivers a smooth ride for everyone on board.",
    specs: {
      speed: "112 mph",
      acceleration: "10.5s",
      range: "600 mi",
      drive: "FWD",
    },
    features: ["Apple CarPlay", "Safety Sense", "Climate Control"],
  },
];

// -----------------------------
// Small UI helpers (replace with your design system if needed)
// -----------------------------
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PrimaryButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "h-12 w-full rounded-xl bg-[#5E9D34] px-4 text-sm font-bold text-white shadow-sm transition hover:brightness-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    />
  );
}

function Toggle({
  isOn,
  onToggle,
  ariaLabel,
}: {
  isOn: boolean;
  onToggle: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? "Toggle"}
      aria-pressed={isOn}
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full border transition",
        isOn
          ? "bg-[#5E9D34]/20 border-[#5E9D34]/30"
          : "bg-gray-100 border-gray-200",
      )}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-white shadow transition",
          isOn ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

// -----------------------------
// Business logic helpers
// -----------------------------
type RentalMode = "days" | "weekly" | "monthly";

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = typeof value === "string" ? parseInt(value, 10) : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

function diffDaysInclusive(startISO: string, endISO: string) {
  // returns at least 1 if valid
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;

  const ms = end.getTime() - start.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

// -----------------------------
// Subcomponents
// -----------------------------
function HeaderSection({
  car,
  isLiked,
  onToggleLike,
}: {
  car: CarData;
  isLiked: boolean;
  onToggleLike: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          {car.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Lightning size={18} weight="duotone" className="text-[#5E9D34]" />
            {car.type}
          </span>

          <span className="flex items-center gap-1.5">
            <UsersThree size={18} weight="duotone" className="text-[#5E9D34]" />
            {car.seats} Seats
          </span>

          {car.features.map((feature, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <CheckCircle
                size={18}
                weight="duotone"
                className="text-[#5E9D34]"
              />
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          onClick={() => {
            // Simple share: copies current URL if available
            if (typeof window !== "undefined" && window?.location?.href) {
              navigator.clipboard
                ?.writeText(window.location.href)
                .catch(() => {});
            }
          }}
        >
          <ShareNetwork size={18} weight="duotone" />
          Share
        </button>

        <button
          type="button"
          onClick={onToggleLike}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            isLiked
              ? "border-red-100 bg-red-50 text-red-500"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
          )}
        >
          <Heart size={18} weight={isLiked ? "fill" : "duotone"} />
          Save
        </button>
      </div>
    </div>
  );
}

function ImageGallery({ name, images }: { name: string; images: string[] }) {
  const [activeImage, setActiveImage] = useState(0);

  // reset active image if images change
  useEffect(() => setActiveImage(0), [images]);

  return (
    <div className="space-y-4">
      <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 aspect-[16/10]">
        <motion.img
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={images[activeImage]}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveImage(idx)}
            className={cn(
              "aspect-[16/10] overflow-hidden rounded-lg border-2 transition-all",
              activeImage === idx
                ? "border-[#5E9D34] ring-2 ring-[#5E9D34]/20"
                : "border-transparent hover:border-gray-300",
            )}
          >
            <img
              src={img}
              alt={`View ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function Specifications({ car }: { car: CarData }) {
  const items = [
    { icon: Gauge, label: "Top Speed", value: car.specs.speed },
    { icon: Lightning, label: "0-60 mph", value: car.specs.acceleration },
    { icon: BatteryFull, label: "Range", value: car.specs.range },
    { icon: GearSix, label: "Drive", value: car.specs.drive },
  ];

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Specifications</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((spec, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <spec.icon
              size={24}
              weight="duotone"
              className="mb-3 text-[#5E9D34]"
            />
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {spec.label}
            </p>
            <p className="text-lg font-bold text-gray-900">{spec.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function IncludedInPrice() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Included in the price
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">Convenience</h3>

          <div className="space-y-6">
            <InfoRow
              icon={
                <Storefront
                  size={24}
                  weight="duotone"
                  className="text-[#5E9D34]"
                />
              }
              title="Skip the rental counter"
              desc="Use the app for pickup and return instructions"
            />
            <InfoRow
              icon={
                <UsersThree
                  size={24}
                  weight="duotone"
                  className="text-[#5E9D34]"
                />
              }
              title="Add additional drivers for free"
            />
            <InfoRow
              icon={
                <Timer size={24} weight="duotone" className="text-[#5E9D34]" />
              }
              title="30-minute return grace period"
              desc="No need to extend your trip unless you're running more than 30 minutes late"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Peace of mind
          </h3>

          <div className="space-y-6">
            <InfoRow
              icon={
                <Broom size={24} weight="duotone" className="text-[#5E9D34]" />
              }
              title="No need to wash the car before returning it, but please keep the vehicle tidy."
            />
            <InfoRow
              icon={
                <Lifebuoy
                  size={24}
                  weight="duotone"
                  className="text-[#5E9D34]"
                />
              }
              title="Access to basic roadside assistance"
            />
            <InfoRow
              icon={
                <Headset
                  size={24}
                  weight="duotone"
                  className="text-[#5E9D34]"
                />
              }
              title="24/7 customer support"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#5E9D34]/10">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        {desc ? <p className="mt-0.5 text-sm text-gray-500">{desc}</p> : null}
      </div>
    </div>
  );
}

function SafetySecurity() {
  const items = [
    {
      icon: MapPinLine,
      title: "GPS Tracking",
      desc: "Real-time location active",
    },
    { icon: ShieldCheck, title: "24/7 Security", desc: "Monitored assistance" },
    {
      icon: CheckCircle,
      title: "Fully Insured",
      desc: "Comprehensive coverage",
    },
  ];

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Safety &amp; Security
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl bg-gray-50 p-4"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 shadow-sm">
              <item.icon
                size={24}
                weight="duotone"
                className="text-[#5E9D34]"
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CancellationPolicy() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Cancellation Policy
      </h2>

      <div className="space-y-4">
        <PolicyCard
          icon={
            <CheckCircle size={24} weight="fill" className="text-[#5E9D34]" />
          }
          title="Free Cancellation"
          badgeText="FREE"
          badgeClass="bg-green-100 text-green-700"
          borderClass="border-l-[#5E9D34]"
          description="Full refund for cancellations made up to 48 hours before pickup."
        />
        <PolicyCard
          icon={<Warning size={24} weight="fill" className="text-amber-400" />}
          title="Partial Refund"
          badgeText="50%"
          badgeClass="bg-amber-100 text-amber-700"
          borderClass="border-l-amber-400"
          description="50% refund for cancellations made between 24-48 hours before pickup."
        />
        <PolicyCard
          icon={<XCircle size={24} weight="fill" className="text-red-500" />}
          title="Non-Refundable"
          badgeText="NO REFUND"
          badgeClass="bg-red-100 text-red-700"
          borderClass="border-l-red-500"
          description="No refund for cancellations made within 24 hours of pickup."
        />
      </div>
    </section>
  );
}

function PolicyCard({
  icon,
  title,
  badgeText,
  badgeClass,
  borderClass,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  badgeText: string;
  badgeClass: string;
  borderClass: string;
  description: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border border-gray-200 border-l-4 bg-white p-4",
        borderClass,
      )}
    >
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <div className="mb-1 flex items-center gap-2">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <span
            className={cn("rounded px-2 py-0.5 text-xs font-bold", badgeClass)}
          >
            {badgeText}
          </span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function InsuranceCoverage() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Insurance Coverage
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl border-2 border-green-100 bg-white p-6">
          <div className="absolute right-0 top-0 rounded-bl-xl bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
            INCLUDED
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <ShieldCheck
                size={24}
                weight="duotone"
                className="text-[#5E9D34]"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Basic Coverage</h3>
          </div>

          <ul className="space-y-3">
            {[
              "Third-party liability",
              "Personal accident cover",
              "Roadside assistance",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="mt-0.5 flex-shrink-0 text-[#5E9D34]"
                />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-xl border-2 border-amber-100 bg-white p-6">
          <div className="absolute right-0 top-0 rounded-bl-xl bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            +$15/DAY
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
              <ShieldPlus
                size={24}
                weight="duotone"
                className="text-amber-500"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Premium Coverage
            </h3>
          </div>

          <ul className="space-y-3">
            {[
              "All Basic features",
              "Zero deductible",
              "Tire & windshield protection",
              "Personal belongings",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="mt-0.5 flex-shrink-0 text-amber-500"
                />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ReviewsSummary({ car }: { car: CarData }) {
  const distribution = [
    { stars: 5, pct: "80%" },
    { stars: 4, pct: "12%" },
    { stars: 3, pct: "5%" },
    { stars: 2, pct: "2%" },
    { stars: 1, pct: "1%" },
  ];

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h2>

      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          <div className="text-center md:text-left">
            <div className="mb-2 text-5xl font-bold text-gray-900">
              {car.rating.toFixed(1)}
            </div>
            <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  weight="fill"
                  className={
                    star <= Math.round(car.rating)
                      ? "text-[#5E9D34]"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {car.reviews} verified reviews
            </p>
          </div>

          <div className="w-full flex-1 space-y-3">
            {distribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-4">
                <span className="w-3 text-sm font-medium text-gray-600">
                  {row.stars}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#5E9D34]"
                    style={{ width: row.pct }}
                  />
                </div>
                <span className="w-8 text-right text-sm text-gray-400">
                  {row.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PickupLocationCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <MapPinLine size={22} weight="duotone" className="text-blue-600" />
        <h3 className="font-bold text-gray-900">Pickup Location</h3>
      </div>

      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-blue-50">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Map"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-900 shadow-md">
            <MapPinLine size={14} weight="fill" className="text-red-500" />
            San Francisco
          </div>
        </div>
      </div>

      <p className="text-sm font-bold text-gray-900">
        SFO International Airport
      </p>
      <p className="text-xs text-gray-500">
        Terminal 2, Level 1, Parking Garage
      </p>
    </div>
  );
}

function PricingCard({
  car,
  onCheckout,
}: {
  car: CarData;
  onCheckout: (payload: BookingDraft) => void;
}) {
  const [rentalMode, setRentalMode] = useState<RentalMode>("days");
  const [daysCount, setDaysCount] = useState(3);
  const [weeksCount, setWeeksCount] = useState(1);
  const [monthlyStart, setMonthlyStart] = useState("");
  const [monthlyEnd, setMonthlyEnd] = useState("");

  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [isSelfDrive, setIsSelfDrive] = useState(false);

  const rentalModes: {
    id: RentalMode;
    label: string;
    icon: React.ElementType;
  }[] = useMemo(
    () => [
      { id: "days", label: "Days", icon: Clock },
      { id: "weekly", label: "Weekly", icon: CalendarBlank },
      { id: "monthly", label: "Monthly", icon: CalendarDots },
    ],
    [],
  );

  const totalDays = useMemo(() => {
    if (rentalMode === "days") return Math.max(1, daysCount);
    if (rentalMode === "weekly") return Math.max(1, weeksCount) * 7;
    if (rentalMode === "monthly") {
      if (monthlyStart && monthlyEnd)
        return diffDaysInclusive(monthlyStart, monthlyEnd);
      return 30;
    }
    return 1;
  }, [rentalMode, daysCount, weeksCount, monthlyStart, monthlyEnd]);

  const getRentalLabel = useMemo(() => {
    if (rentalMode === "days")
      return `${daysCount} day${daysCount > 1 ? "s" : ""}`;
    if (rentalMode === "weekly")
      return `${weeksCount} week${weeksCount > 1 ? "s" : ""} (${totalDays} days)`;
    if (rentalMode === "monthly") {
      if (monthlyStart && monthlyEnd) return `${totalDays} days`;
      return "30 days";
    }
    return "";
  }, [rentalMode, daysCount, weeksCount, totalDays, monthlyStart, monthlyEnd]);

  const selfDriveDiscount = 30;
  const insuranceFee = 32.5;

  const subtotal = useMemo(() => car.price * totalDays, [car.price, totalDays]);
  const discount = useMemo(
    () => (isSelfDrive ? selfDriveDiscount * totalDays : 0),
    [isSelfDrive, totalDays],
  );
  const total = useMemo(
    () => subtotal - discount + insuranceFee,
    [subtotal, discount, insuranceFee],
  );

  const canCheckout = useMemo(() => {
    if (rentalMode !== "monthly") return true;
    // If monthly mode, allow checkout even without dates (defaults to 30),
    // but if start is selected ensure end >= start
    if (monthlyStart && monthlyEnd)
      return new Date(monthlyEnd) >= new Date(monthlyStart);
    return true;
  }, [rentalMode, monthlyStart, monthlyEnd]);

  const handleCheckout = () => {
    const payload: BookingDraft = {
      carId: car.id,
      rentalMode,
      totalDays,
      daysCount,
      weeksCount,
      monthlyStart: monthlyStart || null,
      monthlyEnd: monthlyEnd || null,
      pickupTime,
      dropoffTime,
      isSelfDrive,
      pricing: {
        perDay: car.price,
        subtotal,
        insuranceFee,
        discount,
        total,
      },
    };
    onCheckout(payload);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-2 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-gray-900">${car.price}</span>
        <span className="text-gray-500">/day</span>
      </div>

      <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#5E9D34]">
        <Lightning size={14} weight="fill" />
        Instant Confirmation
      </div>

      {/* Rental Period */}
      <div className="mb-5">
        <label className="mb-3 block text-sm font-semibold text-gray-700">
          Rental Period
        </label>

        <div className="relative flex rounded-xl bg-gray-100 p-1">
          <motion.div
            className="absolute bottom-1 top-1 rounded-lg bg-white shadow-sm"
            animate={{
              left:
                rentalMode === "days"
                  ? "4px"
                  : rentalMode === "weekly"
                    ? "calc(33.33% + 1px)"
                    : "calc(66.66% - 2px)",
              width: "calc(33.33% - 5px)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />

          {rentalModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setRentalMode(mode.id)}
              className={cn(
                "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-colors",
                rentalMode === mode.id ? "text-[#5E9D34]" : "text-gray-500",
              )}
            >
              <mode.icon
                size={14}
                weight={rentalMode === mode.id ? "fill" : "duotone"}
              />
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode-specific input */}
      <AnimatePresence mode="wait">
        <motion.div
          key={rentalMode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mb-6"
        >
          {rentalMode === "days" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Number of Days
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={daysCount}
                  onChange={(e) =>
                    setDaysCount(clampInt(e.target.value, 1, 365, 1))
                  }
                  className="h-12 flex-1 rounded-xl border border-gray-200 px-4 text-lg font-semibold text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
                />
                <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-500">
                  days
                </span>
              </div>
            </div>
          )}

          {rentalMode === "weekly" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Number of Weeks
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={weeksCount}
                  onChange={(e) =>
                    setWeeksCount(clampInt(e.target.value, 1, 52, 1))
                  }
                  className="h-12 flex-1 rounded-xl border border-gray-200 px-4 text-lg font-semibold text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
                />
                <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-500">
                  weeks
                </span>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                = {weeksCount * 7} days total
              </p>
            </div>
          )}

          {rentalMode === "monthly" && (
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Start Date
                </label>
                <div className="relative">
                  <CalendarBlank
                    size={18}
                    weight="duotone"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="date"
                    value={monthlyStart}
                    onChange={(e) => setMonthlyStart(e.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  End Date
                </label>
                <div className="relative">
                  <CalendarBlank
                    size={18}
                    weight="duotone"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="date"
                    value={monthlyEnd}
                    min={monthlyStart || undefined}
                    onChange={(e) => setMonthlyEnd(e.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
                  />
                </div>
              </div>

              {monthlyStart && monthlyEnd && (
                <div className="rounded-lg border border-[#5E9D34]/15 bg-[#5E9D34]/5 px-3 py-2">
                  <p className="text-xs font-semibold text-[#5E9D34]">
                    {totalDays} days selected
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Times */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Pickup Time
          </label>
          <div className="relative">
            <Clock
              size={18}
              weight="duotone"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-2 text-sm font-medium text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Drop-off Time
          </label>
          <div className="relative">
            <Clock
              size={18}
              weight="duotone"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-2 text-sm font-medium text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
            />
          </div>
        </div>
      </div>

      {/* Self-drive */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <CarIcon size={18} weight="duotone" className="text-gray-700" />
            <p className="font-bold text-gray-900">Self-Drive</p>
          </div>
          <p className="text-xs text-gray-500">
            Save ${selfDriveDiscount}/day - No driver
          </p>
        </div>

        <Toggle
          isOn={isSelfDrive}
          onToggle={() => setIsSelfDrive((v) => !v)}
          ariaLabel="Self-drive toggle"
        />
      </div>

      {/* Price breakdown */}
      <div className="mb-6 space-y-3 border-b border-gray-100 pb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Daily rate ({getRentalLabel})</span>
          <span className="font-medium text-gray-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {isSelfDrive && (
          <div className="flex justify-between text-sm">
            <span className="text-[#5E9D34]">Self-drive discount</span>
            <span className="font-medium text-[#5E9D34]">
              -${discount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Airport pickup</span>
          <span className="font-bold text-[#5E9D34]">FREE</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Insurance &amp; Fees</span>
          <span className="font-medium text-gray-900">
            ${insuranceFee.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mb-6 flex items-end justify-between">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-[#5E9D34]">
          ${total.toFixed(2)}
        </span>
      </div>

      <PrimaryButton onClick={handleCheckout} disabled={!canCheckout}>
        Continue to Book
      </PrimaryButton>

      <p className="mt-3 text-center text-xs text-gray-400">
        Free cancellation until 24h before pickup
      </p>
    </div>
  );
}

// -----------------------------
// Booking draft type (what we pass to checkout)
// -----------------------------
export type BookingDraft = {
  carId: number;
  rentalMode: RentalMode;
  totalDays: number;
  daysCount: number;
  weeksCount: number;
  monthlyStart: string | null;
  monthlyEnd: string | null;
  pickupTime: string;
  dropoffTime: string;
  isSelfDrive: boolean;
  pricing: {
    perDay: number;
    subtotal: number;
    insuranceFee: number;
    discount: number;
    total: number;
  };
};

// -----------------------------
// Main Page Component
// -----------------------------
export function CarDetailsPage() {
  const router = useRouter();

  const params = useParams();
  const carId = params.id as number;

  const car = useMemo(() => {
    return CAR_DATA.find((c) => c.id === carId) ?? CAR_DATA[0];
  }, [carId]);

  const [isLiked, setIsLiked] = useState(false);

  // Optional: persist liked state per car
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `liked_car_${car.id}`;
    const saved = window.localStorage.getItem(key);
    setIsLiked(saved === "1");
  }, [car.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `liked_car_${car.id}`;
    window.localStorage.setItem(key, isLiked ? "1" : "0");
  }, [isLiked, car.id]);

  const handleCheckout = (draft: BookingDraft) => {
    // Save booking draft for checkout page
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("booking_draft", JSON.stringify(draft));
      }
    } catch {
      // ignore storage failures
    }
    router.push(checkoutHref);
  };

  return (
    <div className=" bg-gray-50 font-sans mt-20 ">
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <HeaderSection
            car={car}
            isLiked={isLiked}
            onToggleLike={() => setIsLiked((v) => !v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left */}
          <div className="space-y-12 lg:col-span-8">
            <ImageGallery name={car.name} images={car.images} />

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                About this vehicle
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                {car.description}
              </p>
            </section>

            <IncludedInPrice />
            <Specifications car={car} />
            <SafetySecurity />
            <CancellationPolicy />
            <InsuranceCoverage />
            <ReviewsSummary car={car} />
          </div>

          {/* Right */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <PricingCard car={car} onCheckout={handleCheckout} />
              <PickupLocationCard />

              {/* Optional back button (not a breadcrumb/navigation bar) */}
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
