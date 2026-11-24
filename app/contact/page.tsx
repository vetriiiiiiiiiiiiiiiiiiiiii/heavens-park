import type { Metadata } from "next";
import { GirihBand, Merlons } from "@/components/ui/Arabic";
import { Location, PageHero } from "@/components/home/Sections";

export const metadata: Metadata = { title: "Contact & Location", description: "Address, opening hours, directions, phone and WhatsApp for Heavens Park." };

export default function ContactPage() {
  return (
    <>
      <PageHero k="entrance" ar="أهلاً بكم" eyebrow={{ en: "Contact", ar: "تواصل معنا" }} title={{ en: "Find your way", ar: "اعثر على طريقك" }} titleEm={{ en: "to our door.", ar: "إلى بابنا." }} />
      <Merlons from="var(--color-midnight)" to="var(--color-ivory)" />
      <Location />
      <Merlons from="var(--color-midnight)" to="var(--color-ivory)" flip />
    </>
  );
}
