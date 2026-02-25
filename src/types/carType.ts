// types.ts

// Car Types
export type CarType = "Electric" | "Petrol" | "Hybrid";
export type RentalMode = "days" | "weekly" | "monthly";

// Car Specifications Interface
export interface CarSpecs {
  speed: string;
  acceleration: string;
  range: string;
  drive: string;
}

// Main Car Data Interface
export interface CarData {
  id: number;
  name: string;
  type: CarType;
  seats: number;
  rating: number;
  reviews: number;
  price: number; // per day
  images: string[];
  description: string;
  specs: CarSpecs;
  features: string[];
}

// Booking Draft Interface (for checkout)
export interface BookingDraft {
  carId: number;
  rentalMode: RentalMode;
  totalDays: number;
  daysCount: number;
  weeksCount: number;
  monthlyStart: string | null;
  monthlyEnd: string | null;
  pickupTime: string;
  dropoffTime: string;
  isSelfDrive: boolean;
  pricing: {
    perDay: number;
    subtotal: number;
    insuranceFee: number;
    discount: number;
    total: number;
  };
}

// Mock Data
export const CAR_DATA: CarData[] = [
  {
    id: 1,
    name: "Tesla Model 3 Long Range",
    type: "Electric",
    seats: 5,
    rating: 4.9,
    reviews: 124,
    price: 89,
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Experience the pinnacle of electric performance with the Tesla Model 3. Designed for speed, range, and unparalleled technology, this vehicle offers a seamless driving experience. Whether you're navigating urban streets or cruising the open highway, the Model 3 provides instant torque and a quiet, premium cabin.",
    specs: {
      speed: "162 mph",
      acceleration: "3.1s",
      range: "358 mi",
      drive: "AWD Dual",
    },
    features: ["Autopilot enabled", "Premium Sound", "Glass Roof"],
  },
  {
    id: 2,
    name: "Range Rover Sport",
    type: "Petrol",
    seats: 7,
    rating: 4.8,
    reviews: 85,
    price: 145,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609520505218-7421da356d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "The Range Rover Sport combines dynamic sporting personality with the peerless refinement you expect. Its muscular stance and powerful engine make it perfect for those who demand performance without compromising on luxury or off-road capability.",
    specs: {
      speed: "155 mph",
      acceleration: "4.3s",
      range: "450 mi",
      drive: "AWD",
    },
    features: ["Meridian Sound", "Air Suspension", "Panoramic Roof"],
  },
  {
    id: 3,
    name: "Toyota Corolla",
    type: "Hybrid",
    seats: 5,
    rating: 4.7,
    reviews: 210,
    price: 42,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1623869675781-804f84b3c52d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Reliable, efficient, and comfortable. The Toyota Corolla Hybrid is the perfect choice for city driving and longer commutes. With excellent fuel economy and a spacious interior, it delivers a smooth ride for everyone on board.",
    specs: {
      speed: "112 mph",
      acceleration: "10.5s",
      range: "600 mi",
      drive: "FWD",
    },
    features: ["Apple CarPlay", "Safety Sense", "Climate Control"],
  },
];

// Component Props Types (can be extended as needed)
export interface HeaderSectionProps {
  car: CarData;
  isLiked: boolean;
  onToggleLike: () => void;
}

export interface ImageGalleryProps {
  name: string;
  images: string[];
}

export interface SpecificationsProps {
  car: CarData;
}

export interface ReviewsSummaryProps {
  car: CarData;
}

export interface PricingCardProps {
  car: CarData;
  onCheckout: (payload: BookingDraft) => void;
}

export interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  ariaLabel?: string;
}

export interface InfoRowProps {
  icon: React.ReactNode;
  title: string;
  desc?: string;
}

export interface PolicyCardProps {
  icon: React.ReactNode;
  title: string;
  badgeText: string;
  badgeClass: string;
  borderClass: string;
  description: string;
}

export interface RentalModeSelectorProps {
  rentalMode: RentalMode;
  onModeChange: (mode: RentalMode) => void;
}

export interface RentalInputProps {
  rentalMode: RentalMode;
  daysCount: number;
  weeksCount: number;
  monthlyStart: string;
  monthlyEnd: string;
  totalDays: number;
  onDaysChange: (value: number) => void;
  onWeeksChange: (value: number) => void;
  onMonthlyStartChange: (value: string) => void;
  onMonthlyEndChange: (value: string) => void;
}

export interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export interface PriceRowProps {
  label: string;
  value: number;
  isFree?: boolean;
  className?: string;
}
