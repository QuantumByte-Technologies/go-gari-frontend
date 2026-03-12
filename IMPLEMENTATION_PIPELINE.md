# GO GAARI -- Implementation Pipeline

> Generated: 2026-03-12
> See also: `API_FRONTEND_MISMATCHES.md` for the full gap analysis

---

## Overview

This pipeline is organized into **8 phases**, ordered by dependency and priority. Each phase builds on the previous one. Every phase includes specific unit/integration tests to verify correctness before moving on.

**Tech Stack for Implementation:**
- API Layer: RTK Query (already scaffolded in `baseApi.ts`)
- Types: TypeScript + Zod schemas (both installed)
- Forms: react-hook-form + @hookform/resolvers/zod (both installed)
- Testing: Vitest + @testing-library/react + MSW (to be installed)
- Toast: Sonner (keep) -- remove react-toastify

---

## Phase 0: Foundation -- Testing Infrastructure & Cleanup
**Priority:** Prerequisite for all phases
**Estimated Effort:** 1-2 days

### 0.1 Install Testing Dependencies
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D msw @vitejs/plugin-react jsdom
npm install -D @types/testing-library__jest-dom
```

### 0.2 Configure Vitest
Create `vitest.config.ts` at project root:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 0.3 Create Test Setup
Create `src/test/setup.ts`:
```ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())
```

Create `src/test/test-utils.tsx` (render wrapper with Redux Provider):
```tsx
import { configureStore } from '@reduxjs/toolkit'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { baseApi } from '@/redux/api/baseApi'
import authReducer from '@/redux/features/auth/authSlice'
import { ReactElement } from 'react'

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (gDM) => gDM().concat(baseApi.middleware),
    preloadedState,
  })
}

function renderWithProviders(
  ui: ReactElement,
  { preloadedState = {}, store = createTestStore(preloadedState), ...options }: RenderOptions & { preloadedState?: any; store?: any } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) }
}

export { renderWithProviders, createTestStore }
```

Create `src/test/mocks/handlers.ts` (MSW request handlers):
```ts
import { http, HttpResponse } from 'msw'

const BASE_URL = 'http://localhost:8000'

export const handlers = [
  // Will be populated per phase
]
```

Create `src/test/mocks/server.ts`:
```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
export const server = setupServer(...handlers)
```

### 0.4 Dependency Cleanup
- Remove `react-toastify` (keep `sonner`)
- Remove `react-icons` (keep `@phosphor-icons/react` + `lucide-react` for shadcn)
- Remove `motion` (keep `framer-motion`)
- Remove `js-cookie` (tokens will be in Redux + httpOnly cookies)

### 0.5 Add package.json test script
```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

### Unit Tests for Phase 0
```
src/test/setup.test.ts
  - test: Vitest is properly configured and runs
  - test: @testing-library/react renders a basic component
  - test: Redux test store can be created with default state
  - test: renderWithProviders wraps components with Redux Provider
  - test: MSW server starts and intercepts requests
```

---

## Phase 1: TypeScript Types & Zod Schemas
**Priority:** Foundation for all API work
**Estimated Effort:** 2-3 days
**Dependencies:** Phase 0

### 1.1 Create API Type Definitions
Create `src/types/api/` directory with files matching API domains:

**`src/types/api/common.ts`** -- Shared types
```ts
// Paginated response wrapper
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Location object
export interface Location {
  address: string
  lat: string | null
  lng: string | null
}

// API error response
export interface ApiError {
  detail?: string
  [field: string]: string | string[] | undefined
}
```

**`src/types/api/auth.ts`** -- Auth types
```ts
export interface LoginRequest { email: string; password: string }
export interface LoginResponse { access: string; refresh: string; user: UserProfile }
export interface RegisterRequest {
  email: string; phone: string; first_name: string; last_name: string;
  password: string; password_confirm: string; dob?: string | null; country?: string
}
export interface RegisterResponse { email: string; phone: string; first_name: string; last_name: string }
export interface TokenRefreshRequest { refresh: string }
export interface TokenRefreshResponse { access: string; refresh: string }
export interface VerifyOtpRequest { phone: string; otp: string }
export interface ResendOtpRequest { phone: string }
export interface ForgotPasswordRequest { email: string }
export interface ResetPasswordRequest { token: string; password: string; password_confirm: string }
export type VerificationStatus = 'pending' | 'approved' | 'rejected'
export type UserType = 'local' | 'foreign'
export interface UserProfile {
  id: number; email: string; phone: string; first_name: string; last_name: string;
  dob: string | null; country: string; user_type: UserType; is_phone_verified: boolean;
  is_verified: boolean; verification_status: VerificationStatus; date_joined: string
}
export interface ProfileUpdateRequest { first_name: string; last_name: string; dob?: string | null; country?: string }
```

