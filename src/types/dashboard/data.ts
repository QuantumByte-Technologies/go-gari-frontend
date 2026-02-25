// components/dashboard/data.ts
import type {
  CarItem,
  FaqItem,
  InboxMessage,
  TripsData,
  UserProfile,
} from "./types";

export const MOCK_USER: UserProfile = {
  name: "রহিম আহমেদ",
  nameEn: "Rahim Ahmed",
  email: "rahim.ahmed@gmail.com",
  phone: "+880 1712-345678",
  memberSince: "January 2024",
  avatar: null,
  address: "House 42, Road 11, Banani, Dhaka",
  dob: "1990-05-15",
  emergencyContact: "+880 1812-345678",
};

export const MOCK_TRIPS: TripsData = {
  upcoming: [
    {
      id: "BK-8901",
      carName: "Toyota Land Cruiser Prado",
      carImage:
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      startDate: "Jan 15, 2025",
      endDate: "Jan 18, 2025",
      location: "Dhaka Airport",
      price: 18500,
      type: "Self-Drive",
    },
  ],
  completed: [
    {
      id: "BK-7823",
      carName: "Honda CR-V",
      carImage:
        "https://images.unsplash.com/photo-1568844293986-8c1a5c14e5c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      startDate: "Dec 20, 2024",
      endDate: "Dec 23, 2024",
      location: "Gulshan 2",
      price: 12000,
      type: "With Driver",
      rating: 5,
    },
    {
      id: "BK-6512",
      carName: "Toyota Corolla",
      carImage:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      startDate: "Nov 10, 2024",
      endDate: "Nov 12, 2024",
      location: "Banani",
      price: 7000,
      type: "Self-Drive",
      rating: 4,
    },
  ],
  cancelled: [
    {
      id: "BK-5401",
      carName: "Mitsubishi Pajero",
      carImage:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      startDate: "Oct 5, 2024",
      endDate: "Oct 8, 2024",
      location: "Chittagong",
      price: 15000,
      type: "Self-Drive",
      reason: "Schedule conflict",
    },
  ],
};

export const MOCK_CARS: CarItem[] = [
  {
    id: 1,
    name: "Toyota Land Cruiser Prado",
    type: "SUV",
    city: "Dhaka",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    seats: 7,
    transmission: "Auto",
    fuel: "Diesel",
    price: 6500,
  },
  {
    id: 2,
    name: "Honda CR-V",
    type: "SUV",
    city: "Dhaka",
    image:
      "https://images.unsplash.com/photo-1568844293986-8c1a5c14e5c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    price: 4500,
  },
  {
    id: 3,
    name: "Toyota Hiace",
    type: "Microbus",
    city: "Sylhet",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    seats: 12,
    transmission: "Manual",
    fuel: "Diesel",
    price: 5500,
  },
  {
    id: 4,
    name: "Nissan X-Trail",
    type: "SUV",
    city: "Chittagong",
    image:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    price: 4000,
  },
  {
    id: 5,
    name: "Toyota Allion",
    type: "Sedan",
    city: "Cox's Bazar",
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    price: 3500,
  },
  {
    id: 6,
    name: "Mitsubishi Pajero Sport",
    type: "SUV",
    city: "Cox's Bazar",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    seats: 7,
    transmission: "Auto",
    fuel: "Diesel",
    price: 5500,
  },
];

export const MOCK_MESSAGES: InboxMessage[] = [
  {
    id: 1,
    orderId: "BK-8901",
    carName: "Toyota Land Cruiser Prado",
    lastMessage: "Your booking has been confirmed. See you on Jan 15!",
    timestamp: "2 hours ago",
    unread: true,
    messages: [
      {
        sender: "support",
        text: "Thank you for booking with GO GAARI!",
        time: "10:00 AM",
      },
      {
        sender: "support",
        text: "Your booking has been confirmed. See you on Jan 15!",
        time: "10:02 AM",
      },
    ],
  },
  {
    id: 2,
    orderId: "BK-7823",
    carName: "Honda CR-V",
    lastMessage:
      "Thank you for your feedback! We appreciate your 5-star rating.",
    timestamp: "3 days ago",
    unread: false,
    messages: [
      {
        sender: "you",
        text: "The car was excellent, very clean!",
        time: "Dec 23, 2024",
      },
      {
        sender: "support",
        text: "Thank you for your feedback! We appreciate your 5-star rating.",
        time: "Dec 24, 2024",
      },
    ],
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    question: "How do I modify my booking?",
    answer:
      'You can modify your booking up to 24 hours before pickup from the "My Trips" section. Click on the booking and select "Modify Booking".',
  },
  {
    question: "What documents do I need for self-drive?",
    answer:
      "You need a valid driving license (Bangladesh or International), NID/Passport, and a security deposit. All documents should be uploaded in your profile.",
  },
  {
    question: "How does the cancellation policy work?",
    answer:
      "Free cancellation up to 48 hours before pickup. 50% refund for cancellations within 24-48 hours. No refund for cancellations within 24 hours.",
  },
  {
    question: "Is insurance included?",
    answer:
      "Yes, basic insurance is included with all rentals. You can opt for premium coverage at checkout for additional protection.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept bKash, Nagad, Rocket, and all major credit/debit cards. Cash payment is available for chauffeur-driven rentals.",
  },
];
