"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetUnreadCountQuery } from "@/redux/api/notificationsApi";
import NotificationPanel from "./NotificationPanel";

const BRAND = "#65AA36";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 60_000, // poll every 60s
  });

  const unreadCount = unreadData?.count ?? 0;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Notifications"
        data-testid="notification-bell"
      >
        <Bell size={22} weight={isOpen ? "fill" : "regular"} />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1"
            style={{ backgroundColor: BRAND }}
            data-testid="notification-badge"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50"
          >
            <NotificationPanel onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
