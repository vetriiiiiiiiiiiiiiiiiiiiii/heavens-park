/**
 * MEDIA LIBRARY
 * Every image on the site is referenced from here, so swapping in the
 * restaurant's own photography is a one-file change.
 *
 * `representative: true` marks stock photography standing in for the
 * restaurant's own premises. While true, a small "Representative image"
 * tag is shown so no stock photo is presented as the real venue.
 * Replace `src` with real photos (Cloudinary or /public) and set it to false.
 *
 * Interior & souk photos: Unsplash License (free, no attribution required).
 * Stock rules for this venue: no alcohol or wine glasses, no pork, no visible
 * brands — and nothing behind sacred text except architecture.
 */

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80`;

export type Media = { src: string; alt: string; representative?: boolean; position?: string };

export const media = {
  // interiors (stock — representative)
  heroInterior: { src: u("1577214407836-1f3a0604ecb2"), alt: "Brass lanterns pierced with Islamic patterns, glowing at night", representative: true },
  majlis: { src: u("1527760127628-23c37a0c9af9"), alt: "A riad room with zellige tiles and low majlis seating", representative: true },
  familyDining: { src: u("1527760370098-806667fa3750"), alt: "A tiled courtyard doorway with an olive tree", representative: true },
  privateDining: { src: u("1555169048-ee590a06ab39"), alt: "Carved stucco arches around an inner court", representative: true },
  courtyard: { src: u("1527760370098-806667fa3750"), alt: "A tiled courtyard doorway with an olive tree", representative: true },
  openKitchen: { src: u("1769628702933-39ba968cb198"), alt: "Spices piled high, ready to be ground", representative: true },
  entrance: { src: u("1755003120720-29d4e6683a1d"), alt: "A horseshoe archway with geometric tilework", representative: true },
  hands: { src: u("1564624171349-46ed471bf4e3"), alt: "Brass dallahs for Arabic coffee", representative: true },

  // food (stock — illustrative of the dish)
  mandi: { src: u("1631515243349-e0cb75fb8d3a"), alt: "Chicken mandi on fragrant rice" },
  kabsa: { src: u("1512058564366-18510be2db19"), alt: "Spiced kabsa rice" },
  muttonMandi: { src: u("1563379091339-03b21ab4a4f8"), alt: "Slow-cooked rice with tender meat" },
  kebabs: { src: u("1603360946369-dc9bb6258143"), alt: "Charcoal-grilled kebab skewers" },
  grillFire: { src: u("1599487488170-d11ec9c172f0"), alt: "Skewers over glowing charcoal" },
  mixedGrill: { src: u("1555939594-58d7cb561ad1"), alt: "Mixed grill platter of kebabs" },
  skewersPlate: { src: u("1603360946369-dc9bb6258143"), alt: "Kebab skewers with sides" },
  shawarma: { src: u("1529006557810-274b9b2fc783"), alt: "Shawarma plate" },
  shawarmaSpit: { src: u("1530469912745-a215c6b256ea"), alt: "Shawarma turning on the spit" },
  wrap: { src: u("1633321702518-7feccafb94d5"), alt: "Shawarma wrap" },
  bread: { src: u("1606491956689-2ea866880c84"), alt: "Freshly baked bread" },
  stew: { src: u("1541518763669-27fef04b14ea"), alt: "Slow-cooked stew" },
  curry: { src: u("1565557623262-b51c2513a641"), alt: "Rich gravy with bread" },
  soup: { src: u("1534939561126-855b8675edd7"), alt: "Lentil soup" },
  salad: { src: u("1540189549336-e6e99c3679fe"), alt: "Fresh herb salad" },
  sambusa: { src: u("1601050690597-df0568f70950"), alt: "Crisp sambusa" },
  dessert: { src: u("1551024506-0bccd828d307"), alt: "Dessert" },
  chicken: { src: u("1561651823-34feb02250e4"), alt: "Grilled chicken" },

  // hospitality & souk
  spices: { src: u("1750387354022-484120f3dcd0"), alt: "Spices in the souk" },
  souk: { src: u("1662620883416-2b2854528b75"), alt: "An old market stall of spices and grains" },
  // gatherings
  sharing: { src: u("1648288725055-5ba4063355b9"), alt: "A bowl of dates, offered to every guest" },
  spread: { src: u("1563379091339-03b21ab4a4f8"), alt: "A large platter of mandi for the table" },
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof media;

/** Set false once all representative premises photos are replaced. */
export const SHOW_REPRESENTATIVE_TAGS = true;