**`src/types/api/cars.ts`** -- Car types
```ts
export type CarCategory = 'economy' | 'premium' | 'suv'
export type Transmission = 'auto' | 'manual'
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'cng'
export type DriveOption = 'both' | 'self_drive_only' | 'chauffeur_only'

export interface CarImage { id: number; car: number; image: string; is_primary: boolean; order: number }

export interface CarListItem {
  id: number; name: string; brand: string; model: string; year: number;
  category: CarCategory; seats: number; transmission: Transmission; fuel_type: FuelType;
  drive_option: DriveOption; rate_per_day: string; chauffeur_rate_per_day: string;
  city: string; pickup_location_address: string; dropoff_location_address: string;
  is_active: boolean; primary_image: string
}

export interface CarDetail extends Omit<CarListItem, 'primary_image'> {
  tags: Record<string, any>; description: string;
  pickup_location_lat: string | null; pickup_location_lng: string | null;
  dropoff_location_lat: string | null; dropoff_location_lng: string | null;
  created_at: string; updated_at: string; images: CarImage[]; unavailable_dates: string
}

export interface CarSearchParams {
  category?: CarCategory; city?: string; transmission?: Transmission; fuel_type?: FuelType;
  drive_option?: DriveOption; seats?: number; seats_min?: number;
  min_price?: number; max_price?: number; start_date?: string; end_date?: string;
  search?: string; ordering?: string; page?: number
}

export interface CarAvailabilityParams { id: number; start_date: string; end_date: string }
```

**`src/types/api/bookings.ts`** -- Booking types
```ts
export type BookingStatus = 'pending_payment' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'refunded'
export type DriveType = 'self_drive' | 'with_chauffeur'

export interface BookingCreateRequest {
  car_id: number; start_date: string; end_date: string; drive_type: DriveType;
  pickup_location: { address: string; lat?: string | null; lng?: string | null };
  dropoff_location: { address: string; lat?: string | null; lng?: string | null };
}

export interface BookingListItem {
  id: number; booking_id: string; car_name: string; car_brand: string;
  drive_type: DriveType; start_date: string; end_date: string;
  grand_total: string; status: BookingStatus; created_at: string
}

export interface BookingDetail extends BookingListItem {
  car: number; car_model: string; chauffeur: number | null; chauffeur_name: string;
  num_days: number; pickup_location_address: string; pickup_location_lat: string | null;
  pickup_location_lng: string | null; dropoff_location_address: string;
  dropoff_location_lat: string | null; dropoff_location_lng: string | null;
  rate_per_day: string; subtotal: string; discount_percentage: string;
  discount_amount: string; expires_at: string | null; updated_at: string
}
```

**`src/types/api/chauffeurs.ts`** -- Chauffeur types
```ts
export interface ChauffeurListItem {
  id: number; user: string; photo: string; experience_years: number;
  is_verified: boolean; average_rating: string; total_trips: number
}
export interface ChauffeurDetail extends ChauffeurListItem {
  bio: string; is_active: boolean; documents: string; reviews_count: string;
  created_at: string; updated_at: string
}
export interface ChauffeurReview {
  id: number; user: string; rating: number; review_text: string;
  created_at: string; updated_at: string
}
export interface ChauffeurReviewCreateRequest { rating: number; review_text?: string; booking_id: number }
```

**`src/types/api/trips.ts`** -- Trip types
```ts
export type TripStatus = 'upcoming' | 'active' | 'completed'
export type PhotoType = 'pre_trip' | 'post_trip'

export interface TripListItem {
  id: number; booking_id: string; car_name: string; status: TripStatus;
  started_at: string | null; completed_at: string | null; created_at: string
}
export interface TripPhoto { id: number; photo: string; photo_type: PhotoType; timestamp: string; caption: string }
export interface TripDetail extends TripListItem {
  drive_type: string; start_date: string; end_date: string;
  updated_at: string; photos: TripPhoto[]
}
```

**`src/types/api/notifications.ts`** -- Notification types
```ts
export type NotificationChannel = 'email' | 'sms' | 'in_app' | 'all'
export interface Notification {
  id: number; user: number; notification_type: string; channel: NotificationChannel;
  subject: string; message: string; is_read: boolean; is_sent: boolean;
  sent_at: string | null; created_at: string
}
```

**`src/types/api/documents.ts`** -- Document types
```ts
export type DocumentType = 'nid_front' | 'nid_back' | 'passport' | 'driving_license'
export type DocumentStatus = 'pending' | 'approved' | 'rejected'
export interface UserDocument {
  id: number; document_type: DocumentType; document_number: string;
  expiry_date: string | null; file: string; uploaded_at: string;
  status: DocumentStatus; admin_notes: string
}
export interface UserDocumentUploadRequest { document_type: DocumentType; document_number: string; expiry_date?: string | null; file: File }
```

