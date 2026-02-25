// components/pricing/TimeInput.tsx
import { Clock } from "@phosphor-icons/react";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TimeInput({ label, value, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-500">
        {label}
      </label>
      <div className="relative">
        <Clock
          size={18}
          weight="duotone"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-2 text-sm font-medium text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#5E9D34]"
        />
      </div>
    </div>
  );
}
