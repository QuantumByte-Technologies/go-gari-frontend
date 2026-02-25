// components/car/IncludedInPrice.tsx
import {
  Storefront,
  UsersThree,
  Timer,
  Broom,
  Lifebuoy,
  Headset,
} from "@phosphor-icons/react";
import { InfoRow } from "./ui";

export function IncludedInPrice() {
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
