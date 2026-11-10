import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalculatorIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  PhoneIcon,
  DropletIcon,
  DropletsIcon,
  FlameIcon,
  HandCoinsIcon,
  HandshakeIcon,
  TriangleAlertIcon,
  WalletIcon,
  WheatIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getAdvisoryViewer } from "@/lib/advisory-view";
import { activeAdvisories, getAdvisories } from "@/lib/content";
import { getNow } from "@/lib/content";
import { REPORT_HREF, site, yearsOfService } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { AdvisoryCard } from "@/components/site/advisory-card";
import { ContactDetails } from "@/components/site/contact-details";
import { Container } from "@/components/site/container";
import { HeroTiles } from "@/components/site/hero-tiles";
import { Placeholder } from "@/components/site/placeholder";

function StatTile({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col-reverse rounded-xl border bg-card p-5 text-center">
      <dt className="mt-1 text-muted-foreground">{label}</dt>
      <dd className="font-heading text-3xl font-bold text-primary">
        {value ?? <Placeholder />}
      </dd>
    </div>
  );
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const view = await getAdvisoryViewer();
  const advisories = activeAdvisories(await getAdvisories()).slice(0, 3);

  const quick = [
    { key: "status", href: "/water/advisories", icon: DropletIcon },
    { key: "bill", href: "/water/rates", icon: CalculatorIcon },
    { key: "pay", href: "/water/pay", icon: WalletIcon },
    { key: "report", href: REPORT_HREF, icon: TriangleAlertIcon },
  ] as const;

  const services = [
    { key: "water", href: "/water", icon: DropletsIcon, tone: "text-primary" },
    {
      key: "rice",
      href: "/services/rice",
      icon: WheatIcon,
      tone: "text-harvest-strong",
    },
    {
      key: "lpg",
      href: "/services/lpg",
      icon: FlameIcon,
      tone: "text-harvest-strong",
    },
    {
      key: "loans",
      href: "/services/loans",
      icon: HandCoinsIcon,
      tone: "text-harvest-strong",
    },
  ] as const;

  return (
    <>
      {/* 1. Hero — a rounded panel inset from the page edges */}
      <section className="px-3 pt-3 md:px-5 md:pt-5">
        <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
          <Container className="grid items-center gap-10 py-10 md:py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm">
                <span
                  className="size-2.5 rounded-full bg-success"
                  aria-hidden="true"
                />
                {t("badge", { year: site.founded.slice(0, 4) })}
              </p>
              <p className="mt-6 text-base font-medium text-white/85">
                {t("eyebrow")}
              </p>
              <h1 className="mt-2 text-4xl leading-[1.1] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t("heroTitle")}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-white/90">
                {t("heroText")}
              </p>
              <ul className="mt-5 grid gap-2.5">
                {(["cda", "owned", "cub"] as const).map((key) => (
                  <li key={key} className="flex items-center gap-3 font-medium">
                    <CircleCheckIcon
                      className="size-6 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    {t(`checks.${key}`)}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" variant="accent">
                  <Link href="/water/advisories">
                    {t("ctaStatus")}
                    <ChevronRightIcon aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="border border-white/70 text-white hover:bg-white/15"
                >
                  <Link href="/water/pay">{t("ctaPay")}</Link>
                </Button>
              </div>
              {site.phone && (
                <p className="mt-6 flex items-center gap-2 text-white/90">
                  <PhoneIcon
                    className="size-5 text-accent"
                    aria-hidden="true"
                  />
                  {t("call")}:
                  <a
                    href={`tel:${site.phoneTel}`}
                    className="inline-flex min-h-12 items-center font-bold text-white underline underline-offset-4"
                  >
                    {site.phone}
                  </a>
                </p>
              )}
            </div>
            <HeroTiles />
          </Container>
        </div>
      </section>

      {/* 2. Quick actions */}
      <section aria-labelledby="quick-heading">
        <Container className="py-10">
          <h2 id="quick-heading" className="text-2xl">
            {t("quick.heading")}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
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

      {/* 3. Latest advisories */}
      <section aria-labelledby="advisories-heading" className="bg-surface">
        <Container className="py-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="advisories-heading" className="text-2xl">
              {t("advisories.heading")}
            </h2>
            <Link
              href="/water/advisories"
              className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary underline underline-offset-4"
            >
              {t("advisories.viewAll")}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
          {advisories.length === 0 ? (
            <p className="mt-4 rounded-xl border bg-card p-6 text-lg">
              {t("advisories.none")}
            </p>
          ) : (
            <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {advisories.map((a) => (
                <li key={a.slug}>
                  <AdvisoryCard advisory={view(a)} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* 4. Services */}
      <section aria-labelledby="services-heading">
        <Container className="py-10">
          <h2 id="services-heading" className="text-2xl">
            {t("services.heading")}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ key, href, icon: Icon, tone }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="flex h-full flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm hover:border-primary"
                >
                  <Icon className={`size-9 ${tone}`} aria-hidden="true" />
                  <span className="font-heading text-xl font-bold text-primary">
                    {t(`services.${key}`)}
                  </span>
                  <span className="text-muted-foreground">
                    {t(`services.${key}Desc`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 5. Trust strip — figures stay placeholders until the cooperative confirms them */}
      <section aria-labelledby="trust-heading" className="bg-surface">
        <Container className="py-10">
          <h2 id="trust-heading" className="text-2xl">
            {t("trust.heading")}
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <StatTile label={t("trust.members")} value={null} />
            <StatTile
              label={t("trust.years")}
              value={String(yearsOfService(await getNow()))}
            />
            <StatTile label={t("trust.households")} value={null} />
          </dl>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            <li className="flex items-center gap-3 rounded-xl border bg-card p-4">
              <BadgeCheckIcon
                className="size-8 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                <span className="block font-semibold">{t("trust.cda")}</span>
                <span className="text-sm text-muted-foreground">
                  Reg. No. {site.cdaRegistrationNo}
                </span>
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-xl border bg-card p-4">
              <HandshakeIcon
                className="size-8 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="font-semibold">{t("trust.cub")}</span>
            </li>
          </ul>
        </Container>
      </section>

      {/* 6. Become a member */}
      <section aria-labelledby="join-heading" className="bg-primary text-white">
        <Container className="flex flex-col gap-5 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="join-heading" className="text-2xl text-white">
              {t("join.heading")}
            </h2>
            <p className="mt-2 text-white/90">{t("join.text")}</p>
          </div>
          <Button asChild size="lg" variant="accent">
            <Link href="/membership">{t("join.cta")}</Link>
          </Button>
        </Container>
      </section>

      {/* 7. Latest news arrives with the News section in P4 */}

      {/* 8. Contact strip */}
      <section aria-labelledby="contact-heading">
        <Container className="py-10">
          <h2 id="contact-heading" className="text-2xl">
            {t("contact.heading")}
          </h2>
          <div className="mt-4">
            <ContactDetails />
          </div>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/contact">
              {t("contact.cta")}
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
