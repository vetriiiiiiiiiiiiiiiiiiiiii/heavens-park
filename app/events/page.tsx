import type { Metadata } from "next";
import { Eyebrow, GirihBand, Merlons } from "@/components/ui/Arabic";
import { PageHero } from "@/components/home/Sections";
import { EnquiryForm, Occasions } from "@/components/home/Pages";
import { T } from "@/components/i18n/LangProvider";

export const metadata: Metadata = { title: "Events & Catering", description: "Private dining, family gatherings, corporate dinners, wedding catering, Ramadan iftar and Eid at Heavens Park." };

export default function EventsPage() {
  return (
    <>
      <PageHero k="sharing" ar="المناسبات" eyebrow={{ en: "Events & catering", ar: "المناسبات والولائم" }} title={{ en: "Gatherings", ar: "مجالس" }} titleEm={{ en: "worth remembering.", ar: "تُذكر." }} />
      <Merlons from="var(--color-midnight)" to="var(--color-ivory)" />
      <Occasions />
      <Merlons from="var(--color-emerald)" to="var(--color-ivory)" flip />
      <section className="enquiry" id="enquire" aria-labelledby="enq-title">
        <div>
          <Eyebrow en="Enquiries" ar="الاستفسارات" reveal={false} />
          <h2 id="enq-title" className="display book-band-title"><T en="Tell us about" ar="حدّثنا عن" /><br /><em><T en="your gathering." ar="مناسبتك." /></em></h2>
          <p className="lede"><T en="Share a few details and our events host will shape a menu and space around you." ar="شاركنا بعض التفاصيل، وسيصمّم مسؤول المناسبات قائمة ومكاناً يناسبانك." /></p>
        </div>
        <EnquiryForm />
      </section>
    </>
  );
}
