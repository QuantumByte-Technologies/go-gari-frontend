import { http, HttpResponse } from "msw";

const API_BASE = "https://gogari.quantumbytetech.com/api/v1";

// ─── Mock user profile (shared by login & me endpoints) ─────────
const mockUserProfile = {
  id: 1,
  email: "test@example.com",
  first_name: "Test",
  last_name: "User",
  phone: "+8801700000000",
  dob: null,
  country: "Bangladesh",
  user_type: "local",
  is_phone_verified: true,
  is_verified: true,
  verification_status: "approved",
  date_joined: "2026-01-01T00:00:00Z",
};

// ─── Auth Handlers ───────────────────────────────────────────────
const authHandlers = [
  // Login
  http.post(`${API_BASE}/accounts/login/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;

    if (body.email === "test@example.com" && body.password === "Password123!") {
      return HttpResponse.json({
        access: "mock-access-token",
        refresh: "mock-refresh-token",
        user: mockUserProfile,
      });
    }

    return HttpResponse.json(
      { detail: "Invalid credentials" },
      { status: 401 },
    );
  }),

  // Register
  http.post(`${API_BASE}/accounts/register/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;

    if (body.email === "existing@example.com") {
      return HttpResponse.json(
        { email: ["A user with this email already exists."] },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        message: "Registration successful. Please verify your phone number.",
        user_id: 1,
        phone: body.phone,
      },
      { status: 201 },
    );
  }),

  // Token refresh
  http.post(`${API_BASE}/accounts/token/refresh/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;

    if (
      body.refresh === "mock-refresh-token" ||
      body.refresh === "valid-refresh-token"
    ) {
      return HttpResponse.json({
        access: "new-mock-access-token",
        refresh: "new-mock-refresh-token",
      });
    }

    return HttpResponse.json(
      { detail: "Token is invalid or expired" },
      { status: 401 },
    );
  }),

  // Logout
  http.post(`${API_BASE}/accounts/logout/`, () => {
    return HttpResponse.json(null, { status: 205 });
  }),

  // Resend OTP
  http.post(`${API_BASE}/accounts/resend-otp/`, () => {
    return HttpResponse.json({ detail: "OTP sent successfully." });
  }),

  // Verify OTP
  http.post(`${API_BASE}/accounts/verify-otp/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;

    if (body.code === "123456") {
      return HttpResponse.json({ detail: "Phone number verified." });
    }

    return HttpResponse.json(
      { detail: "Invalid or expired OTP." },
      { status: 400 },
    );
  }),

  // Forgot Password
  http.post(`${API_BASE}/accounts/forgot-password/`, () => {
    return HttpResponse.json({
      detail: "Password reset email sent.",
    });
  }),

  // Reset Password
  http.post(`${API_BASE}/accounts/reset-password/`, () => {
    return HttpResponse.json({
      detail: "Password has been reset.",
    });
  }),

  // Get current user profile
  http.get(`${API_BASE}/accounts/profile/`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }

    return HttpResponse.json(mockUserProfile);
  }),

  // Update profile
  http.patch(`${API_BASE}/accounts/profile/`, async ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Record<string, string>;
    return HttpResponse.json({ ...mockUserProfile, ...body });
  }),

  // Verification status
  http.get(`${API_BASE}/accounts/verification-status/`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      is_phone_verified: true,
      verification_status: "approved",
    });
  }),
];

// ─── Mock car list items ─────────────────────────────────────────
const mockCarListItem1 = {
  id: 1,
  name: "Toyota Corolla 2023",
  brand: "Toyota",
  model: "Corolla",
  year: 2023,
  category: "economy",
  city: "Dhaka",
  transmission: "auto",
  fuel_type: "petrol",
  seats: 5,
  rate_per_day: "3500.00",
  chauffeur_rate_per_day: "1500.00",
  drive_option: "both",
  pickup_location_address: "Dhanmondi 27, Dhaka",
  dropoff_location_address: "Dhanmondi 27, Dhaka",
  is_active: true,
  primary_image: "/mock-car-1.jpg",
};

