import { z } from "zod";
import { bookingConfig, SEATINGS } from "@/content/restaurant";

/** Normalise a phone number to +digits. Accepts spaces, dashes, brackets. */
export function normalisePhone(raw: string) {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits.length === 10 ? `+91${digits}` : `+${digits}`;
}

const phone = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number")
  .max(24)
  .regex(/^[+\d][\d\s\-()]{6,}$/, "Please enter a valid phone number")
  .transform(normalisePhone)
  .refine((p) => p.length >= 9 && p.length <= 16, "Please enter a valid phone number");

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date");
const time = z.string().regex(/^\d{2}:\d{2}$/, "Choose a time");
const seating = z.enum(SEATINGS as [string, ...string[]]);

export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  phone,
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.string().email("Please enter a valid email").optional()),
  date,
  time,
  guests: z.coerce.number().int().min(1).max(bookingConfig.maxGuests),
  seating,
  occasion: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(500).optional(),
  locale: z.enum(["en", "ar"]).default("en"),
  website: z.string().max(0).optional(), // honeypot
});

export const modifySchema = z.object({
  phone,
  date,
  time,
  guests: z.coerce.number().int().min(1).max(bookingConfig.maxGuests),
  seating,
});

export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone,
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.string().email().optional()),
  eventType: z.string().trim().min(2).max(60),
  date: z.string().trim().max(20).optional(),
  guests: z.coerce.number().int().min(1).max(2000).optional(),
  message: z.string().trim().max(1500).optional(),
  website: z.string().max(0).optional(),
});

export function firstError(e: z.ZodError) {
  const i = e.issues[0];
  return { error: i.message, field: String(i.path[0] ?? "") };
}
