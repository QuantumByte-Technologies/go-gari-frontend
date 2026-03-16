// components/ui.tsx
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function PrimaryButton({
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

export function Toggle({
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

export function InfoRow({
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

export function PolicyCard({
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
