"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type CollagePicture = {
  src: string;
  width: number;
  height: number;
  alt: string;
  focus: "top" | "center" | "bottom";
};

const FOCUS = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
} as const;

/**
 * The home page photo collage, built from separate pictures instead of one
 * flattened image so it works on a phone:
 *  - phones get two photos per row (four on larger screens), big enough to see;
 *  - any picture can be tapped to view it whole, with next/previous;
 *  - every picture has its own description for screen readers;
 *  - the banner text is real, translated text.
 * pictures[0] is the award-night photo, pictures[1] the trophy, the rest fill the grid.
 */
export function CollageGallery({
  pictures,
  background,
  year,
}: {
  pictures: CollagePicture[];
  background?: string;
  year: string;
}) {
  const t = useTranslations("collage");
  const [index, setIndex] = useState<number | null>(null);
  const current = index === null ? null : pictures[index];
  const go = (step: number) =>
    setIndex((i) =>
      i === null ? i : (i + step + pictures.length) % pictures.length,
    );

  const tile = (
    i: number,
    className?: string,
    sizes = "(min-width: 768px) 25vw, 50vw",
  ) => {
    const picture = pictures[i];
    return (
      <button
        type="button"
        onClick={() => setIndex(i)}
        className={cn(
          "group relative block size-full cursor-zoom-in overflow-hidden focus-visible:z-10",
          className,
        )}
      >
        <Image
          src={picture.src}
          alt={picture.alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none",
            FOCUS[picture.focus],
          )}
        />
        <span className="sr-only"> — {t("enlarge")}</span>
      </button>
    );
  };

  const arrow =
    "absolute top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30";

  return (
    <section
      aria-label={t("label")}
      className="relative overflow-hidden border-t-4 border-accent bg-primary-dark"
    >
      {background && (
        <>
          <Image
            src={background}
            alt=""
            fill
            sizes="100vw"
            className="scale-105 object-cover blur-[2px]"
          />
          <div className="absolute inset-0 bg-primary-dark/70" />
        </>
      )}

      <div className="relative mx-auto max-w-6xl md:px-4 md:py-5">
        <div className="overflow-hidden bg-primary-dark md:rounded-xl md:shadow-2xl">
          {/* Row 1: logo · award night · trophy. Slanted panels on wide screens, a simple grid on phones. */}
          <div className="grid grid-cols-2 gap-1 bg-accent md:flex md:h-64 md:gap-0 lg:h-72">
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-4 md:aspect-auto md:w-[30%] md:pr-12 md:[clip-path:polygon(0_0,100%_0,calc(100%-3rem)_100%,0_100%)]">
              <Image
                src="/logo-v3.png"
                alt={`Logo ng ${t("bandName")}`}
                width={512}
                height={512}
                sizes="(min-width: 768px) 220px, 35vw"
                className="h-full max-h-56 w-auto"
              />
            </div>
            <div className="order-last col-span-2 aspect-[16/9] md:order-none md:-ml-10 md:aspect-auto md:flex-1 md:[clip-path:polygon(3rem_0,100%_0,calc(100%-3rem)_100%,0_100%)]">
              {tile(0, undefined, "(min-width: 768px) 45vw, 100vw")}
            </div>
            <div className="aspect-[4/3] bg-[radial-gradient(circle_at_50%_45%,#fff3a6,#ffd60a_60%,#f0b400)] md:-ml-10 md:aspect-auto md:w-[30%] md:pl-10 md:[clip-path:polygon(3rem_0,100%_0,100%_100%,0_100%)]">
              <button
                type="button"
                onClick={() => setIndex(1)}
                className="relative block size-full cursor-zoom-in p-2 md:p-3"
              >
                <Image
                  src={pictures[1].src}
                  alt={pictures[1].alt}
                  width={pictures[1].width}
                  height={pictures[1].height}
                  sizes="(min-width: 768px) 260px, 45vw"
                  className="mx-auto h-full w-auto object-contain drop-shadow-lg"
                />
                <span className="sr-only"> — {t("enlarge")}</span>
              </button>
            </div>
          </div>

          {/* Brand band: real text, so it is translated and readable at any size */}
          <p className="max-w-none border-t-4 border-brand-red bg-accent px-3 py-2.5 text-center leading-snug font-extrabold tracking-wide text-accent-foreground uppercase md:text-lg">
            {t("band")}
            <span className="mx-2 hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="block text-sm sm:inline md:text-lg">
              {t("bandName")}
            </span>
            <span className="mx-2 hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="text-sm md:text-lg">
              {t("bandSince", { year })}
            </span>
          </p>

          {/* Rows 2–4: two photos per row on phones, four on larger screens */}
          <ul className="grid grid-cols-2 gap-1 p-1 md:grid-cols-4 md:gap-2 md:p-2">
            {pictures.slice(2).map((picture, i) => (
              <li key={picture.src} className="aspect-[5/3]">
                {tile(i + 2, "rounded-sm ring-1 ring-white/40")}
              </li>
            ))}
          </ul>
        </div>
        <p className="py-2 text-center text-sm text-white/90 md:pb-0">
          {t("hint")}
        </p>
      </div>

      <Dialog.Root
        open={current !== null}
        onOpenChange={(open) => !open && setIndex(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-0 z-50 flex flex-col p-3 text-white outline-none md:p-6"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") go(-1);
              if (e.key === "ArrowRight") go(1);
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <Dialog.Title className="font-sans text-base font-semibold text-white">
                {index !== null &&
                  t("position", { current: index + 1, total: pictures.length })}
              </Dialog.Title>
              <Dialog.Close className="inline-flex size-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/30">
                <XIcon className="size-6" aria-hidden="true" />
                <span className="sr-only">{t("close")}</span>
              </Dialog.Close>
            </div>

            {current && (
              <div className="relative min-h-0 flex-1">
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  sizes="100vw"
                  className="mx-auto size-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className={cn(arrow, "left-0")}
                >
                  <ChevronLeftIcon className="size-7" aria-hidden="true" />
                  <span className="sr-only">{t("previous")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className={cn(arrow, "right-0")}
                >
                  <ChevronRightIcon className="size-7" aria-hidden="true" />
                  <span className="sr-only">{t("next")}</span>
                </button>
              </div>
            )}

            <p aria-live="polite" className="mx-auto mt-3 text-center text-lg">
              {current?.alt}
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
