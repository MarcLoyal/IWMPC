import { TrophyIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

/**
 * The top of the home page: the latest news item, with its video beside the
 * write-up on wide screens and above it on phones.
 */
export async function HeroNews() {
  const t = await getTranslations("home.heroNews");

  return (
    <section aria-labelledby="hero-news">
      <h2
        id="hero-news"
        className="text-2xl font-extrabold tracking-[0.12em] text-accent uppercase sm:text-3xl lg:text-4xl"
      >
        {t("heading")}
      </h2>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
        <video
          className="aspect-video w-full rounded-2xl bg-black shadow-2xl ring-4 ring-white/20"
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
        <div>
          <p className="flex items-start gap-3 text-2xl leading-tight font-bold text-white sm:text-3xl">
            <TrophyIcon
              className="mt-0.5 size-8 shrink-0 text-accent"
              aria-hidden="true"
            />
            {t("title")}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/90 sm:text-justify">
            {t("text")}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/90 sm:text-justify">
            {t("more")}
          </p>
        </div>
      </div>
    </section>
  );
}