const mockCarListItem2 = {
  id: 2,
  name: "Honda Civic 2024",
  brand: "Honda",
  model: "Civic",
  year: 2024,
  category: "premium",
  city: "Chittagong",
  transmission: "auto",
  fuel_type: "petrol",
  seats: 5,
  rate_per_day: "4000.00",
  chauffeur_rate_per_day: "1500.00",
  drive_option: "self_drive_only",
  pickup_location_address: "GEC Circle, Chittagong",
  dropoff_location_address: "GEC Circle, Chittagong",
  is_active: true,
  primary_image: "/mock-car-2.jpg",
};

const mockCarListItem3 = {
  id: 3,
  name: "Mitsubishi Pajero 2022",
  brand: "Mitsubishi",
  model: "Pajero",
  year: 2022,
  category: "suv",
  city: "Dhaka",
  transmission: "auto",
  fuel_type: "diesel",
  seats: 7,
  rate_per_day: "6000.00",
  chauffeur_rate_per_day: "2000.00",
  drive_option: "chauffeur_only",
  pickup_location_address: "Banani 11, Dhaka",
  dropoff_location_address: "Banani 11, Dhaka",
  is_active: true,
  primary_image: "/mock-car-3.jpg",
};

// ─── Mock car detail ─────────────────────────────────────────────
function mockCarDetail(id: number) {
  return {
    id,
    name: "Toyota Corolla 2023",
    brand: "Toyota",
    model: "Corolla",
    year: 2023,
    category: "economy",
    city: "Dhaka",
    transmission: "auto",
    fuel_type: "petrol",
    seats: 5,
    rate_per_day: "3500.00",
    chauffeur_rate_per_day: "1500.00",
    drive_option: "both",
    tags: {},
    description: "Well-maintained Toyota Corolla in excellent condition.",
    pickup_location_address: "Dhanmondi 27, Dhaka",
    pickup_location_lat: "23.7461",
    pickup_location_lng: "90.3742",
    dropoff_location_address: "Dhanmondi 27, Dhaka",
    dropoff_location_lat: "23.7461",
    dropoff_location_lng: "90.3742",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    images: [{ id: 1, car: id, image: "/mock-car-1.jpg", is_primary: true, order: 0 }],
    unavailable_dates: "",
  };
}

// ─── Cars Handlers ───────────────────────────────────────────────
// NOTE: Handlers with static path segments (e.g. /cars/nearby/) MUST come
// before parameterized handlers (e.g. /cars/:id/) so MSW doesn't match
// "nearby" as an :id param.
const carsHandlers = [
  // List cars
  http.get(`${API_BASE}/cars/`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    let results = [mockCarListItem1, mockCarListItem2, mockCarListItem3];

    // Simple category filter for testing
    if (category) {
      results = results.filter((c) => c.category === category);
    }

    return HttpResponse.json({
      count: results.length,
      next: null,
      previous: null,
      results,
    });
  }),

  // Nearby cars (MUST be before /cars/:id/ to avoid :id matching "nearby")
  http.get(`${API_BASE}/cars/nearby/`, ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");

    return HttpResponse.json({
      count: 3,
      next: null,
      previous: null,
      results: [mockCarListItem1, mockCarListItem2, mockCarListItem3],
    });
  }),

  // Car availability (before :id/ to be safe with nested paths)
  http.get(`${API_BASE}/cars/:id/availability/`, ({ request, params }) => {
    const id = Number(params.id);
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }

    // Car 2 is unavailable for testing purposes
    if (id === 2) {
      return HttpResponse.json({ available: false });
    }

    return HttpResponse.json({ available: true });
  }),

  // Car booked dates
  http.get(`${API_BASE}/cars/:id/booked-dates/`, ({ params }) => {
    const id = Number(params.id);

    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }

    return HttpResponse.json({
      car_id: id,
      unavailable_dates: [
        { date: "2026-04-01", reason: "booked" },
        { date: "2026-04-02", reason: "booked" },
        { date: "2026-04-03", reason: "booked" },
      ],
    });
  }),

  // Car chauffeurs
  http.get(`${API_BASE}/cars/:id/chauffeurs/`, () => {
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [mockChauffeurListItem1],
    });
  }),

  // Car detail (MUST be last among /cars/:id patterns)
  http.get(`${API_BASE}/cars/:id/`, ({ params }) => {
    const id = Number(params.id);

    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }

    return HttpResponse.json(mockCarDetail(id));
  }),
];

