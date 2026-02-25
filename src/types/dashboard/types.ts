// components/dashboard/types.ts
export type TabType = "trips" | "profile" | "cars" | "support" | "inbox";
export type TripTabType = "upcoming" | "completed" | "cancelled";

export type UserProfile = {
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  memberSince: string;
  avatar: string | null;
  address: string;
  dob: string;
  emergencyContact: string;
};

export type TripBase = {
  id: string;
  carName: string;
  carImage: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  type: string;
};

export type CompletedTrip = TripBase & { rating: number };
export type CancelledTrip = TripBase & { reason: string };
export type AnyTrip = TripBase | CompletedTrip | CancelledTrip;

export type TripsData = {
  upcoming: TripBase[];
  completed: CompletedTrip[];
  cancelled: CancelledTrip[];
};

export type CarItem = {
  id: number;
  name: string;
  type: string;
  city: string;
  image: string;
  rating: number;
  seats: number;
  transmission: string;
  fuel: string;
  price: number;
};

export type MessageThreadItem = {
  sender: "support" | "you";
  text: string;
  time: string;
};

export type InboxMessage = {
  id: number;
  orderId: string;
  carName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: MessageThreadItem[];
};

export type FaqItem = {
  question: string;
  answer: string;
};
