import type { Metadata } from "next";
import { GirihBand, Merlons } from "@/components/ui/Arabic";
import { PageHero } from "@/components/home/Sections";
import { MenuBook } from "@/components/home/MenuBook";

export const metadata: Metadata = { title: "Menu", description: "Mandi, kabsa, charcoal grills, shawarma, desserts and Arabic coffee at Heavens Park." };

export default function MenuPage() {
  return (
    <>
      <PageHero k="mixedGrill" ar="المائدة" eyebrow={{ en: "The menu", ar: "القائمة" }} title={{ en: "Made for", ar: "صُنعت" }} titleEm={{ en: "the middle of the table.", ar: "لوسط المائدة." }} />
      <Merlons from="var(--color-midnight)" to="var(--color-ivory)" />
      <MenuBook />
      <Merlons from="var(--color-midnight)" to="var(--color-ivory)" flip />
    </>
  );
}
