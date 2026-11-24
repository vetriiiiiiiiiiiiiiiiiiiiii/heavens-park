import { Atmosphere, BookingBand, Hero, Hospitality, Location, ReviewsSection, Signatures, StoryTeaser } from "@/components/home/Sections";
import { GirihBand, Merlons } from "@/components/ui/Arabic";
import { Marquee } from "@/components/home/Marquee";

const DARK = "var(--color-midnight)";
const IVORY = "var(--color-ivory)";
const SAND = "var(--color-sand)";

export default function Home() {
  return (
    <>
      <Hero />
      <Merlons from={DARK} to={IVORY} />
      <Atmosphere />
      <Merlons from={DARK} to={IVORY} flip />
      <Signatures />
      <Marquee />
      <Merlons from={DARK} to={SAND} />
      <StoryTeaser />
      <Merlons from={DARK} to={SAND} flip />
      <Hospitality />
      <GirihBand />
      <ReviewsSection />
      <GirihBand />
      <BookingBand />
      <Merlons from={DARK} to={IVORY} />
      <Location />
      <Merlons from={DARK} to={IVORY} flip />
    </>
  );
}
