# Jadeeed — client demo

A lightweight, front-end-only version of the Jadeeed workspace for showing leads what the product does.
No backend, no auth, no APIs: everything is stored in the browser's `localStorage`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build: `npm run build && npm start`.
Deploys as-is to Vercel or Netlify (no environment variables needed).

## What works

Same screens, copy and styling as the full app:

- **Overview / Events** — stats, recent events, create an event (type-based function templates for Mayun, Dholki, Mehendi, Nikkah, Barat, Rukhsati, Walima…)
- **Event workspace** — functions (dates, times, venues, guests, budget), event details and status
- **Guests** — households, side, party size, per-function invites and RSVPs
- **Vendors** — reusable vendor book + per-event bookings with quotes, payments and status
- **Tasks**, **Notes & docs** — with per-item "show on client portal"
- **Client portal** (`/p/<token>`) — shareable link, PIN, section toggles, regenerate link
- **Settings** — studio name, tagline, contact, brand colour (applied to the portal)

## How data works

- The first visit loads sample data (a Lahore wedding, an engagement, a Milad inquiry and a completed corporate dinner). Dates are relative to the day it first loads.
- Every change is saved in the browser and survives reloads.
- **Settings → Reset demo data** restores the sample data. Handy between demos.
- Data is per browser. The client portal link works in the same browser (open it in a second tab to show the client's view); it can't be opened from another device.

## What was left out

Clerk sign-in, Neon/Drizzle database, server actions and the Next.js proxy are removed. The portal PIN is stored as plain text (demo only).
