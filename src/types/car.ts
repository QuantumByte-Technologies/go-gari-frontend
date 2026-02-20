export type Car = {
  id: number;
  name: string;
  type: string;
  year: number;
  image: string;
  images?: string[];
  badge?: string | null;
  badgeColor?: string;
  driveType: "SELF-DRIVE" | "CHAUFFEUR";
  carType: string;
  fuelType: string;
  rating: number;
  seats: number;
  transmission: "Auto" | "Manual";
  mileage: string;
  price: number;
  total: number;
};

export type FilterKey = "price" | "seats" | "transmission" | "fuel" | "carType";

export type PriceRange = { label: string; min: number; max: number };
