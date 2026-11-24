import { NextResponse } from "next/server";

/**
 * Real Google reviews via Places API (New). Configure GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID.
 * Without them we return { configured: false } and the site shows a link instead —
 * we never display invented testimonials.
 */
export const revalidate = 21600; // 6h

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const id = process.env.GOOGLE_PLACE_ID;
  if (!key || !id) return NextResponse.json({ configured: false });
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri" },
      next: { revalidate: 21600 },
    });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    type GR = { rating: number; text?: { text: string }; originalText?: { text: string }; authorAttribution?: { displayName: string; photoUri?: string }; relativePublishTimeDescription?: string };
    const reviews = ((j.reviews || []) as GR[])
      .filter((x) => x.rating >= 4 && (x.originalText?.text || x.text?.text))
      .map((x) => ({
        rating: x.rating,
        text: x.originalText?.text || x.text?.text,
        author: x.authorAttribution?.displayName || "Google user",
        when: x.relativePublishTimeDescription || "",
      }));
    return NextResponse.json({ configured: true, rating: j.rating, count: j.userRatingCount, url: j.googleMapsUri, reviews });
  } catch (e) {
    console.error("[reviews]", e);
    return NextResponse.json({ configured: true, error: true, reviews: [] });
  }
}
