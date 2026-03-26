# BottleCollect

A mobile-first web app for collecting and recycling deposit bottles and cans. Think of it as an **"Uber for bottle recycling"** — clients request pickups, drivers collect and earn money.

Available in Polish and English.

## How it works

### For Clients (bottle givers)

1. Select "I want to give bottles" on the home screen
2. Create a collection request — pick a location on the map or type an address (auto-geocoded), choose bottle types (cans, plastic, glass — or a mix), and specify the quantity
3. Track your requests, cancel pending ones, or archive completed jobs
4. Rate the driver after collection is done

### For Drivers (bottle collectors)

1. Select "I want to collect bottles" on the home screen
2. Browse available jobs in a list with filters, or view them all on an interactive map with multiple pins
3. Accept a job, start the pickup, and mark it as collected
4. Track your earnings in the stats dashboard
5. Rate the client after collection

### Earnings model

| Type | Price per item |
|------|---------------|
| Cans | 0.50 zl |
| Plastic | 0.50 zl |
| Glass | 1.00 zl |

The total value is split: **20% to client**, **8 zl service fee**, **rest to driver**.

## Features

- **Interactive maps** — Leaflet-based map picker for creating jobs + multi-marker overview map for drivers
- **Address geocoding** — type an address and it auto-searches via OpenStreetMap Nominatim, restricted to Poland
- **Filters & sorting** — filter jobs by type (cans/plastic/glass), status (pending/in progress/completed/cancelled), sort by date or value, search by address
- **Dark mode** — toggle in bottom nav, persisted to localStorage, auto-detects system preference
- **i18n** — full Polish and English translations, switchable on home screen
- **Star ratings** — separate ratings for client and driver, low ratings (1-2 stars) trigger a feedback form
- **Job archiving** — archive completed/cancelled jobs to keep the list clean, view them in a separate tab
- **Confirmation modals** — before accepting jobs, changing status, cancelling, or archiving
- **Toast notifications** — feedback on every action (job created, accepted, status changed, etc.)
- **Onboarding** — 3-slide intro for first-time users, skippable
- **Earnings dashboard** — total earnings, completed jobs count, average per job, full history with ratings
- **Withdraw button** — placeholder for future payment integration
- **Skeleton loaders** — animated placeholders while data loads
- **Error boundary** — friendly error screen instead of white page crashes
- **PWA-ready** — web app manifest with icons, installable on mobile
- **SEO** — Open Graph and Twitter meta tags
- **Poland-only** — location validation ensures jobs are created within Poland
- **Estimated distance** — haversine distance from your location to the pickup point

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Maps | Leaflet + react-leaflet |
| Geocoding | OpenStreetMap Nominatim API |
| Storage | Browser localStorage |
| Linting | ESLint 9 + Next.js config |

## Project structure

```
src/
  app/
    page.tsx              # Home — role selection + onboarding
    create/page.tsx       # Create job request (map + form)
    jobs/page.tsx         # Job list with filters, search, archive tab
    job/[id]/page.tsx     # Job detail — status flow, earnings, rating
    map/page.tsx          # Multi-marker map of all active jobs
    stats/page.tsx        # Earnings dashboard + history
    layout.tsx            # Root layout with providers (theme, locale, toast, error boundary)
    globals.css           # Tailwind imports, animations, dark mode config
  components/
    BottomNav.tsx         # Role-aware navigation with dark mode toggle
    ConfirmModal.tsx      # Reusable confirmation dialog
    ErrorBoundary.tsx     # React error boundary
    FormInput.tsx         # Styled form input with validation
    JobCard.tsx           # Job preview card with status, time-ago, earnings
    LocaleProvider.tsx    # i18n context (PL/EN)
    MapInner.tsx          # Single-marker Leaflet map
    MapPicker.tsx         # SSR-safe map wrapper
    MultiMarkerMapInner.tsx  # Multi-marker Leaflet map with popups + fit bounds
    MultiMarkerMap.tsx    # SSR-safe multi-marker wrapper
    Onboarding.tsx        # 3-slide onboarding flow
    Skeleton.tsx          # Skeleton loading states
    StarRating.tsx        # Interactive/readonly star rating
    ThemeProvider.tsx      # Dark/light mode context
    ToastProvider.tsx     # Toast notification system
  lib/
    i18n.ts              # Translation strings (EN + PL)
    storage.ts           # localStorage API (jobs, role, locale)
    types.ts             # TypeScript types (Job, JobType, JobStatus, etc.)
public/
    manifest.json        # PWA manifest
    icon-192.svg         # App icon 192x192
    icon-512.svg         # App icon 512x512
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```
