"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type Slide = { src: string; width: number; height: number; alt: string };

/**
 * Photo slideshow under the header. Each picture is shown whole, centred on a
 * blurred, enlarged copy of itself so any shape of image fills the band.
 * Slides change only when the visitor asks (arrows, dots, swipe, arrow keys):
 * there is no autoplay.
 */
export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const t = useTranslations("slideshow");
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);

  if (slides.length === 0) return null;
  const many = slides.length > 1;
  const go = (step: number) =>
    setIndex((i) => (i + step + slides.length) % slides.length);

  const arrow =
    "absolute top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 md:size-14";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("label")}
      className="relative overflow-hidden border-t-4 border-accent bg-primary-dark"
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null || !many) return;
        const delta = e.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
      }}
    >
      {/* Height follows the picture on phones and is capped on large screens */}
      <div className="relative mx-auto aspect-[5/3] max-h-[min(78vh,46rem)] w-full">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={t("position", {
                current: i + 1,
                total: slides.length,
              })}
              aria-hidden={!active}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none",
                active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {/* Blurred backdrop: decorative copy of the same picture */}
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                className="scale-110 object-cover blur-2xl brightness-75"
              />
              <Image
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                sizes="(min-width: 1280px) 1200px, 100vw"
                priority={i === 0}
                className="relative mx-auto h-full w-auto max-w-full object-contain md:py-4"
              />
            </div>
          );
        })}

        {many && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className={cn(arrow, "left-2 md:left-4")}
            >
              <ChevronLeftIcon className="size-7" aria-hidden="true" />
              <span className="sr-only">{t("previous")}</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className={cn(arrow, "right-2 md:right-4")}
            >
              <ChevronRightIcon className="size-7" aria-hidden="true" />
              <span className="sr-only">{t("next")}</span>
            </button>
            <div className="absolute inset-x-0 bottom-1 z-10 flex justify-center gap-1">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? "true" : undefined}
                  className="group inline-flex size-10 items-center justify-center"
                >
                  <span
                    className={cn(
                      "size-3 rounded-full ring-1 ring-black/40",
                      i === index
                        ? "bg-accent"
                        : "bg-white/70 group-hover:bg-white",
                    )}
                  />
                  <span className="sr-only">
                    {t("goTo", { number: i + 1 })}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {t("position", { current: index + 1, total: slides.length })}
      </p>
    </section>
  );
}
