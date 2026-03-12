# GO GAARI -- API vs Frontend Mismatch Report

> Generated: 2026-03-12
> API Docs: https://gogari.quantumbytetech.com/api/docs/#/
> Frontend: go-gari-frontend (Next.js 16 + RTK Query)

---

## Summary

The backend API exposes **42 endpoints** across 8 domains (accounts, bookings, cars, chauffeurs, client, notifications, payments, pricing, trips). The frontend currently has **zero RTK Query endpoints** defined (`baseApi.ts` has an empty `endpoints: () => ({})`). All data is hardcoded mock data. This document catalogs every mismatch between what the API provides and what the frontend implements.

---

## CRITICAL: Endpoints With No Frontend Implementation At All

These API endpoints have absolutely no corresponding frontend code (no service, no API call, no UI):

### Accounts / Auth
| # | API Endpoint | Method | Description | Frontend Status |
|---|---|---|---|---|
| 1 | `/api/v1/accounts/login/` | POST | JWT login (email+password) | UI exists (`Signin.tsx`) but uses `setTimeout` simulation -- no API call |
| 2 | `/api/v1/accounts/register/` | POST | Register new user, sends OTP | UI exists (`SignUp.tsx`) but `console.log`s payload -- no API call |
| 3 | `/api/v1/accounts/logout/` | POST | Blacklist refresh token | No implementation -- Navbar has no real logout logic |
| 4 | `/api/v1/accounts/verify-otp/` | POST | Verify phone OTP | No UI or logic exists |
| 5 | `/api/v1/accounts/resend-otp/` | POST | Resend OTP (max 3/hour) | No UI or logic exists |
| 6 | `/api/v1/accounts/forgot-password/` | POST | Send password reset email | No UI exists (route `/auth/forgot-password` is linked but not created) |
| 7 | `/api/v1/accounts/reset-password/` | POST | Reset password with token | No UI or logic exists |
| 8 | `/api/v1/accounts/token/refresh/` | POST | Refresh JWT access token | No token refresh logic anywhere |
| 9 | `/api/v1/accounts/profile/` | GET/PUT/PATCH | Get/update user profile | Dashboard `ProfileSection.tsx` has form but "Save" is client-only |
| 10 | `/api/v1/accounts/verification-status/` | GET | Check verification status | No implementation |
| 11 | `/api/v1/accounts/documents/` | GET/POST | List/upload user documents | Dashboard `DocumentsSection.tsx` has drop zones but no upload logic |
| 12 | `/api/v1/accounts/documents/{id}/` | DELETE | Delete rejected document | No implementation |

### Bookings
| # | API Endpoint | Method | Description | Frontend Status |
|---|---|---|---|---|
| 13 | `/api/v1/bookings/` | GET | List user's bookings | No implementation (dashboard uses mock data) |
| 14 | `/api/v1/bookings/` | POST | Create new booking | Checkout `handleSubmit` navigates away but makes no API call |
| 15 | `/api/v1/bookings/{id}/` | GET | Retrieve booking detail | No implementation |
| 16 | `/api/v1/bookings/{id}/cancel/` | POST | Cancel unpaid booking | Dashboard `TripCard` has Cancel button but it's non-functional |
| 17 | `/api/v1/bookings/{id}/pay/` | POST | Initiate payment for booking | No implementation |

### Cars
| # | API Endpoint | Method | Description | Frontend Status |
|---|---|---|---|---|
| 18 | `/api/v1/cars/` | GET | List cars with filters | `CarSearchPage.tsx` exists but reads from hardcoded `src/data/cars.ts` |
| 19 | `/api/v1/cars/{id}/` | GET | Car detail | `CarDetails.tsx` exists but reads from hardcoded `CAR_DATA` array |
| 20 | `/api/v1/cars/{id}/availability/` | GET | Check date availability | No implementation |
| 21 | `/api/v1/cars/{id}/booked-dates/` | GET | Get unavailable dates (3 months) | No implementation |
| 22 | `/api/v1/cars/{id}/chauffeurs/` | GET | List chauffeurs for a car | No implementation |
| 23 | `/api/v1/cars/nearby/` | GET | Nearby cars (Haversine) | `NearbyCars.tsx` exists but uses hardcoded data |

