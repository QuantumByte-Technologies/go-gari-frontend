"use client";

import { DASHBOARD_TABS } from "@/types/dashboard/constants";
import { TabType } from "@/types/dashboard/types";
import React from "react";

type Props = {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
  unreadCount: number;
};

export default function DashboardTabs({
  activeTab,
  onChange,
  unreadCount,
}: Props) {
  return (
    <div className="overflow-x-auto pb-4 mb-6 -mx-4 px-4">
      <div className="flex gap-2 min-w-max bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm">
        {DASHBOARD_TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === item.id
                ? "bg-[#5E9D34] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon
              size={18}
              weight={activeTab === item.id ? "fill" : "duotone"}
            />
            {item.label}
            {item.id === "inbox" && unreadCount > 0 && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === item.id
                    ? "bg-white/20 text-white"
                    : "bg-[#5E9D34] text-white"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
