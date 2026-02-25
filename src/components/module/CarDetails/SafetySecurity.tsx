// components/car/SafetySecurity.tsx
import { MapPinLine, ShieldCheck, CheckCircle } from "@phosphor-icons/react";

export function SafetySecurity() {
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
