/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/constants.ts
import type { TabType } from "./types";
import {
  Car,
  User,
  IdentificationCard,
  ChatCircleDots,
} from "@phosphor-icons/react";

export const DASHBOARD_TABS: Array<{
  id: TabType;
  label: string;
  icon: any;
}> = [
  { id: "trips", label: "My Trips", icon: Car },
  { id: "profile", label: "Profile", icon: User },
  { id: "documents", label: "Verification Documents", icon: IdentificationCard },
  { id: "inbox", label: "Inbox", icon: ChatCircleDots },
];

export const TAB_LABELS: Record<TabType, string> = {
  trips: "My Trips",
  profile: "Profile Settings",
  documents: "Verification Documents",
  cars: "Browse Cars",
  support: "Customer Support",
  inbox: "Inbox",
};

export const CITY_FILTERS = [
  "All",
  "Dhaka",
  "Sylhet",
  "Chittagong",
  "Cox's Bazar",
] as const;
