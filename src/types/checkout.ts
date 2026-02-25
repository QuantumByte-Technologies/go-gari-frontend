// types/checkout.ts
export type RentalMode = "days" | "weekly" | "monthly";
export type PaymentMethod = "wallet" | "card";
export type WalletProvider = "bkash" | "nagad" | "rocket";
export type InsurancePlan = "basic" | "premium";

export interface CarData {
  id: number;
  name: string;
  type: string;
  image: string;
  price: number;
}

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  license: string;
  expiry: string;
  walletNumber: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
}

export interface CheckoutPageProps {
  carId: number;
}

// Mock data
export const CAR_DATA: CarData = {
  id: 1,
  name: "Tesla Model 3 Long Range",
  type: "Electric",
  image:
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  price: 89,
};

// Demo user info
export const DEMO_USER = {
  fullName: "Rahim Ahmed",
  email: "rahim.ahmed@gmail.com",
  phone: "+880 1712-345678",
  initials: "RA",
};
