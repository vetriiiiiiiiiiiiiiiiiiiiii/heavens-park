# Heavens Park — website

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Prisma (SQLite locally, PostgreSQL in production).

## Run it

```bash
npm install
npx prisma db push      # creates prisma/dev.db
npm run dev             # http://localhost:3000
```

Staff dashboard: `/admin` — password is `ADMIN_PASSWORD` in `.env`.

## Where to edit content

| What | File |
|---|---|
| Name, address, phone, WhatsApp, hours, currency, halal flag | `content/restaurant.ts` |
| Booking capacity, slot length, sitting time, lead time | `content/restaurant.ts` → `bookingConfig` |
| Menu (dishes, prices, veg, allergens, photos) | `content/menu.ts` |
| Every photo on the site | `content/media.ts` |
| Islamic quotations + sources | `content/quotes.ts` |
| Oud soundtrack | drop a licensed file at `public/audio/oud.mp3`, then set `HAS_LICENSED_TRACK = true` in `components/audio/AudioProvider.tsx` |

Values marked `// SAMPLE` are placeholders that need the restaurant's real details.

## Before launch — checklist

- **Photography.** All images are Unsplash stock. Interior shots are tagged on-page as
  "Representative image" so stock is never passed off as the venue. Replace them with the
  restaurant's own photos in `content/media.ts`, then set `SHOW_REPRESENTATIVE_TAGS = false`.
- **Audio.** Without `public/audio/oud.mp3`, the site plays a soft generative oud-style
  ambience synthesised in the browser (royalty-free). Add a licensed track to replace it.
- **Details.** Address, phone, WhatsApp, email, prices — `content/restaurant.ts` and `content/menu.ts`.
- **Arabic.** The restaurant name is transliterated (هيفنز بارك). Have a native speaker review all Arabic copy.
- **Quotations.** Sahih al-Bukhari 6018 / Muslim 47 and Sahih al-Bukhari 5392 — please have them reviewed before publishing.
- **Halal.** The halal label only appears when `halalCertified: true`.
- **Reviews.** Set `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` to show real Google reviews. Without them the
  section links to Google — no testimonials are invented.
- **Confirmations.** Email (Resend) and SMS/WhatsApp (Twilio) send automatically once their env vars are set.
  The confirmation screen always offers WhatsApp and add-to-calendar.

## Production

1. In `prisma/schema.prisma` change `provider = "sqlite"` to `"postgresql"`, set `DATABASE_URL`, run `npx prisma db push`.
2. Set `SITE_URL`, a strong `ADMIN_PASSWORD` and `ADMIN_SECRET`.
3. `npm run build && npm start` (or deploy to Vercel).

The in-memory rate limiter is per instance; use Redis/Upstash when running several instances.

## How booking works

- `GET /api/availability` — slots for a date/seating/party size, computed from overlapping bookings
  against capacity (covers for family/outdoor, rooms for private dining).
- `POST /api/reservations` — validates, rejects past/closed times, blocks duplicates (same phone within one
  sitting), re-checks capacity inside a serializable transaction, returns an `HP-XXXXXX` reference.
- `GET/PATCH/DELETE /api/reservations/:ref` — guest lookup / change / cancel, verified by the booking phone number.
- `/admin` — bookings by date range, covers per seating, status changes, CSV export, event enquiries, subscriber count.
