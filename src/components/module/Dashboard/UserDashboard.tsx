/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { TabType } from "@/types/dashboard/types";
import { TAB_LABELS } from "@/types/dashboard/constants";
import {
  MOCK_CARS,
  MOCK_MESSAGES,
  MOCK_TRIPS,
  MOCK_USER,
} from "@/types/dashboard/data";
import TripsSection from "./TripsSection";
import ProfileSection from "./ProfileSection";
import CarsSection from "./CarsSection";
import SupportSection from "./SupportSection";
import InboxSection from "./InboxSection";
import DashboardTabs from "./DashboardTabs";

// import DashboardTabs from "./DashboardTabs";

// import TripsSection from "./sections/TripsSection";
// import ProfileSection from "./sections/ProfileSection";
// import CarsSection from "./sections/CarsSection";
// import SupportSection from "./sections/SupportSection";
// import InboxSection from "./sections/InboxSection";

type Props = {
  initialTab?: string;
};

export default function UserDashboard({ initialTab }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("trips");

  const unreadCount = useMemo(
    () => MOCK_MESSAGES.filter((m) => m.unread).length,
    [],
  );

  useEffect(() => {
    const tab = initialTab as TabType | undefined;
    if (tab && TAB_LABELS[tab]) setActiveTab(tab);
  }, [initialTab]);

  // navigation handlers (same idea as your props callbacks)
  const onNavigateToHome = useCallback(() => router.push("/"), [router]);
  const onNavigateToSearch = useCallback(
    () => router.push("/search"),
    [router],
  );
  const onNavigateToDetails = useCallback(
    (carId: number) => router.push(`/cars/${carId}`),
    [router],
  );
  const onNavigateToModifyBooking = useCallback(
    (bookingId: string) => router.push(`/dashboard/booking/${bookingId}`),
    [router],
  );

  const content = useMemo(() => {
    switch (activeTab) {
      case "trips":
        return (
          <TripsSection
            trips={MOCK_TRIPS}
            onNavigateToSearch={onNavigateToSearch}
            onNavigateToDetails={onNavigateToDetails}
            onNavigateToModifyBooking={onNavigateToModifyBooking}
          />
        );
      case "profile":
        return <ProfileSection user={MOCK_USER} />;
      case "cars":
        return (
          <CarsSection
            cars={MOCK_CARS}
            onNavigateToDetails={onNavigateToDetails}
          />
        );
      case "support":
        return <SupportSection />;
      case "inbox":
        return (
          <InboxSection messages={MOCK_MESSAGES} unreadCount={unreadCount} />
        );
      default:
        return null;
    }
  }, [
    activeTab,
    onNavigateToDetails,
    onNavigateToModifyBooking,
    onNavigateToSearch,
    unreadCount,
  ]);

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            onClick={onNavigateToHome}
            className="hover:text-[#5E9D34] transition-colors"
          >
            Home
          </button>
          <CaretRight size={14} weight="bold" />
          <span className="text-gray-900 font-medium">
            {TAB_LABELS[activeTab]}
          </span>
        </nav>

        {/* Horizontal Tabs */}
        <DashboardTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          unreadCount={unreadCount}
        />

        {/* Content */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
