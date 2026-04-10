// components/home/booking/types.ts
import type { Icon } from "@phosphor-icons/react";

export type DriveType = "self" | "driver";

export type CarTypeOption = {
  id: string;
  label: string;
  seats: string;
  price: string;
  icon: Icon;
};

export type DriveTypeOption = {
  id: DriveType;
  label: string;
  icon: Icon;
};