**`src/types/api/payments.ts`** -- Payment types
```ts
export interface PaymentInitiateRequest { booking_id: number }
export interface PaymentInitiateResponse { payment_url: string; tran_id: string }
```

### 1.2 Create Zod Validation Schemas
Create `src/schemas/` directory:

**`src/schemas/auth.ts`**
```ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is required'),
  first_name: z.string().min(1, 'First name is required').max(150),
  last_name: z.string().min(1, 'Last name is required').max(150),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(1, 'Confirm password'),
  dob: z.string().nullable().optional(),
  country: z.string().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
})

export const otpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
  password_confirm: z.string().min(1),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
})

export const profileUpdateSchema = z.object({
  first_name: z.string().min(1).max(150),
  last_name: z.string().min(1).max(150),
  dob: z.string().nullable().optional(),
  country: z.string().max(100).optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type OtpFormData = z.infer<typeof otpSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
```

**`src/schemas/booking.ts`**
```ts
import { z } from 'zod'

export const bookingCreateSchema = z.object({
  car_id: z.number().int().positive(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  drive_type: z.enum(['self_drive', 'with_chauffeur']),
  pickup_location: z.object({
    address: z.string().min(1, 'Pickup address is required').max(500),
    lat: z.string().nullable().optional(),
    lng: z.string().nullable().optional(),
  }),
  dropoff_location: z.object({
    address: z.string().min(1, 'Dropoff address is required').max(500),
    lat: z.string().nullable().optional(),
    lng: z.string().nullable().optional(),
  }),
})

export type BookingCreateFormData = z.infer<typeof bookingCreateSchema>
```

**`src/schemas/documents.ts`**
```ts
import { z } from 'zod'

export const documentUploadSchema = z.object({
  document_type: z.enum(['nid_front', 'nid_back', 'passport', 'driving_license']),
  document_number: z.string().min(1, 'Document number is required').max(100),
  expiry_date: z.string().nullable().optional(),
  file: z.instanceof(File, { message: 'File is required' }),
})

export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>
```

**`src/schemas/review.ts`**
```ts
import { z } from 'zod'

export const chauffeurReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review_text: z.string().optional().default(''),
  booking_id: z.number().int().positive(),
})

export type ChauffeurReviewFormData = z.infer<typeof chauffeurReviewSchema>
```

### Unit Tests for Phase 1
```
src/types/api/__tests__/types.test.ts
  - test: CarListItem type matches API schema fields
  - test: BookingCreateRequest includes all required fields
  - test: PaginatedResponse generic works with different types

src/schemas/__tests__/auth.test.ts
  - test: loginSchema rejects empty email
  - test: loginSchema rejects invalid email format
  - test: loginSchema accepts valid email and password
  - test: registerSchema rejects mismatched passwords
  - test: registerSchema rejects phone shorter than 10 chars
  - test: registerSchema accepts valid registration data
  - test: otpSchema rejects OTP not exactly 6 digits
  - test: profileUpdateSchema rejects empty first_name

src/schemas/__tests__/booking.test.ts
  - test: bookingCreateSchema rejects missing car_id
  - test: bookingCreateSchema rejects invalid drive_type
  - test: bookingCreateSchema requires pickup_location.address
  - test: bookingCreateSchema accepts valid booking data

src/schemas/__tests__/documents.test.ts
  - test: documentUploadSchema rejects invalid document_type
  - test: documentUploadSchema requires file
  - test: documentUploadSchema accepts valid upload data

src/schemas/__tests__/review.test.ts
  - test: chauffeurReviewSchema rejects rating < 1 or > 5
  - test: chauffeurReviewSchema requires booking_id
```

---

## Phase 2: Auth System -- API Layer + Redux + Token Management
**Priority:** Blocking -- all authenticated endpoints depend on this
**Estimated Effort:** 3-4 days
**Dependencies:** Phase 0, Phase 1

### 2.1 Fix baseApi.ts -- JWT Bearer Token & Token Refresh
Update `src/redux/api/baseApi.ts`:
- Fix Authorization header: `Bearer ${token}` (currently missing "Bearer" prefix)
- Add `baseQueryWithReauth` wrapper that:
  1. Makes request with access token
  2. On 401 response, calls `/api/v1/accounts/token/refresh/` with refresh token
  3. On successful refresh, retries the original request
  4. On failed refresh, dispatches `logout()` and redirects to `/auth/signin`

### 2.2 Update authSlice.ts
- Add typed initial state: `{ user: UserProfile | null; accessToken: string | null; refreshToken: string | null }`
- Add `setTokens` action (separate from `setUser`)
- Add selectors: `selectIsAuthenticated`, `selectAccessToken`, `selectRefreshToken`

