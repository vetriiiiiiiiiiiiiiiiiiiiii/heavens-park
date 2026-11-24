"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { MediaKey } from "@/content/media";
import { allergenLabels, menu } from "@/content/menu";
import { restaurant } from "@/content/restaurant";
import { useLang, T } from "@/components/i18n/LangProvider";
import { Photo } from "@/components/ui/Photo";
import { Rule } from "@/components/ui/Ornament";
import { Arabesque, num } from "@/components/ui/Arabic";

const AR_NUM = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function MenuBook() {
  const { t, lang } = useLang();
  const [active, setActive] = useState(menu[0].id);
  const [peek, setPeek] = useState<MediaKey | null>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const mover = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  // floating dish preview that trails the cursor (desktop, fine pointer only)
  useEffect(() => {
    const el = peekRef.current;
    if (!el || !window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    mover.current = {
      x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" }),
    };
    const move = (e: PointerEvent) => {
      mover.current?.x(e.clientX + 28);
      mover.current?.y(e.clientY - 120);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    menu.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.querySelector(`.menu-nav a[href="#${active}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <>
      <nav className="menu-nav" aria-label="Menu categories">
        <ul>
          {menu.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className={active === c.id ? "is-active" : ""}>
                {t(c.title)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={peekRef} className={`menu-peek ${peek ? "is-on" : ""}`} aria-hidden>
        {peek && <Photo k={peek} sizes="260px" />}
      </div>
      <div className="menu-book paper">
        <div className="menu-legend">
          <span>
            <i className="diet diet--veg" /> <T en="Vegetarian" ar="نباتي" />
          </span>
          <span>
            <i className="diet diet--nonveg" /> <T en="Non-vegetarian" ar="غير نباتي" />
          </span>
          {restaurant.halalCertified && (
            <span>
              <b className="font-arabic text-[18px] text-brass">حلال</b> <T en="All meat certified halal" ar="جميع اللحوم حلال معتمدة" />
            </span>
          )}
          <span>
            <T en="Prices in" ar="الأسعار بـ" /> {restaurant.currency} · <T en="taxes as applicable" ar="تُضاف الضرائب حسب الأنظمة" />
          </span>
        </div>
        <Rule className="justify-center text-brass" />

        {menu.map((c, ci) => (
          <section key={c.id} id={c.id} className="menu-cat" aria-labelledby={`${c.id}-h`}>
            <header className="menu-cat-head">
              <span className="menu-cat-num">{AR_NUM[ci]}</span>
              <h2 id={`${c.id}-h`} className="display menu-cat-title">
                {t(c.title)}
              </h2>
              <p className="menu-cat-ar" lang={lang === "ar" ? "en" : "ar"}>
                {lang === "ar" ? c.title.en : c.title.ar}
              </p>
              <Arabesque className="arabesque--menu" />
              <p className="menu-cat-intro">{t(c.intro)}</p>
              {c.image && <Photo k={c.image} frame={ci % 3 === 0 ? "arch" : "none"} className="menu-cat-photo" sizes="(max-width: 1024px) 100vw, 35vw" />}
            </header>

            <div className="menu-cat-dishes">
              {c.dishes.map((d) => (
                <article key={d.id} className={`dish ${d.image ? "dish--has-photo" : ""}`} onPointerEnter={() => d.image && mover.current && setPeek(d.image)} onPointerLeave={() => setPeek(null)}>
                  <h3 className="dish-name">
                    <i className={`diet ${d.veg ? "diet--veg" : "diet--nonveg"}`} aria-label={d.veg ? "Vegetarian" : "Non-vegetarian"} role="img" />
                    {t(d.name)}
                    {d.signature && (
                      <span className="dish-sig">
                        <T en="Signature" ar="مميز" />
                      </span>
                    )}
                  </h3>
                  <span className="dish-price" dir="ltr">
                    {restaurant.currency}
                    {num(d.price, lang)}
                  </span>
                  <span className="dish-alt" lang={lang === "ar" ? "en" : "ar"}>
                    {lang === "ar" ? d.name.en : d.name.ar}
                  </span>
                  <p className="dish-desc">{t(d.desc)}</p>
                  {(d.allergens?.length || typeof d.price === "string") && (
                    <p className="dish-meta">
                      {typeof d.price === "string" && <span>{lang === "ar" ? "نصف / كامل" : "Half / Full"}</span>}
                      {d.allergens?.length ? (
                        <span>
                          {lang === "ar" ? "يحتوي على: " : "Contains: "}
                          {d.allergens.map((a) => t(allergenLabels[a])).join(", ")}
                        </span>
                      ) : null}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        <p className="text-center text-[14px] text-[#6d6452] mt-10 max-w-[60ch] mx-auto">
          <T
            en="Please tell your host about any allergy or dietary requirement before ordering. Dishes are prepared in a kitchen that handles nuts, gluten, sesame and dairy."
            ar="يرجى إبلاغ المضيف بأي حساسية أو متطلبات غذائية قبل الطلب. تُحضَّر الأطباق في مطبخ يتعامل مع المكسرات والغلوتين والسمسم والألبان."
          />
        </p>
      </div>
    </>
  );
}
