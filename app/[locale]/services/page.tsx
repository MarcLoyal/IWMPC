import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  CircleCheckIcon,
  DropletIcon,
  FlameIcon,
  HandCoinsIcon,
  HandshakeIcon,
  HeartHandshakeIcon,
  WheatIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/site/container";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("servicesPage");
  return { title: t("title"), description: t("intro") };
}

// One band per service, alternating white and blue. Points marked as
// placeholders in the messages stay until the cooperative confirms details.
const SERVICES = [
  {
    key: "water",
    icon: DropletIcon,
    image: "/images/services/water-meter.jpg",
    href: "/water",
  },
  {
    key: "rice",
    icon: WheatIcon,
    image: "/images/services/rice.jpg",
    href: "/contact",
  },
  {
    key: "lpg",
    icon: FlameIcon,
    image: "/images/services/lpg.jpg",
    href: "/contact",
  },
  {
    key: "loans",
    icon: HandCoinsIcon,
    image: "/images/services/loans-photo.jpg",
    href: "/services/loans",
  },
] as const;

const WHY = [
  { key: "affordable", icon: BadgeCheckIcon },
  { key: "community", icon: HeartHandshakeIcon },
  { key: "members", icon: HandshakeIcon },
] as const;

export default async function ServicesPage() {
  const [t, ta, th] = await Promise.all([
    getTranslations("servicesPage"),
    getTranslations("about"),
    getTranslations("home.services"),
  ]);

  return (
    <>
      {/* 1. Title row and intro panel */}
      <Container className="grid items-center gap-4 pt-6 md:grid-cols-[1fr_auto_1fr] md:pt-8">
        <Link
          href="/"
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-accent px-5 font-bold text-accent-foreground shadow-sm hover:brightness-95"
        >
          <ArrowLeftIcon className="size-5" aria-hidden="true" />
          {ta("backHome")}
        </Link>
        <h1 className="text-center text-3xl font-extrabold tracking-wide text-primary uppercase md:text-5xl">
          {t("title")}
        </h1>
      </Container>

      <section className="px-3 pt-6 md:px-5 md:pt-8">
        <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
          <Container className="py-10 md:py-12">
            <p className="text-xl font-bold text-accent md:text-2xl">
              {t("tagline")}
            </p>
            <p className="mt-3 max-w-none text-justify text-lg leading-relaxed hyphens-auto text-white/90">
              {th("intro")}
            </p>

            {/* 2. Quick links to each service below */}
            <nav aria-label={t("jumpLabel")} className="mt-8">
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {SERVICES.map(({ key, icon: Icon }) => (
                  <li key={key}>
                    <a
                      href={`#${key}`}
                      className="flex min-h-14 items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 font-bold ring-1 ring-white/25 transition hover:bg-white/20"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary-dark">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      {th(key)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </div>
      </section>

      {/* 3. One band per service, alternating white and blue */}
      <div className="mt-6 md:mt-8">
        {SERVICES.map(({ key, icon: Icon, image, href }, i) => {
          const blue = i % 2 === 1;
          const points = [1, 2, 3]
            .filter((n) => t.has(`${key}.point${n}`))
            .map((n) => t(`${key}.point${n}`));
          return (
            <section
              key={key}
              id={key}
              aria-labelledby={`${key}-heading`}
              className={`scroll-mt-28 ${
                blue
                  ? "bg-gradient-to-br from-primary via-primary to-primary-dark text-white"
                  : "bg-background"
              }`}
            >
              <Container className="grid items-stretch gap-8 py-12 md:grid-cols-2 md:gap-12 md:py-16">
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg md:aspect-auto md:min-h-80 ${
                    blue ? "ring-4 ring-white/20 md:order-2" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h2
                    id={`${key}-heading`}
                    className={`flex items-center gap-3 text-3xl font-extrabold tracking-wide uppercase md:text-4xl ${
                      blue ? "text-white" : "text-primary"
                    }`}
                  >
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
                        blue
                          ? "bg-accent text-primary-dark"
                          : "bg-primary text-white"
                      }`}
                    >
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    {th(key)}
                  </h2>
                  <p
                    className={`mt-4 max-w-none text-justify text-lg leading-relaxed hyphens-auto ${
                      blue ? "text-white/90" : ""
                    }`}
                  >
                    {t(`${key}.summary`)}
                  </p>
                  <ul className="mt-5 grid gap-3">
                    {points.map((point, j) => (
                      <li key={j} className="flex gap-3">
                        <CircleCheckIcon
                          className={`mt-0.5 size-6 shrink-0 ${blue ? "text-accent" : "text-primary"}`}
                          aria-hidden="true"
                        />
                        <span className="text-lg">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href}
                    className="mt-7 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-accent px-6 font-bold text-accent-foreground shadow-sm hover:brightness-95"
                  >
                    {t(`${key}.cta`)}
                    <ArrowRightIcon className="size-5" aria-hidden="true" />
                  </Link>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      {/* 4. Why buy from the cooperative */}
      <section aria-labelledby="why-heading" className="bg-surface">
        <Container className="py-12 md:py-16">
          <h2
            id="why-heading"
            className="text-center text-3xl font-extrabold tracking-wide text-primary uppercase md:text-4xl"
          >
            {t("whyHeading")}
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {WHY.map(({ key, icon: Icon }) => (
              <li
                key={key}
                className="rounded-3xl bg-card p-6 text-center shadow-lg ring-1 ring-border"
              >
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-white">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-bold text-primary">
                  {t(`why.${key}.title`)}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t(`why.${key}.text`)}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 5. How to avail */}
      <section aria-labelledby="avail-heading">
        <Container className="py-12 md:py-16">
          <h2
            id="avail-heading"
            className="text-center text-3xl font-extrabold tracking-wide text-primary uppercase md:text-4xl"
          >
            {t("availHeading")}
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li
                key={n}
                className="relative rounded-3xl border-2 border-dashed border-primary/30 p-6 pt-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-6 left-6 flex size-12 items-center justify-center rounded-full bg-accent text-xl font-extrabold text-primary-dark shadow-md"
                >
                  {n}
                </span>
                <h3 className="text-xl font-bold text-primary">
                  {t(`avail.step${n}.title`)}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t(`avail.step${n}.text`)}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-sm text-muted-foreground italic">
            {t("availNote")}
          </p>
        </Container>
      </section>
    </>
  );
}