// ─── Pricing Handlers ───────────────────────────────────────────
const pricingHandlers = [
  http.get(`${API_BASE}/pricing/calculate/`, ({ request }) => {
    const url = new URL(request.url);
    const carId = Number(url.searchParams.get("car_id"));
    const startDate = url.searchParams.get("start_date") ?? "";
    const endDate = url.searchParams.get("end_date") ?? "";
    const withChauffeur = url.searchParams.get("with_chauffeur") === "true";

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numDays = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );

    const ratePerDay = withChauffeur ? "5000.00" : "3500.00";
    const chauffeurRate = "1500.00";
    const subtotal = (parseFloat(ratePerDay) * numDays).toFixed(2);
    const discountPercentage = numDays >= 7 ? "10.00" : "0.00";
    const discountAmount = (
      (parseFloat(subtotal) * parseFloat(discountPercentage)) /
      100
    ).toFixed(2);
    const grandTotal = (
      parseFloat(subtotal) - parseFloat(discountAmount)
    ).toFixed(2);

    return HttpResponse.json({
      num_days: numDays,
      rate_per_day: ratePerDay,
      chauffeur_rate_per_day: chauffeurRate,
      subtotal,
      discount_percentage: discountPercentage,
      discount_amount: discountAmount,
      grand_total: grandTotal,
    });
  }),
];

// ─── Mock booking data ──────────────────────────────────────────
const mockBookingListItem = {
  id: 1,
  booking_id: "BK-20260401-001",
  car_name: "Toyota Corolla 2023",
  car_brand: "Toyota",
  drive_type: "self_drive" as const,
  start_date: "2026-04-01",
  end_date: "2026-04-05",
  grand_total: "14000.00",
  status: "confirmed" as const,
  created_at: "2026-03-10T10:00:00Z",
};

function mockBookingDetail(id: number) {
  return {
    ...mockBookingListItem,
    id,
    car: 1,
    car_model: "Corolla",
    chauffeur: null,
    chauffeur_name: "",
    num_days: 4,
    pickup_location_address: "Dhanmondi 27, Dhaka",
    pickup_location_lat: "23.7461",
    pickup_location_lng: "90.3742",
    dropoff_location_address: "Dhanmondi 27, Dhaka",
    dropoff_location_lat: "23.7461",
    dropoff_location_lng: "90.3742",
    rate_per_day: "3500.00",
    subtotal: "14000.00",
    discount_percentage: "0.00",
    discount_amount: "0.00",
    expires_at: "2026-03-11T10:00:00Z",
    updated_at: "2026-03-10T10:00:00Z",
  };
}

// ─── Bookings Handlers ──────────────────────────────────────────
const bookingsHandlers = [
  // List bookings (with optional status filter)
  http.get(`${API_BASE}/bookings/`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    let results = [mockBookingListItem];

    if (status) {
      results = results.filter((b) => b.status === status);
    }

    return HttpResponse.json({
      count: results.length,
      next: null,
      previous: null,
      results,
    });
  }),

  // Create booking
  http.post(`${API_BASE}/bookings/`, async ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    // Validate required fields
    if (!body.car_id || !body.start_date || !body.end_date || !body.drive_type) {
      return HttpResponse.json(
        { detail: "Missing required fields." },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        id: 2,
        booking_id: "BK-20260401-002",
        car_name: "Toyota Corolla 2023",
        car_brand: "Toyota",
        car: body.car_id,
        car_model: "Corolla",
        chauffeur: null,
        chauffeur_name: "",
        drive_type: body.drive_type,
        start_date: body.start_date,
        end_date: body.end_date,
        num_days: 4,
        pickup_location_address:
          (body.pickup_location as Record<string, string>)?.address ?? "",
        pickup_location_lat: null,
        pickup_location_lng: null,
        dropoff_location_address:
          (body.dropoff_location as Record<string, string>)?.address ?? "",
        dropoff_location_lat: null,
        dropoff_location_lng: null,
        rate_per_day: "3500.00",
        subtotal: "14000.00",
        discount_percentage: "0.00",
        discount_amount: "0.00",
        grand_total: "14000.00",
        status: "pending_payment",
        expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),

  // Get booking detail (MUST be before cancel handler to avoid :id matching issues)
  http.get(`${API_BASE}/bookings/:id/`, ({ params }) => {
    const id = Number(params.id);

    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }

    return HttpResponse.json(mockBookingDetail(id));
  }),

  // Cancel booking
  http.post(`${API_BASE}/bookings/:id/cancel/`, ({ params, request }) => {
    const id = Number(params.id);
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }

    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }

    // Only pending_payment bookings can be cancelled
    if (id === 1) {
      // mockBookingListItem has status "confirmed" — can't cancel
      return HttpResponse.json(
        { detail: "Only bookings with pending_payment status can be cancelled." },
        { status: 400 },
      );
    }

    return HttpResponse.json(null, { status: 204 });
  }),
];

