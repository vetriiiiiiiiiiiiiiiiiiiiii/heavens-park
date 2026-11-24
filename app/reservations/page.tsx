import type { Metadata } from "next";
import { GirihBand, Merlons } from "@/components/ui/Arabic";
import { PageHero } from "@/components/home/Sections";
import { BookingForm } from "@/components/booking/BookingForm";
import { ReservationAside } from "@/components/home/Pages";

export const metadata: Metadata = { title: "Reservations", description: "Reserve a table at Heavens Park — family seating, private rooms or the outdoor courtyard." };

export default function ReservationsPage() {
  return (
    <>
      <PageHero k="privateDining" ar="احجز طاولتك" eyebrow={{ en: "Reservations", ar: "الحجوزات" }} title={{ en: "Your table,", ar: "طاولتك،" }} titleEm={{ en: "kept for you.", ar: "محفوظة لك." }} />
      <GirihBand />
      <section className="res-page">
        <ReservationAside />
        <BookingForm />
      </section>
    </>
  );
}