### Chauffeurs
| # | API Endpoint | Method | Description | Frontend Status |
|---|---|---|---|---|
| 24 | `/api/v1/chauffeurs/` | GET | List all chauffeurs | No implementation |
| 25 | `/api/v1/chauffeurs/{id}/` | GET | Chauffeur detail | No implementation |
| 26 | `/api/v1/chauffeurs/{id}/reviews/` | GET | List chauffeur reviews | No implementation |
| 27 | `/api/v1/chauffeurs/{id}/reviews/` | POST | Create chauffeur review | No implementation |
| 28 | `/api/v1/chauffeurs/{id}/reviews/{review_id}/` | PUT | Update review | No implementation |
| 29 | `/api/v1/chauffeurs/{id}/reviews/{review_id}/` | DELETE | Delete review | No implementation |

### Client Dashboard
| # | API Endpoint | Method | Description | Frontend Status |
|---|---|---|---|---|
| 30 | `/api/v1/client/dashboard/` | GET | Dashboard overview | `Dashboard.tsx` exists but uses mock data |
| 31 | `/api/v1/client/refunds/` | GET | Refund history | No implementation |

### Notifications
| # | API Endpoint | Method | Description | Frontend Status |
|---|---|---|---|---|
| 32 | `/api/v1/notifications/` | GET | List notifications | No implementation |
| 33 | `/api/v1/notifications/{id}/read/` | PATCH | Mark notification as read | No implementation |
| 34 | `/api/v1/notifications/unread-count/` | GET | Unread notification count | No implementation |

### Payments
| # | API Endpoint | Method | Description | Frontend Status |
|---|---|---|---|---|
| 35 | `/api/v1/payments/initiate/` | POST | Initiate SSLCommerz payment | No implementation |
| 36 | `/api/v1/payments/success/` | GET/POST | Payment success redirect | No route/page exists |
| 37 | `/api/v1/payments/fail/` | GET/POST | Payment fail redirect | No route/page exists |
| 38 | `/api/v1/payments/cancel/` | GET/POST | Payment cancel redirect | No route/page exists |
| 39 | `/api/v1/payments/ipn/` | POST | IPN callback (server-to-server) | N/A for frontend |

### Pricing
| # | API Endpoint | Method | Description | Frontend Status |
|---|---|---|---|---|
| 40 | `/api/v1/pricing/calculate/` | GET | Calculate rental pricing | `PricingCard.tsx` does client-side math -- no API call |

### Trips
| # | API Endpoint | Method | Description | Frontend Status |
|---|---|---|---|---|
| 41 | `/api/v1/trips/` | GET | List user's trips | `TripsSection.tsx` uses mock data |
| 42 | `/api/v1/trips/{id}/` | GET | Trip detail | No implementation |
| 43 | `/api/v1/trips/{id}/complete/` | POST | Mark trip completed | No implementation |
| 44 | `/api/v1/trips/{id}/photos/` | GET | List trip photos | No implementation |
| 45 | `/api/v1/trips/{id}/pre-photos/` | POST | Upload pre-trip photos | No implementation |
| 46 | `/api/v1/trips/{id}/post-photos/` | POST | Upload post-trip photos | No implementation |

---

## DATA MODEL MISMATCHES

### Car Type Definitions
| Field | API Schema (`CarList` / `CarDetail`) | Frontend Type (`src/types/car.ts`) | Status |
|---|---|---|---|
| `id` | `integer` | `number` | OK |
| `name` | `string (max 255)` | `string` | OK |
| `brand` | `string (max 100)` | Not present | **MISSING** |
| `model` | `string (max 100)` | Not present | **MISSING** |
| `year` | `integer` | `number` | OK |
| `category` | `enum: economy/premium/suv` | `type: string` (used as badge text) | **Mismatch** -- frontend uses free-form strings like "SUV", "Sedan" |
| `seats` | `integer` | `number` | OK |
| `transmission` | `enum: auto/manual` | `string` (e.g., "Automatic") | **Mismatch** -- frontend uses display strings, API uses codes |
| `fuel_type` | `enum: petrol/diesel/hybrid/electric/cng` | `string` (e.g., "Hybrid") | **Mismatch** -- same issue |
| `drive_option` | `enum: both/self_drive_only/chauffeur_only` | `driveType: string[]` (e.g., ["Self Drive", "With Chauffeur"]) | **Mismatch** -- different structure entirely |
| `rate_per_day` | `decimal string` | `price: number` | **Mismatch** -- API returns string, frontend expects number |
| `chauffeur_rate_per_day` | `decimal string` | Not present | **MISSING** |
| `city` | `string (max 100)` | Not present | **MISSING** |
| `pickup_location_address` | `string (max 500)` | Not present | **MISSING** |
| `dropoff_location_address` | `string (max 500)` | Not present | **MISSING** |
| `primary_image` | `string (URL)` | `image: string` | OK (different field name) |
| `images` | `CarImage[]` (detail only) | Not present in list type | **MISSING** |
| `description` | `string` | Not present | **MISSING** |
| `tags` | `object` | Not present | **MISSING** |
| `is_active` | `boolean` | Not present | **MISSING** |
| `unavailable_dates` | `string` (detail only) | Not present | **MISSING** |