### 2.3 Create Auth API Endpoints
Create `src/redux/api/authApi.ts` (injected into baseApi):
```ts
endpoints: (builder) => ({
  login: builder.mutation<LoginResponse, LoginRequest>({ ... }),
  register: builder.mutation<RegisterResponse, RegisterRequest>({ ... }),
  logout: builder.mutation<void, { refresh: string }>({ ... }),
  verifyOtp: builder.mutation<void, VerifyOtpRequest>({ ... }),
  resendOtp: builder.mutation<void, ResendOtpRequest>({ ... }),
  forgotPassword: builder.mutation<void, ForgotPasswordRequest>({ ... }),
  resetPassword: builder.mutation<void, ResetPasswordRequest>({ ... }),
  refreshToken: builder.mutation<TokenRefreshResponse, TokenRefreshRequest>({ ... }),
  getProfile: builder.query<UserProfile, void>({ ... }),
  updateProfile: builder.mutation<UserProfile, ProfileUpdateRequest>({ ... }),
  getVerificationStatus: builder.query<any, void>({ ... }),
})
```

### 2.4 Update Auth UI Components
- **`Signin.tsx`**: Replace `setTimeout` simulation with `useLoginMutation` + Zod validation
- **`SignUp.tsx`**: Replace `console.log` with `useRegisterMutation` + Zod validation, split "Full Name" into first_name/last_name
- **Create `OtpVerification.tsx`**: New component for OTP entry after registration
- **Create `/auth/verify-otp/page.tsx`**: New route
- **Create `/auth/forgot-password/page.tsx`**: New route with `useForgotPasswordMutation`
- **Create `/auth/reset-password/page.tsx`**: New route with `useResetPasswordMutation`

### 2.5 Route Protection
Create `src/middleware.ts` (replace `proxy.ts`):
- Check for auth token on protected routes (`/dashboard/*`, `/checkout`)
- Redirect unauthenticated users to `/auth/signin`
- Redirect authenticated users away from `/auth/*` routes

### 2.6 Navbar Auth Integration
- Connect Navbar to Redux auth state
- Show user name/avatar when logged in
- Implement real logout (API call + clear Redux state)

### Unit Tests for Phase 2
```
src/redux/api/__tests__/authApi.test.ts
  - test: login mutation sends correct payload and stores tokens
  - test: login mutation handles 401 invalid credentials
  - test: register mutation sends correct payload
  - test: register mutation handles 400 validation errors (duplicate email)
  - test: logout mutation blacklists refresh token and clears state
  - test: verifyOtp mutation sends phone + otp
  - test: resendOtp mutation sends phone number
  - test: forgotPassword mutation sends email
  - test: resetPassword mutation sends token + new passwords
  - test: getProfile query returns user profile
  - test: updateProfile mutation sends partial update

src/redux/api/__tests__/baseApi.test.ts
  - test: Authorization header includes "Bearer " prefix
  - test: baseQueryWithReauth retries request on 401 with refreshed token
  - test: baseQueryWithReauth dispatches logout on refresh failure
  - test: requests without token don't include Authorization header

src/redux/features/auth/__tests__/authSlice.test.ts
  - test: initial state has null user and tokens
  - test: setUser sets user and tokens
  - test: logout clears all auth state
  - test: selectIsAuthenticated returns true when token exists
  - test: selectIsAuthenticated returns false when token is null

src/components/Auth/__tests__/Signin.test.tsx
  - test: renders email and password fields
  - test: shows validation error for empty email
  - test: shows validation error for invalid email format
  - test: calls login mutation on valid submit
  - test: displays API error on failed login
  - test: redirects to home/dashboard on successful login
  - test: shows loading state during submission

src/components/Auth/__tests__/SignUp.test.tsx
  - test: renders separate first_name and last_name fields
  - test: shows validation error for mismatched passwords
  - test: calls register mutation on valid submit
  - test: redirects to OTP verification after successful registration

src/components/Auth/__tests__/OtpVerification.test.tsx
  - test: renders 6-digit OTP input
  - test: calls verifyOtp mutation on submit
  - test: resend OTP button calls resendOtp mutation
  - test: shows countdown timer after resend

src/middleware.test.ts
  - test: unauthenticated users are redirected from /dashboard
  - test: unauthenticated users are redirected from /checkout
  - test: authenticated users can access /dashboard
  - test: authenticated users are redirected away from /auth/signin
  - test: public routes are accessible without auth
```

---

## Phase 3: Cars API Integration
**Priority:** High -- core user-facing feature
**Estimated Effort:** 3-4 days
**Dependencies:** Phase 1, Phase 2

### 3.1 Create Cars API Endpoints
Create `src/redux/api/carsApi.ts`:
```ts
endpoints: (builder) => ({
  getCars: builder.query<PaginatedResponse<CarListItem>, CarSearchParams>({ ... }),
  getCarById: builder.query<CarDetail, number>({ ... }),
  getCarAvailability: builder.query<any, CarAvailabilityParams>({ ... }),
  getCarBookedDates: builder.query<any, number>({ ... }),
  getCarChauffeurs: builder.query<PaginatedResponse<ChauffeurListItem>, { id: number; page?: number }>({ ... }),
  getNearbyCars: builder.query<PaginatedResponse<CarListItem>, { lat?: number; lng?: number; page?: number }>({ ... }),
})
```
Tag types: `['Car', 'CarList']`

