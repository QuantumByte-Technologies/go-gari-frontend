// app/checkout/[carId]/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VehicleCard } from "@/components/checkout/VehicleCard";
import { CustomerInfo } from "@/components/checkout/CustomerInfo";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { RentalPeriod } from "@/components/checkout/RentalPeriod";
import { InsuranceSelector } from "@/components/checkout/InsuranceSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CAR_DATA, DEMO_USER } from "@/types/checkout";
import {
  calculateTotalDays,
  getRentalLabel,
  validateEmail,
} from "@/utils/checkout";
import type {
  RentalMode,
  PaymentMethod as PaymentMethodType,
  WalletProvider,
  InsurancePlan,
  FormData,
} from "@/types/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const carId = Number(params.carId);

  // State
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("wallet");
  const [walletProvider, setWalletProvider] = useState<WalletProvider>("bkash");
  const [insurancePlan, setInsurancePlan] = useState<InsurancePlan>("basic");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Rental period state
  const [rentalMode, setRentalMode] = useState<RentalMode>("days");
  const [daysCount, setDaysCount] = useState(3);
  const [weeksCount, setWeeksCount] = useState(1);
  const [monthlyStart, setMonthlyStart] = useState("");
  const [monthlyEnd, setMonthlyEnd] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");

  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: DEMO_USER.fullName,
    email: DEMO_USER.email,
    phone: DEMO_USER.phone,
    license: "",
    expiry: "",
    walletNumber: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Constants
  const selfDriveDiscount = 30;
  const insuranceFee = 32.5;
  const premiumInsuranceFee = 18.5;
  const isSelfDrive = true;

  // Calculations
  const totalDays = useMemo(
    () =>
      calculateTotalDays(
        rentalMode,
        daysCount,
        weeksCount,
        monthlyStart,
        monthlyEnd,
      ),
    [rentalMode, daysCount, weeksCount, monthlyStart, monthlyEnd],
  );

  const rentalLabel = useMemo(
    () =>
      getRentalLabel(
        rentalMode,
        daysCount,
        weeksCount,
        totalDays,
        monthlyStart,
        monthlyEnd,
      ),
    [rentalMode, daysCount, weeksCount, totalDays, monthlyStart, monthlyEnd],
  );

  const subtotal = CAR_DATA.price * totalDays;
  const totalInsurance =
    insurancePlan === "premium"
      ? insuranceFee + premiumInsuranceFee * totalDays
      : insuranceFee;
  const total =
    subtotal -
    (isSelfDrive ? selfDriveDiscount * totalDays : 0) +
    totalInsurance;

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.license) newErrors.license = "Driving license is required";
    if (!formData.expiry) newErrors.expiry = "License expiry is required";

    if (paymentMethod === "wallet") {
      if (!formData.walletNumber || formData.walletNumber.length < 11) {
        newErrors.walletNumber = "Valid wallet number is required";
      }
    } else {
      if (!formData.cardNumber || formData.cardNumber.length < 16) {
        newErrors.cardNumber = "Valid card number is required";
      }
      if (!formData.cardExpiry)
        newErrors.cardExpiry = "Expiry date is required";
      if (!formData.cardCvv || formData.cardCvv.length < 3) {
        newErrors.cardCvv = "CVV is required";
      }
      if (!formData.cardName)
        newErrors.cardName = "Cardholder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && termsAccepted) {
      // Navigate to user dashboard or show success
      router.push("/dashboard/bookings");
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Car Details", onClick: () => router.back() },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Forms */}
          <div className="lg:col-span-7 space-y-8">
            <VehicleCard car={CAR_DATA} rentalLabel={rentalLabel} />
            <CustomerInfo
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
            />
            <PaymentMethod
              paymentMethod={paymentMethod}
              walletProvider={walletProvider}
              formData={formData}
              errors={errors}
              onPaymentMethodChange={setPaymentMethod}
              onWalletProviderChange={setWalletProvider}
              onInputChange={handleInputChange}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Booking Summary
                </h2>

                {/* Vehicle Summary */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={CAR_DATA.image}
                      alt={CAR_DATA.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {CAR_DATA.name}
                    </h3>
                    <p className="text-xs text-gray-500">{CAR_DATA.type}</p>
                  </div>
                </div>

                {/* Rental Period */}
                <RentalPeriod
                  rentalMode={rentalMode}
                  daysCount={daysCount}
                  weeksCount={weeksCount}
                  monthlyStart={monthlyStart}
                  monthlyEnd={monthlyEnd}
                  totalDays={totalDays}
                  onRentalModeChange={setRentalMode}
                  onDaysChange={setDaysCount}
                  onWeeksChange={setWeeksCount}
                  onMonthlyStartChange={setMonthlyStart}
                  onMonthlyEndChange={setMonthlyEnd}
                  pickupTime={pickupTime}
                  dropoffTime={dropoffTime}
                  onPickupTimeChange={setPickupTime}
                  onDropoffTimeChange={setDropoffTime}
                />

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                  <PriceRow
                    label={`Daily rate (${rentalLabel})`}
                    value={subtotal}
                  />
                  {isSelfDrive && (
                    <PriceRow
                      label="Self-drive discount"
                      value={-(selfDriveDiscount * totalDays)}
                      className="text-[#5E9D34]"
                    />
                  )}
                  <PriceRow
                    label="Basic Insurance & Fees"
                    value={insuranceFee}
                  />
                  {insurancePlan === "premium" && (
                    <PriceRow
                      label={`Premium Coverage (${totalDays}d)`}
                      value={premiumInsuranceFee * totalDays}
                    />
                  )}
                </div>

                {/* Insurance Selection */}
                <InsuranceSelector
                  insurancePlan={insurancePlan}
                  totalDays={totalDays}
                  onPlanChange={setInsurancePlan}
                  insuranceFee={insuranceFee}
                  premiumFee={premiumInsuranceFee}
                />

                {/* Total */}
                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-[#5E9D34]">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Terms & Submit */}
                <TermsCheckbox
                  checked={termsAccepted}
                  onToggle={() => setTermsAccepted(!termsAccepted)}
                />

                <button
                  onClick={handleSubmit}
                  disabled={!termsAccepted}
                  className="w-full h-12 bg-[#5E9D34] text-white rounded-xl font-bold text-sm hover:brightness-95 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  Complete Booking
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> SSL Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Money-back guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper components
function PriceRow({ label, value, className }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium text-gray-900 ${className || ""}`}>
        {value < 0 ? `-$${Math.abs(value).toFixed(2)}` : `$${value.toFixed(2)}`}
      </span>
    </div>
  );
}

function TermsCheckbox({ checked, onToggle }: any) {
  return (
    <div className="flex items-start gap-2 mb-6">
      <div
        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
          checked ? "bg-[#5E9D34] border-[#5E9D34]" : "border-gray-300"
        }`}
        onClick={onToggle}
      >
        {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
      </div>
      <p className="text-xs text-gray-600 leading-tight">
        I agree to the{" "}
        <span className="text-[#5E9D34] underline cursor-pointer">
          Terms and Conditions
        </span>{" "}
        and{" "}
        <span className="text-[#5E9D34] underline cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>
    </div>
  );
}
