# BottleCollect

A mobile-first web app for collecting and recycling deposit bottles and cans. Think of it as an "Uber for bottle recycling" — clients request pickups, drivers collect and earn money.

## How it works

**Clients** create collection requests by placing a pin on the map, choosing the type of items (cans, plastic, glass), and specifying the quantity.

**Drivers** browse available jobs, accept them, and track the pickup through a simple status flow: Pending → In Progress → Completed.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Leaflet** + react-leaflet (maps)
- **localStorage** for data persistence

## Project structure

```
src/
  app/             # Pages (home, create, jobs, job detail)
  components/      # Reusable UI (JobCard, MapPicker, BottomNav, etc.)
  lib/             # Types and storage helpers
```