### 3.2 Update Car Search Page
- Replace hardcoded `src/data/cars.ts` with `useGetCarsQuery`
- Wire all filter dropdowns to `CarSearchParams` query params
- Implement URL-based filter state (searchParams)
- Add loading skeletons and error states
- Implement real pagination with `PaginatedResponse`

### 3.3 Update Car Detail Page
- Replace `CAR_DATA` lookup with `useGetCarByIdQuery`
- Add `useGetCarBookedDatesQuery` to show unavailable dates in calendar
- Add `useGetCarAvailabilityQuery` for date validation
- Display real car images from `CarImage[]`
- Fix currency from `$` to BDT (Taka)
- Fix `PickupLocation.tsx` to show actual location from API data

### 3.4 Update Home Page Components
- `NearbyCars.tsx`: Use `useGetNearbyCarsQuery` with browser geolocation
- `BookingModule.tsx`: Wire search form to navigate to `/search-cars?params`

### 3.5 Create Pricing API Endpoint
Create `src/redux/api/pricingApi.ts`:
```ts
endpoints: (builder) => ({
  calculatePricing: builder.query<any, { car_id: number; start_date: string; end_date: string; drive_type: string }>({ ... }),
})
```
- Wire `PricingCard.tsx` to use real API pricing instead of client-side math

### Unit Tests for Phase 3
```
src/redux/api/__tests__/carsApi.test.ts
  - test: getCars returns paginated car list
  - test: getCars sends filter params as query string
  - test: getCars handles empty results
  - test: getCarById returns full car detail
  - test: getCarById handles 404 for non-existent car
  - test: getCarAvailability returns boolean availability
  - test: getCarBookedDates returns array of date strings
  - test: getCarChauffeurs returns paginated chauffeur list
  - test: getNearbyCars sends lat/lng params

src/components/SearchCar/__tests__/CarSearchPage.test.tsx
  - test: renders loading skeleton while fetching
  - test: renders car cards from API response
  - test: filter changes trigger new API request
  - test: pagination controls update page param
  - test: search input debounces and triggers search
  - test: empty results show "No cars found" message
  - test: error state displays retry button

src/components/SearchCar/__tests__/CarCard.test.tsx
  - test: renders car name, brand, price, image
  - test: displays correct category badge
  - test: "View Details" navigates to /search-cars/:id
  - test: price displayed in BDT format

src/components/CarDetails/__tests__/CarDetails.test.tsx
  - test: renders car detail from API
  - test: shows image gallery with all car images
  - test: displays correct pricing from API
  - test: booked dates shown as unavailable in calendar
  - test: "Continue to Book" navigates to /checkout with booking data

src/components/Home/__tests__/NearbyCars.test.tsx
  - test: requests geolocation permission
  - test: renders nearby cars from API
  - test: shows fallback when geolocation denied

src/redux/api/__tests__/pricingApi.test.ts
  - test: calculatePricing sends car_id, dates, drive_type
  - test: calculatePricing returns pricing breakdown
```

---

## Phase 4: Booking & Checkout Flow
**Priority:** High -- revenue-generating flow
**Estimated Effort:** 3-4 days
**Dependencies:** Phase 2, Phase 3

### 4.1 Create Bookings API Endpoints
Create `src/redux/api/bookingsApi.ts`:
```ts
endpoints: (builder) => ({
  getBookings: builder.query<PaginatedResponse<BookingListItem>, { status?: BookingStatus; page?: number }>({ ... }),
  getBookingById: builder.query<BookingDetail, number>({ ... }),
  createBooking: builder.mutation<BookingDetail, BookingCreateRequest>({ ... }),
  cancelBooking: builder.mutation<void, number>({ ... }),
  payBooking: builder.mutation<any, number>({ ... }),
})
```
Tag types: `['Booking', 'BookingList']`

### 4.2 Refactor Checkout Page
- Remove all hardcoded `DEMO_USER` and `CAR_DATA` references
- Read booking draft from URL params or state (not localStorage)
- Add Zod validation with `bookingCreateSchema`
- On submit: call `useCreateBookingMutation`
- On success: navigate to payment or booking confirmation
- Replace manual form validation with react-hook-form + Zod resolver
- Fix `CustomerInfo.tsx` to populate from `useGetProfileQuery`
- Remove insurance selector (not in API) or mark as future feature

### 4.3 Create Payment Flow
Create `src/redux/api/paymentsApi.ts`:
```ts
endpoints: (builder) => ({
  initiatePayment: builder.mutation<PaymentInitiateResponse, PaymentInitiateRequest>({ ... }),
})
```

