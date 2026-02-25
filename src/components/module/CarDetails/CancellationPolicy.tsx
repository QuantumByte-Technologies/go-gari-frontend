// components/car/CancellationPolicy.tsx
import { CheckCircle, Warning, XCircle } from "@phosphor-icons/react";
import { PolicyCard } from "./ui";
// import { PolicyCard } from "@/components/ui";

export function CancellationPolicy() {
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
