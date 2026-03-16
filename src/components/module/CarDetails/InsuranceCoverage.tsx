// components/car/InsuranceCoverage.tsx
import { ShieldCheck, ShieldPlus, CheckCircle } from "@phosphor-icons/react";

export function InsuranceCoverage() {
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
            OPTIONAL ADD-ON
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