Create payment redirect pages:
- `/payments/success/page.tsx` -- Show success message, link to booking detail
- `/payments/fail/page.tsx` -- Show failure message, retry option
- `/payments/cancel/page.tsx` -- Show cancellation message, return to booking

### 4.4 Wire Payment Methods
- `PaymentMethod.tsx`: On checkout submit, first create booking, then initiate payment
- SSLCommerz flow: redirect to `payment_url` from `initiatePayment` response
- Handle return redirects to `/payments/success|fail|cancel`

### Unit Tests for Phase 4
```
src/redux/api/__tests__/bookingsApi.test.ts
  - test: getBookings returns paginated list
  - test: getBookings filters by status
  - test: getBookingById returns full detail
  - test: createBooking sends correct payload
  - test: createBooking returns created booking with id
  - test: createBooking handles validation errors
  - test: cancelBooking sends POST to correct endpoint
  - test: cancelBooking only works for pending_payment status
  - test: payBooking initiates payment flow

src/redux/api/__tests__/paymentsApi.test.ts
  - test: initiatePayment returns payment_url
  - test: initiatePayment handles already-paid booking error

src/components/Checkout/__tests__/Checkout.test.tsx
  - test: renders vehicle card with booking data
  - test: renders customer info from user profile
  - test: validates required fields before submit
  - test: calls createBooking mutation on valid submit
  - test: shows loading state during booking creation
  - test: shows error toast on booking creation failure
  - test: navigates to payment after successful booking
  - test: back button returns to car detail

src/components/Checkout/__tests__/PaymentMethod.test.tsx
  - test: renders bKash, Nagad, Rocket wallet options
  - test: renders credit/debit card option
  - test: selected method is visually highlighted

src/app/(commonLayout)/payments/__tests__/success.test.tsx
  - test: renders success message with booking ID
  - test: link navigates to booking detail

src/app/(commonLayout)/payments/__tests__/fail.test.tsx
  - test: renders failure message
  - test: retry button initiates new payment
```

---

## Phase 5: Dashboard -- Profile, Trips, Bookings
**Priority:** High -- user account management
**Estimated Effort:** 3-4 days
**Dependencies:** Phase 2, Phase 4

### 5.1 Create Dashboard API Endpoint
Create `src/redux/api/dashboardApi.ts`:
```ts
endpoints: (builder) => ({
  getDashboardOverview: builder.query<DashboardOverview, void>({ ... }),
  getRefunds: builder.query<PaginatedResponse<any>, { page?: number }>({ ... }),
})
```

### 5.2 Wire Profile Section
- Replace `MOCK_USER` with `useGetProfileQuery`
- "Save Changes" calls `useUpdateProfileMutation`
- Show verification status badge
- Show phone verified status

### 5.3 Wire Documents Section
Create `src/redux/api/documentsApi.ts`:
```ts
endpoints: (builder) => ({
  getDocuments: builder.query<PaginatedResponse<UserDocument>, void>({ ... }),
  uploadDocument: builder.mutation<UserDocument, FormData>({ ... }),  // multipart
  deleteDocument: builder.mutation<void, number>({ ... }),
})
```
- Replace drop zone stubs with real upload using `useUploadDocumentMutation`
- Show upload status (pending/approved/rejected)
- Allow delete of rejected documents for re-upload

### 5.4 Wire Trips Section
Create `src/redux/api/tripsApi.ts`:
```ts
endpoints: (builder) => ({
  getTrips: builder.query<PaginatedResponse<TripListItem>, { status?: TripStatus; page?: number }>({ ... }),
  getTripById: builder.query<TripDetail, number>({ ... }),
  completeTrip: builder.mutation<void, number>({ ... }),
  getTripPhotos: builder.query<PaginatedResponse<TripPhoto>, { id: number; page?: number }>({ ... }),
  uploadPrePhotos: builder.mutation<void, { id: number; photos: FormData }>({ ... }),
  uploadPostPhotos: builder.mutation<void, { id: number; photos: FormData }>({ ... }),
})
```
- Replace `MOCK_TRIPS` with `useGetTripsQuery`
- Wire trip cards to real data
- Implement trip photo upload (pre/post)
- Implement trip completion action

### 5.5 Wire Bookings in Dashboard
- Add "Bookings" tab to dashboard (from API `getBookings`)
- Wire Cancel button to `useCancelBookingMutation`
- Wire Pay button to payment flow
- Show booking status badges correctly

### 5.6 Wire Dashboard Overview
- Replace mock dashboard data with `useGetDashboardOverviewQuery`
- Show upcoming bookings count, active trips, pending payments