// ─── Payments Handlers ──────────────────────────────────────────
const paymentsHandlers = [
  // Initiate payment
  http.post(`${API_BASE}/payments/initiate/`, async ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const bookingId = body.booking_id as number;

    if (!bookingId) {
      return HttpResponse.json(
        { detail: "booking_id is required." },
        { status: 400 },
      );
    }

    // Simulate already-paid booking
    if (bookingId === 100) {
      return HttpResponse.json(
        { detail: "This booking has already been paid." },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      payment: {
        id: 1,
        booking_id: bookingId,
        amount: "14000.00",
        currency: "BDT",
        transaction_id: `TXN-${bookingId}-${Date.now()}`,
        status: "pending",
        payment_method: "sslcommerz",
        paid_at: null,
        created_at: new Date().toISOString(),
      },
      payment_url: "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=mock",
    });
  }),
];

// ─── Mock trip data ─────────────────────────────────────────────
const mockTripListItem = {
  id: 1,
  booking_id: "BK-20260401-001",
  car_name: "Toyota Corolla 2023",
  status: "upcoming" as const,
  started_at: null,
  completed_at: null,
  created_at: "2026-03-10T10:00:00Z",
};

const mockActiveTripListItem = {
  id: 2,
  booking_id: "BK-20260320-003",
  car_name: "Honda Civic 2024",
  status: "active" as const,
  started_at: "2026-03-20T09:00:00Z",
  completed_at: null,
  created_at: "2026-03-18T10:00:00Z",
};

const mockCompletedTripListItem = {
  id: 3,
  booking_id: "BK-20260201-005",
  car_name: "Mitsubishi Pajero 2022",
  status: "completed" as const,
  started_at: "2026-02-01T09:00:00Z",
  completed_at: "2026-02-05T18:00:00Z",
  created_at: "2026-01-28T10:00:00Z",
};

function mockTripDetail(id: number) {
  return {
    ...mockTripListItem,
    id,
    drive_type: "self_drive",
    start_date: "2026-04-01",
    end_date: "2026-04-05",
    updated_at: "2026-03-10T10:00:00Z",
    photos: [],
  };
}

// ─── Mock document data ─────────────────────────────────────────
const mockDocument1 = {
  id: 1,
  document_type: "driving_license" as const,
  document_number: "DL-2025-12345",
  expiry_date: "2028-06-15",
  file: "/uploads/documents/license-front.jpg",
  uploaded_at: "2026-02-15T10:00:00Z",
  status: "approved" as const,
  admin_notes: "",
};

const mockDocument2 = {
  id: 2,
  document_type: "nid_front" as const,
  document_number: "NID-9876543210",
  expiry_date: null,
  file: "/uploads/documents/nid-front.jpg",
  uploaded_at: "2026-02-16T11:00:00Z",
  status: "pending" as const,
  admin_notes: "",
};

