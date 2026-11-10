import type { Metadata } from "next";
import { EyeIcon, InfoIcon, TargetIcon } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";
import { getAbout, localized } from "@/lib/content";
import { site } from "@/lib/site";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: t("title"), description: t("intro") };
}

export default async function AboutPage() {
  const [t, format, locale, about] = await Promise.all([
    getTranslations("about"),
    getFormatter(),
    getLocale() as Promise<Locale>,
    getAbout(),
  ]);

  const useEnglish = locale === "en" && about.mission_en.length > 0;
  const vision = localized(about, "vision", locale);
  const mission = useEnglish ? about.mission_en : about.mission_fil;
  const showTranslationNote = locale === "en" && !about.translation_approved;

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title") }]}
      />
      <Container className="grid gap-10 py-8">
        <section aria-labelledby="facts-heading">
          <h2 id="facts-heading" className="sr-only">
            {t("factsHeading")}
          </h2>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-5">
              <dt className="text-sm font-semibold text-muted-foreground">
                {t("founded")}
              </dt>
              <dd className="mt-1 text-xl font-bold text-primary">
                {format.dateTime(new Date(`${site.founded}T00:00:00+08:00`), {
                  dateStyle: "long",
                })}
              </dd>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <dt className="text-sm font-semibold text-muted-foreground">
                {t("cdaReg")}
              </dt>
              <dd className="mt-1 text-xl font-bold text-primary">
                {site.cdaRegistrationNo}
              </dd>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <dt className="text-sm font-semibold text-muted-foreground">
                {t("address")}
              </dt>
              <dd className="mt-1 text-lg font-semibold">{site.address}</dd>
            </div>
          </dl>
        </section>

        {showTranslationNote && (
          <p className="flex items-start gap-2 text-muted-foreground">
            <InfoIcon className="mt-1 size-5 shrink-0" aria-hidden="true" />
            {t("unofficialTranslation")}
          </p>
        )}

        <section
          aria-labelledby="vision-heading"
          className="rounded-2xl border-l-8 border-accent bg-surface p-6 md:p-8"
        >
          <h2 id="vision-heading" className="flex items-center gap-3 text-2xl">
            <EyeIcon className="size-7" aria-hidden="true" />
            {t("vision")}
            <span className="text-base font-normal text-muted-foreground">
              ({t("visionSub")})
            </span>
          </h2>
          <p className="mt-4 text-xl leading-relaxed">{vision}</p>
        </section>

        <section aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="flex items-center gap-3 text-2xl">
            <TargetIcon className="size-7" aria-hidden="true" />
            {t("mission")}
            <span className="text-base font-normal text-muted-foreground">
              ({t("missionSub")})
            </span>
          </h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-2">
            {mission.map((item, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-xl border bg-card p-5 text-lg"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
                >
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* History timeline, core values, awards and affiliations arrive in P4 */}
        <p className="rounded-xl border border-dashed bg-surface p-5 text-muted-foreground">
          {t("moreSoon")}
        </p>
      </Container>
    </>
  );
}