### Unit Tests for Phase 5
```
src/redux/api/__tests__/dashboardApi.test.ts
  - test: getDashboardOverview returns upcoming, active, pending
  - test: getRefunds returns paginated refund list

src/components/Dashboard/__tests__/ProfileSection.test.tsx
  - test: renders profile data from API
  - test: edit mode enables form fields
  - test: save calls updateProfile mutation
  - test: shows success toast on save
  - test: shows validation errors for invalid data
  - test: shows verification status badge

src/components/Dashboard/__tests__/DocumentsSection.test.tsx
  - test: renders existing documents with status badges
  - test: upload triggers uploadDocument mutation
  - test: shows upload progress indicator
  - test: delete button appears only for rejected documents
  - test: delete calls deleteDocument mutation

src/components/Dashboard/__tests__/TripsSection.test.tsx
  - test: renders trips from API
  - test: tab switching filters by trip status
  - test: trip card shows correct status, dates, car name
  - test: "Complete Trip" button calls completeTrip mutation
  - test: photo upload section appears for active trips

src/components/Dashboard/__tests__/BookingsSection.test.tsx
  - test: renders bookings list from API
  - test: cancel button calls cancelBooking mutation
  - test: pay button initiates payment flow
  - test: status filter works correctly

src/components/Dashboard/__tests__/UserDashboard.test.tsx
  - test: renders all tabs
  - test: tab switching changes content
  - test: default tab is "Trips"
  - test: shows loading state for all sections
```

---

## Phase 6: Chauffeurs & Reviews
**Priority:** Medium -- enhances booking experience
**Estimated Effort:** 2-3 days
**Dependencies:** Phase 3, Phase 4

### 6.1 Create Chauffeur API Endpoints
Create `src/redux/api/chauffeursApi.ts`:
```ts
endpoints: (builder) => ({
  getChauffeurs: builder.query<PaginatedResponse<ChauffeurListItem>, { page?: number; search?: string }>({ ... }),
  getChauffeurById: builder.query<ChauffeurDetail, number>({ ... }),
  getChauffeurReviews: builder.query<PaginatedResponse<ChauffeurReview>, { id: number; page?: number }>({ ... }),
  createChauffeurReview: builder.mutation<any, { id: number; data: ChauffeurReviewCreateRequest }>({ ... }),
  updateChauffeurReview: builder.mutation<void, { chauffeurId: number; reviewId: number; data: any }>({ ... }),
  deleteChauffeurReview: builder.mutation<void, { chauffeurId: number; reviewId: number }>({ ... }),
})
```

### 6.2 Create Chauffeur Pages
- Create `/chauffeurs/page.tsx` -- List all chauffeurs
- Create `/chauffeurs/[id]/page.tsx` -- Chauffeur detail with reviews
- Wire car detail page chauffeur selection (for `with_chauffeur` bookings)

### 6.3 Implement Review System
- Create `ReviewForm.tsx` component with star rating + text
- Show reviews on chauffeur detail page
- Allow review creation after completed trip
- Allow edit/delete of own reviews

### Unit Tests for Phase 6
```
src/redux/api/__tests__/chauffeursApi.test.ts
  - test: getChauffeurs returns paginated list
  - test: getChauffeurById returns detail with bio, rating
  - test: getChauffeurReviews returns paginated reviews
  - test: createChauffeurReview sends rating + booking_id
  - test: createChauffeurReview handles duplicate review error
  - test: updateChauffeurReview sends updated data
  - test: deleteChauffeurReview sends DELETE request

src/components/Chauffeurs/__tests__/ChauffeurList.test.tsx
  - test: renders chauffeur cards with photo, name, rating
  - test: search input filters chauffeurs
  - test: pagination works

src/components/Chauffeurs/__tests__/ChauffeurDetail.test.tsx
  - test: renders chauffeur bio, experience, rating
  - test: shows reviews list
  - test: review form appears for authenticated users

src/components/Chauffeurs/__tests__/ReviewForm.test.tsx
  - test: star rating selection works (1-5)
  - test: validates minimum 1 star
  - test: submits review with rating and text
  - test: shows success message after submission
  - test: edit mode pre-fills existing review data
```

---

## Phase 7: Notifications System
**Priority:** Medium -- enhances UX
**Estimated Effort:** 1-2 days
**Dependencies:** Phase 2

### 7.1 Create Notifications API Endpoints
Create `src/redux/api/notificationsApi.ts`:
```ts
endpoints: (builder) => ({
  getNotifications: builder.query<PaginatedResponse<Notification>, { is_read?: boolean; page?: number }>({ ... }),
  markAsRead: builder.mutation<void, number>({ ... }),
  getUnreadCount: builder.query<{ count: number }, void>({ ... }),
})
```

### 7.2 Implement Notification UI
- Create notification bell icon in Navbar with unread count badge
- Create notification dropdown/panel
- Mark as read on click
- Wire dashboard Inbox section to use notifications API instead of `MOCK_MESSAGES`
- Poll for unread count periodically (or use `refetchOnFocus`)

