import { TrophyIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

/**
 * News & Events panel on the right of the hero. Features the cooperative's
 * Matatag na Kooperatiba Award 2026 video until the News section lands.
 */
export async function HeroNews() {
  const t = await getTranslations("home.heroNews");

  return (
    <section
      aria-labelledby="hero-news"
      className="rounded-3xl bg-white/12 p-4 text-white shadow-lg ring-1 ring-white/25 sm:p-5"
    >
      <h2
        id="hero-news"
        className="text-sm font-semibold tracking-wide text-white/85 uppercase"
      >
        {t("heading")}
      </h2>
      <video
        className="mt-3 aspect-video w-full rounded-2xl bg-black"
        controls
        playsInline
        preload="metadata"
        poster="/videos/matatag-na-kooperatiba-2026-poster.jpg"
        aria-label={t("videoLabel")}
      >
        <source
          src="/videos/matatag-na-kooperatiba-2026.mp4"
          type="video/mp4"
        />
      </video>
      <p className="mt-4 flex items-start gap-2 text-xl leading-snug font-bold">
        <TrophyIcon
          className="mt-0.5 size-6 shrink-0 text-accent"
          aria-hidden="true"
        />
        {t("title")}
      </p>
      <p className="mt-1 text-white/90">{t("text")}</p>
    </section>
  );
}
