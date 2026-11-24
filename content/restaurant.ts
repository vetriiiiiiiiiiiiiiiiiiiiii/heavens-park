/**
 * ─────────────────────────────────────────────────────────────
 *  RESTAURANT DETAILS — edit this file to update the whole site.
 *  Values marked  // SAMPLE  are placeholders awaiting real data.
 * ─────────────────────────────────────────────────────────────
 */

export type Bi = { en: string; ar: string };

export const restaurant = {
  /** Language for first-time visitors ("en" or "ar"). Visitors can always switch. */
  defaultLang: "en" as "en" | "ar",

  name: { en: "Heavens Park", ar: "هيفنز بارك" } as Bi, // Arabic: transliteration — confirm with owner
  tagline: {
    en: "An Arabian courtyard, after dark.",
    ar: "فناءٌ عربيّ… حين يحلّ المساء.",
  } as Bi,

  // SAMPLE — replace with the real address
  address: {
    line1: { en: "Heavens Park, Main Road", ar: "هيفنز بارك، الطريق الرئيسي" } as Bi,
    line2: { en: "City, State 000000", ar: "المدينة، الولاية ٠٠٠٠٠٠" } as Bi,
  },
  // Used for the Google Maps embed + directions link. Replace with exact place name or "lat,lng".
  mapQuery: "Heavens Park Arabian Restaurant", // SAMPLE

  phone: "+91 90000 00000", // SAMPLE — display format
  phoneE164: "+919000000000", // SAMPLE — used for tel: links
  whatsapp: "919000000000", // SAMPLE — digits only, used for wa.me links
  email: "hello@heavenspark.example", // SAMPLE

  timeZone: "Asia/Kolkata",
  currency: "₹",

  /** Shown on the site AND used by the booking engine. 24h "HH:MM". */
  hours: [
    { days: { en: "Monday – Thursday", ar: "الاثنين – الخميس" }, open: "12:00", close: "23:30" },
    { days: { en: "Friday", ar: "الجمعة" }, open: "13:30", close: "23:59" },
    { days: { en: "Saturday – Sunday", ar: "السبت – الأحد" }, open: "12:00", close: "23:59" },
  ],
  /** Day-of-week (0 = Sunday) → opening window, used for booking slots. */
  bookingHours: {
    0: ["12:00", "23:59"],
    1: ["12:00", "23:30"],
    2: ["12:00", "23:30"],
    3: ["12:00", "23:30"],
    4: ["12:00", "23:30"],
    5: ["13:30", "23:59"],
    6: ["12:00", "23:59"],
  } as Record<number, [string, string]>,

  /** Only set true once halal certification has been verified. */
  halalCertified: false,

  social: {
    instagram: "", // e.g. "https://instagram.com/heavenspark"
    facebook: "",
    googleReviews: "", // direct Google review link if available
  },
};

/** Booking engine configuration */
export const bookingConfig = {
  slotMinutes: 30,
  /** how long a table is held for one booking */
  sittingMinutes: 120,
  /** last booking this many minutes before closing */
  lastBookingBeforeClose: 90,
  /** earliest booking: now + this many minutes */
  minLeadMinutes: 60,
  maxDaysAhead: 60,
  maxGuests: 20,
  seating: {
    family: { capacity: 80, unit: "covers" as const, label: { en: "Family seating", ar: "جلسات عائلية" } },
    private: { capacity: 3, unit: "rooms" as const, maxGuests: 20, label: { en: "Private dining", ar: "غرفة خاصة" } },
    outdoor: { capacity: 30, unit: "covers" as const, label: { en: "Outdoor courtyard", ar: "الفناء الخارجي" } },
  },
};

export type Seating = keyof typeof bookingConfig.seating;
export const SEATINGS = Object.keys(bookingConfig.seating) as Seating[];

export const occasions: { id: string; label: Bi }[] = [
  { id: "", label: { en: "None", ar: "لا شيء" } },
  { id: "birthday", label: { en: "Birthday", ar: "عيد ميلاد" } },
  { id: "anniversary", label: { en: "Anniversary", ar: "ذكرى زواج" } },
  { id: "family", label: { en: "Family gathering", ar: "تجمّع عائلي" } },
  { id: "business", label: { en: "Business dinner", ar: "عشاء عمل" } },
  { id: "iftar", label: { en: "Iftar", ar: "إفطار" } },
  { id: "other", label: { en: "Other", ar: "أخرى" } },
];

export const waLink = (text?: string) =>
  `https://wa.me/${restaurant.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telLink = `tel:${restaurant.phoneE164}`;
export const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.mapQuery)}`;
export const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(restaurant.mapQuery)}&output=embed`;
