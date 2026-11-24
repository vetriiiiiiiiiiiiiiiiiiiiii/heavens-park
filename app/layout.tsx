import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Amiri, Aref_Ruqaa, Cairo, Tajawal, Aladin, Marhey } from "next/font/google";
import "./globals.css";
import { LangProvider, type Lang } from "@/components/i18n/LangProvider";
import { AudioProvider, SoundToggle } from "@/components/audio/AudioProvider";
import { Intro } from "@/components/intro/Intro";
import { LanternLayer } from "@/components/atmosphere/Atmosphere";
import { Header, MobileActionBar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/ui/Reveal";
import { MotionDirector } from "@/components/motion/Motion";
import { restaurant } from "@/content/restaurant";

const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--font-amiri", display: "swap" });
const ruqaa = Aref_Ruqaa({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-ruqaa", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600"], variable: "--font-cairo", display: "swap" });
const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700"], variable: "--font-tajawal", display: "swap" });
const aladin = Aladin({ subsets: ["latin"], weight: "400", variable: "--font-aladin", display: "swap" });
const marhey = Marhey({ subsets: ["arabic", "latin"], weight: ["400", "500", "600"], variable: "--font-marhey", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: { default: "Heavens Park — Arabian Restaurant", template: "%s · Heavens Park" },
  description: "Mandi, kabsa and charcoal grills in an Arabian courtyard lit by lanterns. Reserve your table at Heavens Park.",
  openGraph: { type: "website", siteName: "Heavens Park", locale: "en", alternateLocale: ["ar"] },
};

export const viewport: Viewport = { themeColor: "#071D19", width: "device-width", initialScale: 1 };

// Runs before paint: hide the intro for returning visitors so there is no flash.
const introScript = `try{document.documentElement.dataset.intro=localStorage.getItem('hp_intro_seen')==='1'?'seen':'show'}catch(e){document.documentElement.dataset.intro='seen'}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: restaurant.name.en,
  servesCuisine: ["Arabian", "Middle Eastern", "Yemeni", "Gulf"],
  telephone: restaurant.phoneE164,
  address: { "@type": "PostalAddress", streetAddress: restaurant.address.line1.en, addressLocality: restaurant.address.line2.en },
  acceptsReservations: true,
  menu: "/menu",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const saved = jar.get("hp_lang")?.value;
  const lang: Lang = saved === "ar" || saved === "en" ? saved : restaurant.defaultLang;
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${amiri.variable} ${ruqaa.variable} ${cairo.variable} ${tajawal.variable} ${aladin.variable} ${marhey.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <LangProvider initial={lang}>
          <AudioProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Intro />
            <LanternLayer />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <MobileActionBar />
            <SoundToggle floating className="xl:hidden" />
            <RevealObserver />
            <MotionDirector />
          </AudioProvider>
        </LangProvider>
      </body>
    </html>
  );
}
