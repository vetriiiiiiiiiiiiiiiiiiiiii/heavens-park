"use client";

import Image from "next/image";
import { useState } from "react";
import { media, SHOW_REPRESENTATIVE_TAGS, type MediaKey } from "@/content/media";
import { useLang } from "@/components/i18n/LangProvider";

type Props = {
  k: MediaKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
  frame?: "arch" | "none";
  children?: React.ReactNode;
};

/** Art-directed image: fills its box, warm grade, optional arch frame. */
export function Photo({ k, className = "", sizes = "(max-width: 768px) 100vw, 50vw", priority, frame = "none", children }: Props) {
  const m = media[k];
  const [broken, setBroken] = useState(false);
  const { lang } = useLang();
  return (
    <div className={`photo ${frame === "arch" ? "photo--arch" : ""} ${className}`}>
      {!broken ? (
        <Image
          src={m.src}
          alt={m.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="photo-img"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="photo-fallback" role="img" aria-label={m.alt} />
      )}
      {children}
      {SHOW_REPRESENTATIVE_TAGS && "representative" in m && m.representative && (
        <span className="photo-tag">{lang === "ar" ? "صورة تعبيرية" : "Representative image"}</span>
      )}
    </div>
  );
}
