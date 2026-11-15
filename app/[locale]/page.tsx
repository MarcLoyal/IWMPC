import {
  ArrowRightIcon,
  DropletIcon,
  LayoutGridIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getAdvisoryViewer } from "@/lib/advisory-view";
import { activeAdvisories, getAdvisories } from "@/lib/content";
import { REPORT_HREF } from "@/lib/site";
import { AdvisoryRow } from "@/components/site/advisory-row";
import { AgencyLogos } from "@/components/site/agency-logos";
import { Container } from "@/components/site/container";
import { PhotoCollage } from "@/components/site/photo-collage";
import { HeroNews } from "@/components/site/hero-news";
import { SectionBar } from "@/components/site/section-bar";
import { ServiceCards } from "@/components/site/service-cards";

export default async function HomePage() {
  const t = await getTranslations("home");
  const view = await getAdvisoryViewer();
  const advisories = activeAdvisories(await getAdvisories()).slice(0, 3);

  const quick = [
    { key: "status", href: "/water/advisories", icon: DropletIcon },
    { key: "report", href: REPORT_HREF, icon: TriangleAlertIcon },
  ] as const;

  return (
    <>
      {/* 0. Photo collage, right under the header */}
      <PhotoCollage />

      {/* 1. Hero — latest news, in a rounded panel inset from the page edges */}
      <section className="px-3 pt-3 md:px-5 md:pt-5">
        <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
          <Container className="py-10 md:py-12">
            <h1 className="sr-only">{t("heroTitle")}</h1>
            <HeroNews />
          </Container>
        </div>
      </section>

      {/* 2. Latest advisories */}
      <section aria-labelledby="advisories-heading" className="bg-surface">
        <div className="px-3 py-6 md:px-5 md:py-8">
          <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl border bg-card shadow-sm">
            <SectionBar
              id="advisories-heading"
              title={t("advisories.heading")}
              icon={TriangleAlertIcon}
              action={{
                href: "/water/advisories",
                label: t("advisories.viewAll"),
              }}
            />
            {advisories.length === 0 ? (
              <Container className="py-6 text-lg">
                {t("advisories.none")}
              </Container>
            ) : (
              <ul className="divide-y divide-border">
                {advisories.map((a) => (
                  <li key={a.slug}>
                    <AdvisoryRow advisory={view(a)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* 3. Products and services */}
      <section aria-labelledby="services-heading">
        <div className="px-3 py-6 md:px-5 md:py-8">
          <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl border bg-surface shadow-sm">
            <SectionBar
              id="services-heading"
              title={t("services.heading")}
              icon={LayoutGridIcon}
              action={{ href: "/services", label: t("services.exploreAll") }}
            />
            <Container className="py-5">
              <p className="mb-5 max-w-none text-justify text-lg leading-relaxed hyphens-auto text-foreground/85">
                {t("services.intro")}
              </p>
              <ServiceCards />
            </Container>
          </div>
        </div>
      </section>

      {/* 4. Become a member */}
      <section aria-labelledby="join-heading">
        <div className="px-3 pb-6 md:px-5 md:pb-8">
          <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark text-white shadow-sm">
            <Container className="py-8 md:py-10">
              <p className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-extrabold tracking-wide text-accent-foreground uppercase">
                {t("join.eyebrow")}
              </p>
              <h2
                id="join-heading"
                className="mt-4 text-2xl font-extrabold tracking-wide break-words text-white uppercase min-[400px]:text-3xl md:text-4xl"
              >
                {t("join.heading")}
              </h2>
              <p className="mt-2 text-xl font-bold text-accent md:text-2xl">
                {t("join.tagline")}
              </p>
              <p className="mt-4 max-w-none text-justify text-lg leading-relaxed hyphens-auto text-white/90">
                {t("join.text")}
              </p>
              <h3 className="mt-6 text-xl font-extrabold tracking-wide text-white uppercase md:text-2xl">
                {t("join.subheading")}
              </h3>
              <p className="mt-2 max-w-none text-justify text-lg leading-relaxed hyphens-auto text-white/90">
                {t("join.subtext")}
              </p>
              <Link
                href="/membership"
                className="group mt-6 flex flex-col items-center gap-1 rounded-2xl bg-accent px-5 py-5 text-center text-primary-dark shadow-md transition hover:brightness-95"
              >
                <span className="text-xl font-extrabold tracking-wide uppercase md:text-2xl">
                  {t("join.cta")}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold tracking-wide uppercase">
                  {t("join.ctaSub")}
                  <ArrowRightIcon
                    className="size-4 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Container>
          </div>
        </div>
      </section>

      {/* 5. Quick actions */}
      <section aria-labelledby="quick-heading">
        <Container className="py-10">
          <h2 id="quick-heading" className="text-2xl tracking-wide uppercase">
            {t("quick.heading")}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {quick.map(({ key, href, icon: Icon }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="flex h-full min-h-32 flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm hover:border-primary hover:bg-surface"
                >
                  <Icon className="size-9 text-primary" aria-hidden="true" />
                  <span className="font-heading text-lg leading-tight font-bold text-primary">
                    {t(`quick.${key}`)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t(`quick.${key}Desc`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 6. Accreditation and compliance agencies */}
      <AgencyLogos />

      {/* 7. Latest news arrives with the News section in P4 */}
    </>
  );
}
