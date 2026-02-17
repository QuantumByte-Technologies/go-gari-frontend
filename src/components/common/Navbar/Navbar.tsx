"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  X,
  Car,
  UserCircle,
  MagnifyingGlass,
  Headset,
  ChatCircleDots,
  SignOut,
  CaretDown,
  Heart,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

import logo from "@/assets/logo/logo-up.png";

type NavbarPage =
  | "home"
  | "search"
  | "details"
  | "checkout"
  | "signin"
  | "signup"
  | "mybookings"
  | "modifybooking"
  | "userdashboard";

interface NavbarProps {
  isLoggedIn?: boolean;

  // Optional: if you want to keep your old callback pattern
  onLogout?: () => void;
  onNavigateToDashboardTab?: (tab: string) => void;

  // Optional: for showing actual user info/avatar letter
  user?: {
    name?: string;
    phone?: string;
    avatarLetter?: string; // e.g. "R"
  };

  // Optional: allow overriding current page explicitly if you want
  currentPage?: NavbarPage;
}

export function Navbar({
  isLoggedIn = false,
  onLogout,
  onNavigateToDashboardTab,
  user,
  currentPage,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const computedPage: NavbarPage = useMemo(() => {
    if (currentPage) return currentPage;
    if (pathname === "/") return "home";
    if (pathname?.startsWith("/signin")) return "signin";
    if (pathname?.startsWith("/signup")) return "signup";
    if (pathname?.startsWith("/dashboard")) return "userdashboard";
    return "home";
  }, [currentPage, pathname]);

  // scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If we land on "/#section", scroll to it
  useEffect(() => {
    // App router doesn't expose hash in pathname, so read it from location
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (!hash) return;

    const id = hash.replace("#", "");
    const el = document.getElementById(id);

    // small delay helps if sections render after layout
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 60);
    } else if (id === "hero") {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 60);
    }
  }, [pathname]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);

    // If not on home, navigate to home with hash so the home page scrolls on mount
    if (computedPage !== "home") {
      router.push(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);

    if (computedPage !== "home") {
      router.push("/");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    {
      label: "Home",
      action: () => {
        setMobileMenuOpen(false);
        if (computedPage !== "home") router.push("/");
        else window.scrollTo({ top: 0, behavior: "smooth" });
      },
      isActive: computedPage === "home",
    },
    {
      label: "About Us",
      action: () => scrollToSection("platform-clarity"),
      isActive: false,
    },
    {
      label: "How It Works",
      action: () => scrollToSection("how-it-works"),
      isActive: false,
    },
  ];

  const profileMenuItems = [
    { label: "Favorites", icon: Heart, tab: "favorites" },
    { label: "My Trips", icon: Car, tab: "trips" },
    { label: "Profile", icon: UserCircle, tab: "profile" },
    { label: "Browse Cars", icon: MagnifyingGlass, tab: "cars" },
    { label: "Support", icon: Headset, tab: "support" },
    { label: "Inbox", icon: ChatCircleDots, tab: "inbox" },
  ];

  const handleProfileMenuClick = (tab: string) => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);

    if (onNavigateToDashboardTab) {
      onNavigateToDashboardTab(tab);
      return;
    }

    // Next.js default navigation fallback
    router.push(`/dashboard?tab=${encodeURIComponent(tab)}`);
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);

    if (onLogout) onLogout();
    else router.push("/signin");
  };

  const avatarLetter = (
    user?.avatarLetter ||
    user?.name?.[0] ||
    "R"
  ).toUpperCase();
  const displayName = user?.name || "Rahim Ahmed";
  const displayPhone = user?.phone || "+880 1712-345678";

  // Animation presets
  const navEnter = {
    initial: { y: -80, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  };

  const dropdownMotion = {
    initial: { opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)" },
    transition: { duration: 0.16, ease: "easeOut" as const },
  };

  const mobileMenuMotion = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.28, ease: "easeInOut" as const },
  };

  return (
    <motion.nav
      {...navEnter}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-1.5"
          : "bg-white shadow-sm py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="shrink-0 cursor-pointer"
            onClick={handleLogoClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Use next/image for perf; if this external domain isn't in next.config, switch to <img> */}
            <Image
              src={logo}
              alt="GO GAARI"
              width={100}
              height={40}
              className="h-12 md:h-14 w-auto transition-all duration-300"
              priority
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.button
                key={link.label}
                onClick={link.action}
                onMouseEnter={() => setActiveHover(link.label)}
                onMouseLeave={() => setActiveHover(null)}
                className={`relative px-4 py-2 text-sm font-semibold cursor-pointer transition-colors rounded-full ${
                  link.isActive
                    ? "text-[#5E9D34]"
                    : "text-gray-700 hover:text-[#5E9D34]"
                }`}
              >
                {link.label}

                <AnimatePresence>
                  {(link.isActive || activeHover === link.label) && (
                    <motion.div
                      layoutId="navIndicator"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.18 }}
                      className={`absolute inset-0 rounded-full -z-10 ${
                        link.isActive ? "bg-[#5E9D34]/10" : "bg-gray-100"
                      }`}
                    />
                  )}
                </AnimatePresence>

                {link.isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#5E9D34] rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileDropdownOpen((s) => !s)}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-[#5E9D34] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-[#5E9D34] to-[#4a7d29] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {avatarLetter}
                  </div>
                  <motion.span
                    animate={{ rotate: profileDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.16 }}
                    className="text-gray-500"
                    aria-hidden
                  >
                    <CaretDown size={16} weight="bold" />
                  </motion.span>
                </motion.button>

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      {...dropdownMotion}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-[#5E9D34] to-[#4a7d29] rounded-full flex items-center justify-center text-white font-bold">
                            {avatarLetter}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {displayName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {displayPhone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-1.5">
                        {profileMenuItems.map((item) => (
                          <button
                            key={item.tab}
                            onClick={() => handleProfileMenuClick(item.tab)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#5E9D34]/10 hover:text-[#5E9D34] transition-colors cursor-pointer"
                          >
                            <item.icon size={18} weight="duotone" />
                            {item.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-1.5 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <SignOut size={18} weight="bold" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:border-[#5E9D34] hover:text-[#5E9D34] hover:bg-transparent transition-all duration-300 cursor-pointer"
                  onClick={() => router.push("/auth/signin")}
                >
                  Sign in
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push("/auth/signup")}
                  className="shadow-md shadow-[#5E9D34]/20 hover:shadow-lg hover:shadow-[#5E9D34]/30 transition-all duration-300 cursor-pointer"
                >
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 text-gray-600 hover:text-[#5E9D34] hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} weight="bold" />
              ) : (
                <List size={24} weight="bold" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            {...mobileMenuMotion}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={link.action}
                  className={`text-left font-medium transition-all py-3 px-4 rounded-xl ${
                    link.isActive
                      ? "text-[#5E9D34] bg-[#5E9D34]/10"
                      : "text-gray-700 hover:text-[#5E9D34] hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}

              {isLoggedIn ? (
                <div className="pt-4 mt-2 border-t border-gray-100 space-y-1">
                  {profileMenuItems.map((item, index) => (
                    <motion.button
                      key={item.tab}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + index) * 0.05 }}
                      onClick={() => handleProfileMenuClick(item.tab)}
                      className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 hover:text-[#5E9D34] hover:bg-gray-50 font-medium"
                    >
                      <item.icon size={20} weight="duotone" />
                      {item.label}
                    </motion.button>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-red-600 hover:bg-red-50 font-medium mt-2"
                  >
                    <SignOut size={20} weight="bold" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-2 border-t border-gray-100 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:border-[#5E9D34] hover:text-[#5E9D34]"
                    onClick={() => {
                      router.push("/signin");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="default"
                    className="w-full shadow-md shadow-[#5E9D34]/20"
                    onClick={() => {
                      router.push("/signup");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
