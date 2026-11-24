import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/home/Sections";
import { ManageBooking } from "@/components/booking/ManageBooking";

export const metadata: Metadata = { title: "Manage your booking", robots: { index: false } };

export default function ManagePage() {
  return (
    <>
      <PageHero k="majlis" eyebrow={{ en: "Reservations", ar: "الحجوزات" }} title={{ en: "Manage", ar: "إدارة" }} titleEm={{ en: "your booking.", ar: "حجزك." }} />
      <section className="res-page" style={{ gridTemplateColumns: "1fr" }}>
        <Suspense>
          <ManageBooking />
        </Suspense>
      </section>
    </>
  );
}
