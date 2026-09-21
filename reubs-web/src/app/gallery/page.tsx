"use client";

import { useMemo, useState } from "react";
import { Eyebrow, Photo } from "@/components/site/Photo";
import { gallerySets } from "@/lib/media";

const cats = ["All", ...Array.from(new Set(gallerySets.map((item) => item.cat)))];

export default function GalleryPage() {
  const [cat, setCat] = useState("All");
  const shots = useMemo(
    () => (cat === "All" ? gallerySets : gallerySets.filter((item) => item.cat === cat)),
    [cat],
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Photographs</Eyebrow>
      <h1 className="mt-3 font-display text-5xl">Gallery</h1>
      <p className="mt-4 max-w-2xl leading-8 text-muted">
        Campus, classrooms, sports, stage and making. Replace any image with a photograph taken at
        Reubs when the school has a set ready.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {cats.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCat(item)}
            className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
              cat === item
                ? "bg-maroon text-paper shadow-[0_10px_24px_-16px_rgba(78,18,25,0.7)]"
                : "border border-gold-soft bg-paper hover:border-maroon/30 hover:text-maroon"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {shots.map((shot) => (
          <figure key={`${shot.cat}-${shot.src}`} className="group mb-4 break-inside-avoid">
            <Photo src={shot.src} alt={shot.alt} className="aspect-[4/5]" />
            <figcaption className="mt-2 text-xs uppercase tracking-[0.14em] text-muted transition-colors duration-200 group-hover:text-maroon">
              {shot.cat}
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