### User / Auth Types
| Field | API Schema (`Register`, `Profile`) | Frontend Implementation | Status |
|---|---|---|---|
| `email` | `string (email, max 254)` | Sign-in uses email field | OK |
| `phone` | `string (max 20)` | Sign-up has phone field with country code | OK |
| `password` | `string (writeOnly)` | Sign-up has password | OK |
| `password_confirm` | `string (writeOnly)` | Sign-up has confirm password | OK |
| `first_name` | `string (max 150)` | Sign-up uses single "Full Name" field | **Mismatch** -- API expects separate first/last |
| `last_name` | `string (max 150)` | Not a separate field in sign-up | **Mismatch** |
| `dob` | `date (nullable)` | Not in sign-up form | OK (optional in API) |
| `country` | `string (max 100)` | Not in sign-up form | OK (optional in API) |
| `user_type` | `enum: local/foreign` | Not present anywhere | **MISSING** |
| `is_phone_verified` | `boolean` | No OTP verification flow | **MISSING** |
| `verification_status` | `enum: pending/approved/rejected` | No verification UI | **MISSING** |

### Booking Types
| Field | API Schema (`BookingCreateRequest`) | Frontend (`src/types/checkout.ts`) | Status |
|---|---|---|---|
| `car_id` | `integer` | Stored in localStorage `BookingDraft` | Partial match |
| `start_date` | `date (YYYY-MM-DD)` | `startDate` in checkout form | OK |
| `end_date` | `date (YYYY-MM-DD)` | `endDate` in checkout form | OK |
| `drive_type` | `enum: self_drive/with_chauffeur` | `rentalMode: "days"/"weekly"/"monthly"` | **Mismatch** -- different concept entirely |
| `pickup_location` | `{address, lat, lng}` | Not in checkout form | **MISSING** |
| `dropoff_location` | `{address, lat, lng}` | Not in checkout form | **MISSING** |
| Insurance plan | Not in API | Frontend has insurance selector | **Extra** -- frontend-only feature |
| Payment method | Not in booking API | Frontend collects in checkout | **Extra** -- handled by separate payments API |

### Dashboard Types
| Field | API Schema (`client/dashboard`) | Frontend (`src/types/dashboard/types.ts`) | Status |
|---|---|---|---|
| Upcoming bookings | From API | Uses `MOCK_TRIPS` | **Not connected** |
| Active trips | From API | Uses `MOCK_TRIPS` | **Not connected** |
| Pending payments | From API | Not present | **MISSING** |
| Recent notifications | From API | Not present | **MISSING** |
| Refund history | `/client/refunds/` | Not present | **MISSING** |

---

## AUTH FLOW MISMATCHES

| Concern | API Design | Frontend Implementation | Gap |
|---|---|---|---|
| Token format | JWT Bearer (`Authorization: Bearer <token>`) | `authSlice` stores token, `baseApi` sets `Authorization: ${token}` (missing "Bearer " prefix) | **BUG** -- token header is `<raw_token>` not `Bearer <token>` |
| Token storage | JWT access + refresh tokens | Only stores one `token` in Redux (no refresh token handling) | **MISSING** refresh token flow |
| Token refresh | `/accounts/token/refresh/` endpoint | No refresh logic or interceptor | **MISSING** |
| OTP verification | Required after registration | No OTP page or flow | **MISSING** |
| Password reset | 2-step: forgot -> reset with token | No forgot-password page | **MISSING** |
| Logout | POST to `/accounts/logout/` to blacklist refresh token | Only clears Redux state | **INCOMPLETE** |
| Route protection | API returns 401 for authenticated endpoints | `proxy.ts` middleware does nothing (`NextResponse.next()`) | **MISSING** |

---

## UI COMPONENTS WITH NO API BACKING

