"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretRight, Warning, ShieldCheck, IdentificationCard } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TabType } from "@/types/dashboard/types";
import { TAB_LABELS } from "@/types/dashboard/constants";
import { useGetUnreadCountQuery } from "@/redux/api/notificationsApi";
import { useGetVerificationStatusQuery } from "@/redux/api/authApi";
import TripsSection from "./TripsSection";
import ProfileSection from "./ProfileSection";
import DocumentsSection from "./DocumentsSection";
import CarsSection from "./CarsSection";
import SupportSection from "./SupportSection";
import InboxSection from "./InboxSection";
import DashboardTabs from "./DashboardTabs";

type Props = {
  initialTab?: string;
};

export default function UserDashboard({ initialTab }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("trips");

  // Fetch unread notification count from the API
  const { data: unreadData } = useGetUnreadCountQuery();
  const unreadCount = unreadData?.count ?? 0;

  // Fetch verification status
  const { data: verificationData } = useGetVerificationStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const tab = (searchParams.get("tab") ?? initialTab) as TabType | undefined;
    if (tab && TAB_LABELS[tab]) setActiveTab(tab);
  }, [searchParams, initialTab]);

  const onNavigateToHome = useCallback(() => router.push("/"), [router]);

  const content = useMemo(() => {
    switch (activeTab) {
      case "trips":
        return <TripsSection />;
      case "profile":
        return <ProfileSection />;
      case "documents":
        return <DocumentsSection />;
      case "cars":
        return <CarsSection />;
      case "support":
        return <SupportSection />;
      case "inbox":
        return <InboxSection />;
      default:
        return null;
    }
  }, [activeTab]);

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

        {/* Verification Banner */}
        {verificationData && !verificationData.is_verified && (
          <div
            className={`mb-6 rounded-xl border p-4 flex items-start gap-3 ${
              verificationData.verification_status === "rejected"
                ? "bg-red-50 border-red-200"
                : verificationData.verification_status === "pending"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-blue-50 border-blue-200"
            }`}
          >
            {verificationData.verification_status === "pending" ? (
              <ShieldCheck size={20} weight="fill" className="text-amber-500 mt-0.5 shrink-0" />
            ) : verificationData.verification_status === "rejected" ? (
              <Warning size={20} weight="fill" className="text-red-500 mt-0.5 shrink-0" />
            ) : (
              <IdentificationCard size={20} weight="fill" className="text-blue-500 mt-0.5 shrink-0" />
            )}
            <div>
              <p className={`text-sm font-medium ${
                verificationData.verification_status === "rejected"
                  ? "text-red-800"
                  : verificationData.verification_status === "pending"
                    ? "text-amber-800"
                    : "text-blue-800"
              }`}>
                {verificationData.verification_status === "pending"
                  ? "Your documents are pending verification"
                  : verificationData.verification_status === "rejected"
                    ? "Your verification was rejected"
                    : "Please submit your documents for verification"}
              </p>
              <p className={`text-xs mt-0.5 ${
                verificationData.verification_status === "rejected"
                  ? "text-red-600"
                  : verificationData.verification_status === "pending"
                    ? "text-amber-600"
                    : "text-blue-600"
              }`}>
                {verificationData.verification_status === "pending"
                  ? "You won't be able to book until your account is verified. We'll notify you once it's done."
                  : verificationData.verification_status === "rejected"
                    ? "Please re-upload your documents. Check the Documents tab for details."
                    : "Upload your NID or Passport to get verified and start booking cars."}
              </p>
              {verificationData.verification_status !== "pending" && (
                <button
                  onClick={() => setActiveTab("documents")}
                  className="mt-2 text-xs font-medium underline hover:no-underline"
                >
                  Upload Verification Documents
                </button>
              )}
            </div>
          </div>
        )}

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
