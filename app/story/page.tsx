import type { Metadata } from "next";
import { GirihBand, Merlons } from "@/components/ui/Arabic";
import { PageHero } from "@/components/home/Sections";
import { StoryChapters } from "@/components/home/Pages";

export const metadata: Metadata = { title: "Our Story", description: "The heritage, kitchen and hospitality behind Heavens Park." };

export default function StoryPage() {
  return (
    <>
      <PageHero k="majlis" ar="حكايتنا" eyebrow={{ en: "Our story", ar: "حكايتنا" }} title={{ en: "Fire, rice", ar: "نارٌ وأرز" }} titleEm={{ en: "& patience.", ar: "وصبر." }} />
      <Merlons from="var(--color-midnight)" to="var(--color-ivory)" />
      <StoryChapters />
    </>
  );
}