const mockDocument3 = {
  id: 3,
  document_type: "passport" as const,
  document_number: "BD-A1234567",
  expiry_date: "2030-12-31",
  file: "/uploads/documents/passport.jpg",
  uploaded_at: "2026-02-17T09:00:00Z",
  status: "rejected" as const,
  admin_notes: "Image is blurry, please re-upload a clearer photo.",
};

// ─── Mock chauffeur data ────────────────────────────────────────
const mockChauffeurListItem1 = {
  id: 1,
  user: "Karim Rahman",
  photo: "/uploads/chauffeurs/karim.jpg",
  experience_years: 5,
  is_verified: true,
  average_rating: "4.80",
  total_trips: 120,
};

const mockChauffeurListItem2 = {
  id: 2,
  user: "Rahim Uddin",
  photo: "/uploads/chauffeurs/rahim.jpg",
  experience_years: 3,
  is_verified: true,
  average_rating: "4.50",
  total_trips: 75,
};

const mockChauffeurDetail = {
  ...mockChauffeurListItem1,
  bio: "Experienced chauffeur with 5 years of professional driving in Dhaka. Known for safe driving and punctuality.",
  is_active: true,
  documents: "verified",
  reviews_count: "12",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2026-03-01T14:00:00Z",
};

const mockChauffeurReview1 = {
  id: 1,
  user: "Ashraf Hossain",
  rating: 5,
  review_text: "Excellent driver! Very professional and punctual. Highly recommended.",
  created_at: "2026-02-20T10:00:00Z",
  updated_at: "2026-02-20T10:00:00Z",
};

const mockChauffeurReview2 = {
  id: 2,
  user: "Nadia Akter",
  rating: 4,
  review_text: "Good experience overall. The car was clean and the drive was smooth.",
  created_at: "2026-02-15T14:00:00Z",
  updated_at: "2026-02-15T14:00:00Z",
};

// ─── Mock notification data ─────────────────────────────────────
const mockNotification1 = {
  id: 1,
  user: 1,
  notification_type: "booking_confirmed",
  channel: "in_app" as const,
  subject: "Booking Confirmed",
  message: "Your booking BK-20260401-001 has been confirmed.",
  is_read: false,
  is_sent: true,
  sent_at: "2026-03-10T12:00:00Z",
  created_at: "2026-03-10T12:00:00Z",
};

const mockNotification2 = {
  id: 2,
  user: 1,
  notification_type: "payment_received",
  channel: "in_app" as const,
  subject: "Payment Received",
  message: "Payment of BDT 14,000 has been received for booking BK-20260401-001.",
  is_read: true,
  is_sent: true,
  sent_at: "2026-03-09T15:00:00Z",
  created_at: "2026-03-09T15:00:00Z",
};

// ─── Notifications Handlers ─────────────────────────────────────
const notificationsHandlers = [
  // Unread count (static path BEFORE parameterized paths)
  http.get(`${API_BASE}/notifications/unread-count/`, () => {
    return HttpResponse.json({ count: 1 });
  }),

  // Mark as read
  http.patch(`${API_BASE}/notifications/:id/read/`, ({ params, request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }
    const id = Number(params.id);
    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }
    return HttpResponse.json({ ...mockNotification1, id, is_read: true });
  }),

  // List notifications
  http.get(`${API_BASE}/notifications/`, ({ request }) => {
    const url = new URL(request.url);
    const isRead = url.searchParams.get("is_read");

    let results = [mockNotification1, mockNotification2];

    if (isRead === "true") {
      results = results.filter((n) => n.is_read);
    } else if (isRead === "false") {
      results = results.filter((n) => !n.is_read);
    }

    return HttpResponse.json({
      count: results.length,
      next: null,
      previous: null,
      results,
    });
  }),
];

