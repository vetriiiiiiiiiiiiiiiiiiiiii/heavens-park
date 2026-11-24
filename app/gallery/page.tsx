import type { Metadata } from "next";
import { GirihBand, Merlons } from "@/components/ui/Arabic";
import { PageHero } from "@/components/home/Sections";
import { Gallery } from "@/components/home/Pages";

export const metadata: Metadata = { title: "Gallery", description: "Lantern light, charcoal and feasts at Heavens Park." };

export default function GalleryPage() {
  return (
    <>
      <PageHero k="grillFire" ar="لمحات" eyebrow={{ en: "Gallery", ar: "المعرض" }} title={{ en: "Glimpses of", ar: "لمحات من" }} titleEm={{ en: "the courtyard.", ar: "الفناء." }} />
      <GirihBand />
      <Gallery />
      <GirihBand />
    </>
  );
}