### Unit Tests for Phase 7
```
src/redux/api/__tests__/notificationsApi.test.ts
  - test: getNotifications returns paginated list
  - test: getNotifications filters by is_read
  - test: markAsRead sends PATCH request
  - test: getUnreadCount returns count number

src/components/Notifications/__tests__/NotificationBell.test.tsx
  - test: shows unread count badge when count > 0
  - test: hides badge when count is 0
  - test: click opens notification panel
  - test: notification items display subject and time

src/components/Notifications/__tests__/NotificationPanel.test.tsx
  - test: renders notification list
  - test: clicking notification marks it as read
  - test: unread notifications have distinct style
  - test: "Mark all as read" button works
  - test: empty state shows "No notifications"
```

---

## Phase 8: Polish, Missing Pages & E2E
**Priority:** Low-Medium -- quality and completeness
**Estimated Effort:** 2-3 days
**Dependencies:** All previous phases

### 8.1 Create Missing Static Pages
- `/about` -- About Go Gaari
- `/how-it-works` -- Step-by-step guide
- `/pricing` -- Pricing tiers
- `/faqs` -- FAQ with accordion (can reuse `SupportSection` FAQ data)
- `/terms` -- Terms of service
- `/privacy` -- Privacy policy
- `/cancellation` -- Cancellation policy
- `/support` -- Contact & support

### 8.2 Fix Remaining UI Issues
- Fix `Pagination.tsx` purple color to brand green
- Remove commented-out `DeleteModal.tsx`
- Consolidate duplicate `cn()` utility (keep only `src/lib/utils.ts`)
- Remove or consolidate `OrderSummary.tsx` duplicate
- Fix all currency to BDT
- Fix hardcoded San Francisco location

### 8.3 Error Handling & Edge Cases
- Global error boundary component
- API error toast notifications (using Sonner)
- 401 -> redirect to login
- Network error retry UI
- Loading skeleton components for all pages

### 8.4 Performance
- Add React.lazy/Suspense for route-level code splitting
- Image optimization (next/image with API image URLs)
- RTK Query cache management and tag invalidation strategy

### Unit Tests for Phase 8
```
src/components/__tests__/ErrorBoundary.test.tsx
  - test: catches rendering errors and shows fallback
  - test: retry button re-renders child component

src/components/__tests__/Pagination.test.tsx
  - test: renders correct number of page buttons
  - test: current page is highlighted
  - test: clicking page calls onChange handler
  - test: previous/next buttons work correctly
  - test: uses brand green color (not purple)

src/app/__tests__/not-found.test.tsx
  - test: 404 page renders with correct message
  - test: "Go Home" link navigates to /

Integration Tests:
  - test: Full login -> search -> detail -> checkout flow
  - test: Full registration -> OTP -> profile setup flow
  - test: Dashboard renders all tabs with real API data
```

---

## Phase Dependency Graph

```
Phase 0 (Testing Setup)
    |
    v
Phase 1 (Types & Schemas)
    |
    v
Phase 2 (Auth System) ─────────────────────┐
    |                                        |
    ├──> Phase 3 (Cars API) ──┐              |
    |                         |              |
    |                         v              |
    |    Phase 4 (Bookings & Checkout) <─────┘
    |         |
    |         v
    ├──> Phase 5 (Dashboard)
    |
    ├──> Phase 6 (Chauffeurs & Reviews)
    |
    ├──> Phase 7 (Notifications)
    |
    v
Phase 8 (Polish & E2E)
```

---

## Summary Table

| Phase | Name | Files to Create/Modify | New Tests | Est. Days |
|---|---|---|---|---|
| 0 | Testing Infrastructure | ~6 new config/setup files | 5 | 1-2 |
| 1 | Types & Schemas | ~12 new type/schema files | 20+ | 2-3 |
| 2 | Auth System | ~10 files (API, UI, middleware) | 30+ | 3-4 |
| 3 | Cars API | ~6 API files + refactor 8 components | 25+ | 3-4 |
| 4 | Booking & Checkout | ~5 API files + refactor 6 components + 3 new pages | 20+ | 3-4 |
| 5 | Dashboard | ~4 API files + refactor 8 components | 25+ | 3-4 |
| 6 | Chauffeurs & Reviews | ~3 API files + 4 new pages/components | 15+ | 2-3 |
| 7 | Notifications | ~2 API files + 3 new components | 12+ | 1-2 |
| 8 | Polish & E2E | ~8 static pages + misc fixes | 10+ | 2-3 |
| **Total** | | **~60+ files** | **~160+ tests** | **~20-27 days** |

---

## Running Tests

After Phase 0 setup, all tests can be run with:
```bash
npm test              # Watch mode
npm run test:run      # Single run (CI)
npm run test:coverage # With coverage report
```

Each phase should achieve >90% coverage for its new code before moving to the next phase.