// ─── Trips Handlers ─────────────────────────────────────────────
const tripsHandlers = [
  // Complete trip (static path segment before :id detail)
  http.post(`${API_BASE}/trips/:id/complete/`, ({ params, request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }
    const id = Number(params.id);
    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }
    return HttpResponse.json(null, { status: 200 });
  }),

  // Trip photos
  http.get(`${API_BASE}/trips/:id/photos/`, ({ params }) => {
    const id = Number(params.id);
    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }
    return HttpResponse.json({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
  }),

  // Upload pre-trip photos
  http.post(`${API_BASE}/trips/:id/pre-photos/`, ({ params, request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }
    return HttpResponse.json(null, { status: 201 });
  }),

  // Upload post-trip photos
  http.post(`${API_BASE}/trips/:id/post-photos/`, ({ params, request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }
    return HttpResponse.json(null, { status: 201 });
  }),

  // List trips
  http.get(`${API_BASE}/trips/`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    let results = [mockTripListItem, mockActiveTripListItem, mockCompletedTripListItem];

    if (status) {
      results = results.filter((t) => t.status === status);
    }

    return HttpResponse.json({
      count: results.length,
      next: null,
      previous: null,
      results,
    });
  }),

  // Trip detail
  http.get(`${API_BASE}/trips/:id/`, ({ params }) => {
    const id = Number(params.id);
    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }
    return HttpResponse.json(mockTripDetail(id));
  }),
];

// ─── Documents Handlers ─────────────────────────────────────────
const documentsHandlers = [
  // List documents
  http.get(`${API_BASE}/accounts/documents/`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }
    return HttpResponse.json({
      count: 3,
      next: null,
      previous: null,
      results: [mockDocument1, mockDocument2, mockDocument3],
    });
  }),

  // Upload document
  http.post(`${API_BASE}/accounts/documents/`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }
    return HttpResponse.json(
      {
        id: 4,
        document_type: "nid_back",
        document_number: "NID-9876543210",
        expiry_date: null,
        file: "/uploads/documents/nid-back.jpg",
        uploaded_at: new Date().toISOString(),
        status: "pending",
        admin_notes: "",
      },
      { status: 201 },
    );
  }),

  // Delete document
  http.delete(`${API_BASE}/accounts/documents/:id/`, ({ params, request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }
    const id = Number(params.id);
    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }
    // Can only delete rejected docs (id 3 is rejected)
    if (id === 1) {
      return HttpResponse.json(
        { detail: "Cannot delete an approved document." },
        { status: 400 },
      );
    }
    // id 2 is pending — backend only allows deleting rejected documents
    if (id === 2) {
      return HttpResponse.json(
        { detail: "Only rejected documents can be deleted." },
        { status: 400 },
      );
    }
    return HttpResponse.json(null, { status: 204 });
  }),
];

// ─── Dashboard Handlers ─────────────────────────────────────────
const dashboardHandlers = [
  // Dashboard overview
  http.get(`${API_BASE}/client/dashboard/`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }
    return HttpResponse.json({
      summary: {
        total_bookings: 5,
        completed_trips: 3,
        unread_notifications: 1,
      },
      upcoming_bookings: [mockBookingListItem],
      active_trips: [mockActiveTripListItem],
      pending_payments: [
        {
          id: 5,
          booking_id: 7,
          amount: "18500.00",
          currency: "BDT",
          transaction_id: "TXN-7-1712345678",
          status: "pending",
          payment_method: "sslcommerz",
          paid_at: null,
          created_at: "2026-03-15T10:00:00Z",
        },
      ],
      recent_notifications: [mockNotification1],
    });
  }),

  // Refunds
  http.get(`${API_BASE}/client/refunds/`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 },
      );
    }
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          booking_id: "BK-20260201-003",
          amount: "7000.00",
          status: "processed",
          reason: "Booking cancelled within 48h",
          created_at: "2026-02-10T10:00:00Z",
          processed_at: "2026-02-12T14:00:00Z",
        },
      ],
    });
  }),
];

