// components/ui/Breadcrumb.tsx
"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter();

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[#5E9D34] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <button
              onClick={item.onClick}
              className="hover:text-[#5E9D34] transition-colors"
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Checkout</span>
    </nav>
  );
}