| Component | Location | Issue |
|---|---|---|
| `NearbyCars.tsx` | Home page | Renders hardcoded cars -- should call `/api/v1/cars/nearby/` |
| `BookingModule.tsx` | Hero section | Location/date selection has no search API integration |
| `CarSearchPage.tsx` | `/search-cars` | Filters/search use local array -- should call `/api/v1/cars/?filters` |
| `CarDetails.tsx` | `/search-cars/[id]` | Reads from `CAR_DATA` -- should call `/api/v1/cars/{id}/` |
| `PricingCard.tsx` | Car details page | Client-side pricing -- should call `/api/v1/pricing/calculate/` |
| `Checkout.tsx` | `/checkout` | No booking creation API call -- should POST to `/api/v1/bookings/` |
| `ProfileSection.tsx` | Dashboard | Displays `MOCK_USER` -- should call `/api/v1/accounts/profile/` |
| `DocumentsSection.tsx` | Dashboard | Drop zones only -- should call `/api/v1/accounts/documents/` |
| `TripsSection.tsx` | Dashboard | Renders `MOCK_TRIPS` -- should call `/api/v1/trips/` |
| `CarsSection.tsx` | Dashboard | Uses mock car data -- should call `/api/v1/cars/` |
| `InboxSection.tsx` | Dashboard | Uses `MOCK_MESSAGES` -- should call `/api/v1/notifications/` |

---

## PAGES/ROUTES THAT EXIST IN NAVIGATION BUT ARE NOT IMPLEMENTED

| Route | Referenced In | Status |
|---|---|---|
| `/about` | Footer links | **Page does not exist** |
| `/how-it-works` | Footer links | **Page does not exist** |
| `/pricing` | Footer links | **Page does not exist** |
| `/faqs` | Footer links | **Page does not exist** |
| `/terms` | Checkout terms checkbox | **Page does not exist** |
| `/privacy` | Footer links | **Page does not exist** |
| `/cancellation` | Footer links | **Page does not exist** |
| `/support` | Footer links | **Page does not exist** |
| `/auth/forgot-password` | Sign-in page link | **Page does not exist** |
| `/dashboard/bookings` | Checkout redirect target | **Page does not exist** |
| `/dashboard/booking/:id` | Dashboard trip card links | **Page does not exist** |
| `/payments/success` | SSLCommerz redirect target | **Page does not exist** |
| `/payments/fail` | SSLCommerz redirect target | **Page does not exist** |
| `/payments/cancel` | SSLCommerz redirect target | **Page does not exist** |

---

## CURRENCY & LOCALE MISMATCHES

| Location | Currency Used | Expected |
|---|---|---|
| `CarDetails/PricingCard.tsx` | `$` (USD) | BDT (Taka) -- Bangladesh platform |
| `CarDetails/InsuranceCoverage.tsx` | `$` (USD) | BDT (Taka) |
| `Dashboard/TripCard.tsx` | Taka symbol | Correct |
| `data/cars.ts` | Prices like `100`, `150` | Should be BDT values (e.g., 5000, 8000) |
| `PickupLocation.tsx` | "SFO International Airport, San Francisco" | Should be a Bangladesh location |

---

## DEPENDENCY MISMATCHES

| Dependency | Status | Notes |
|---|---|---|
| `zod` | Installed, **unused** | Should be used for API response validation and form schemas |
| `@hookform/resolvers` | Installed, **unused** | Should connect Zod schemas to react-hook-form |
| `js-cookie` | Installed, **unused** | Possibly intended for token storage |
| `react-toastify` + `sonner` | Both installed | Should consolidate to one toast library |
| `lucide-react` + `@phosphor-icons/react` + `react-icons` | All three installed | Should consolidate to one icon library |
| `framer-motion` + `motion` | Both installed | `motion` is just framer-motion v12 re-export -- redundant |
| Testing library | **Not installed** | No vitest, jest, @testing-library/react, or msw |

---

## SUMMARY STATISTICS

| Category | Count |
|---|---|
| Total API endpoints | 46 (including method variants) |
| Endpoints with working frontend integration | **0** |
| Endpoints with UI but no API connection | **11** |
| Endpoints with no frontend code at all | **35** |
| Data model fields missing from frontend types | **18+** |
| Type/format mismatches | **8** |
| Missing pages/routes | **14** |
| Auth flow gaps | **7** |
| Dead/unused dependencies | **6** |