// ─── Chauffeurs Handlers ────────────────────────────────────────
const chauffeursHandlers = [
  // List all chauffeurs
  http.get(`${API_BASE}/chauffeurs/`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const page = Number(url.searchParams.get("page") || 1);

    let results = [mockChauffeurListItem1, mockChauffeurListItem2];

    if (search) {
      results = results.filter((c) =>
        c.user.toLowerCase().includes(search.toLowerCase())
      );
    }

    return HttpResponse.json({
      count: results.length,
      next: page < 2 ? `${API_BASE}/chauffeurs/?page=2` : null,
      previous: page > 1 ? `${API_BASE}/chauffeurs/?page=1` : null,
      results,
    });
  }),

  // Chauffeur reviews (MUST come before /:id/ to avoid "reviews" matching as an id)
  http.get(`${API_BASE}/chauffeurs/:id/reviews/`, ({ params }) => {
    const id = Number(params.id);

    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }

    return HttpResponse.json({
      count: 2,
      next: null,
      previous: null,
      results: [mockChauffeurReview1, mockChauffeurReview2],
    });
  }),

  // Create chauffeur review
  http.post(`${API_BASE}/chauffeurs/:id/reviews/`, async ({ request, params }) => {
    const auth = request.headers.get("Authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    // Validate required fields
    if (!body.rating || !body.booking_id) {
      return HttpResponse.json(
        { rating: ["This field is required."], booking_id: ["This field is required."] },
        { status: 400 }
      );
    }

    // Simulate duplicate review error
    if (body.booking_id === 999) {
      return HttpResponse.json(
        { detail: "You have already reviewed this chauffeur for this booking." },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        id: 3,
        user: "Test User",
        rating: body.rating,
        review_text: body.review_text || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // Update chauffeur review
  http.put(
    `${API_BASE}/chauffeurs/:id/reviews/:reviewId/`,
    async ({ request, params }) => {
      const auth = request.headers.get("Authorization");
      if (!auth || !auth.startsWith("Bearer ")) {
        return HttpResponse.json(
          { detail: "Authentication credentials were not provided." },
          { status: 401 }
        );
      }

      const reviewId = Number(params.reviewId);
      if (reviewId === 999) {
        return HttpResponse.json({ detail: "Not found." }, { status: 404 });
      }

      const body = (await request.json()) as Record<string, unknown>;

      return HttpResponse.json({
        id: reviewId,
        user: "Test User",
        rating: body.rating ?? mockChauffeurReview1.rating,
        review_text: body.review_text ?? mockChauffeurReview1.review_text,
        created_at: mockChauffeurReview1.created_at,
        updated_at: new Date().toISOString(),
      });
    }
  ),

  // Delete chauffeur review
  http.delete(
    `${API_BASE}/chauffeurs/:id/reviews/:reviewId/`,
    ({ request, params }) => {
      const auth = request.headers.get("Authorization");
      if (!auth || !auth.startsWith("Bearer ")) {
        return HttpResponse.json(
          { detail: "Authentication credentials were not provided." },
          { status: 401 }
        );
      }

      const reviewId = Number(params.reviewId);
      if (reviewId === 999) {
        return HttpResponse.json({ detail: "Not found." }, { status: 404 });
      }

      return new HttpResponse(null, { status: 204 });
    }
  ),

  // Chauffeur detail (MUST be last among /chauffeurs/:id patterns)
  http.get(`${API_BASE}/chauffeurs/:id/`, ({ params }) => {
    const id = Number(params.id);

    if (id === 999) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 });
    }

    return HttpResponse.json(
      id === 2 ? { ...mockChauffeurDetail, ...mockChauffeurListItem2 } : mockChauffeurDetail
    );
  }),
];

// ─── Export all handlers ─────────────────────────────────────────
export const handlers = [
  ...authHandlers,
  ...carsHandlers,
  ...pricingHandlers,
  ...bookingsHandlers,
  ...paymentsHandlers,
  ...chauffeursHandlers,
  ...notificationsHandlers,
  ...tripsHandlers,
  ...documentsHandlers,
  ...dashboardHandlers,
];

// ─── Export mock data for test assertions ────────────────────────
export {
  mockUserProfile,
  mockCarListItem1,
  mockCarListItem2,
  mockCarListItem3,
  mockCarDetail,
  mockBookingListItem,
  mockBookingDetail,
  mockTripListItem,
  mockActiveTripListItem,
  mockCompletedTripListItem,
  mockTripDetail,
  mockDocument1,
  mockDocument2,
  mockDocument3,
  mockNotification1,
  mockNotification2,
  mockChauffeurListItem1,
  mockChauffeurListItem2,
  mockChauffeurDetail,
  mockChauffeurReview1,
  mockChauffeurReview2,
};
