import { AirplaneTilt, Car, UserCircle } from "@phosphor-icons/react";
import { CarTypeOption, DriveType, DriveTypeOption } from "./types";

export const CAR_TYPES: CarTypeOption[] = [
  { id: "sedan", label: "Sedan", seats: "4 seats", price: "৳3,500", icon: Car },
  { id: "suv", label: "SUV", seats: "7 seats", price: "৳5,500", icon: Car },
  {
    id: "hatchback",
    label: "Hatchback",
    seats: "4 seats",
    price: "৳2,500",
    icon: Car,
  },
  {
    id: "luxury",
    label: "Luxury",
    seats: "4 seats",
    price: "৳12,000",
    icon: Car,
  },
  {
    id: "microbus",
    label: "Microbus",
    seats: "10+ seats",
    price: "৳7,500",
    icon: Car,
  },
];

export const DRIVE_TYPES: DriveTypeOption[] = [
  { id: "self", label: "Self Drive", icon: Car },
  { id: "driver", label: "With Driver", icon: UserCircle },
  { id: "airport", label: "Airport Shuttle", icon: AirplaneTilt },
];

export const DEFAULTS: { driveType: DriveType; carTypeId: string } = {
  driveType: "self",
  carTypeId: "sedan",
};

export const CITY_OPTIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Cox's Bazar",
  "Rajshahi",
];
