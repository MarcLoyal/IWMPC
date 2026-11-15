import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLeftIcon,
  EyeIcon,
  FlagIcon,
  ImageIcon,
  InfoIcon,
  NetworkIcon,
  TargetIcon,
} from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import { getAbout, localized } from "@/lib/content";
import { site } from "@/lib/site";
import { Container } from "@/components/site/container";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: t("title"), description: t("intro") };
}

/** A dashed frame marking where a photo from the cooperative will go. */
function PhotoSlot({ label, pending }: { label: string; pending: string }) {
  return (
    <div className="flex aspect-[4/3] h-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-surface p-6 text-center md:aspect-auto">
      <ImageIcon className="size-10 text-primary/50" aria-hidden="true" />
      <p className="font-semibold text-primary">{label}</p>
      <p className="text-sm text-muted-foreground italic">{pending}</p>
    </div>
  );
}

/** Uppercase section title, as on the home page; white on the blue bands. */
function SectionTitle({
  id,
  onBlue = false,
  children,
}: {
  id: string;
  onBlue?: boolean;
  children: string;
}) {
  return (
    <h2
      id={id}
      className={`text-2xl font-extrabold tracking-wide uppercase md:text-3xl ${onBlue ? "text-white" : "text-primary"}`}
    >
      {children}
    </h2>
  );
}

export default async function AboutPage() {
  const [t, tf, format, locale, about] = await Promise.all([
    getTranslations("about"),
    getTranslations("footer"),
    getFormatter(),
    getLocale() as Promise<Locale>,
    getAbout(),
  ]);

  const useEnglish = locale === "en" && about.mission_en.length > 0;
  const vision = localized(about, "vision", locale);
  const mission = useEnglish ? about.mission_en : about.mission_fil;
  const goals =
    locale === "en" && about.goals_en.length > 0
      ? about.goals_en
      : about.goals_fil;
  const showTranslationNote = locale === "en" && !about.translation_approved;
  const founded = format.dateTime(new Date(`${site.founded}T00:00:00+08:00`), {
    dateStyle: "long",
  });

  // History rows, oldest first, each beside one photo. The old photos are
  // still to come from the cooperative.
  const historyText =
    locale === "en" && about.history_en.length > 0
      ? about.history_en
      : about.history_fil;
  const photos = [t("photoFacility"), t("photoPumps"), t("photoPerson")];
  const history = historyText.map((paragraphs, i) => ({
    photo: photos[i] ?? t("photoPending"),
    paragraphs,
  }));
  const profileText = about.profile_fil
    ? localized(about, "profile", locale)
    : about.profile_en;

  const profile = [
    { label: t("profileName"), value: site.legalName },
    { label: t("profileFounded"), value: founded },
    { label: t("cdaReg"), value: site.cdaRegistrationNo },
    { label: t("address"), value: site.address },
    { label: t("profileMembers"), value: site.members.toLocaleString("en-PH") },
    { label: t("profileServices"), value: t("profileServicesValue") },
    { label: t("profileAffiliation"), value: tf("cubMember") },
  ];

  const pillars = [
    { id: "vision", icon: EyeIcon, title: t("vision"), sub: t("visionSub") },
    {
      id: "mission",
      icon: TargetIcon,
      title: t("mission"),
      sub: t("missionSub"),
    },
    { id: "goals", icon: FlagIcon, title: t("goals"), sub: t("goalsSub") },
  ] as const;

  return (
    <>
      {/* 1. Hero: latest photo of the waterworks behind the page title */}
      <section className="px-3 pt-3 md:px-5 md:pt-5">
        <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-3xl text-white">
          <Image
            src="/images/collage/03-water-line-work.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-zoom object-cover object-[center_40%]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary/85 to-primary/50"
            aria-hidden="true"
          />
          <Container className="relative py-14 md:py-20">
            <h1 className="hero-rise text-4xl font-extrabold tracking-wide text-white uppercase md:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="hero-rise mt-3 text-xl font-bold text-accent [animation-delay:150ms] md:text-2xl">
              {t("tagline")}
            </p>
            <p className="hero-rise mt-3 max-w-none text-lg text-white/90 [animation-delay:300ms] lg:whitespace-nowrap">
              {t("heroText")}
            </p>
            <Link
              href="/"
              className="hero-rise mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-5 font-bold text-accent-foreground shadow-sm [animation-delay:450ms] hover:brightness-95"
            >
              <ArrowLeftIcon className="size-5" aria-hidden="true" />
              {t("backHome")}
            </Link>
          </Container>
        </div>
      </section>

      <div className="bg-background">
        <Container className="py-12 md:py-16">
          {showTranslationNote && (
            <p className="mb-8 flex items-start gap-2 text-muted-foreground">
              <InfoIcon className="mt-1 size-5 shrink-0" aria-hidden="true" />
              {t("unofficialTranslation")}
            </p>
          )}
          {/* 2. History: photo and text, alternating sides */}
          <section aria-labelledby="history-heading">
            <SectionTitle id="history-heading">{t("history")}</SectionTitle>
            <ol className="mt-6 grid gap-10">
              {history.map((row, i) => (
                <li
                  key={i}
                  className="grid items-stretch gap-6 md:grid-cols-2 md:gap-10"
                >
                  <div className={i % 2 === 1 ? "md:order-2" : undefined}>
                    <PhotoSlot label={row.photo} pending={t("photoPending")} />
                  </div>
                  <div className="grid gap-4">
                    {row.paragraphs.map((text, j) => (
                      <p
                        key={j}
                        className="max-w-none text-justify text-lg leading-relaxed hyphens-auto"
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </Container>
      </div>
      <div className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
        <Container className="py-12 md:py-16">
          {/* 3. Cooperative profile: key facts beside the officers' photo */}
          <section aria-labelledby="profile-heading">
            <SectionTitle id="profile-heading" onBlue>
              {t("profile")}
            </SectionTitle>
            <div className="mt-6 grid items-stretch gap-8 md:grid-cols-2 md:gap-10">
              {profileText && (
                <p className="max-w-none text-justify text-lg leading-relaxed hyphens-auto">
                  {profileText}
                </p>
              )}
              {/* The photo is as tall as the profile text beside it */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-lg ring-4 ring-white/20 md:aspect-auto">
                <Image
                  src="/images/collage/03-team-office-front-v2.jpg"
                  alt={t("profileImageAlt")}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <dl className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              {profile.map(({ label, value }) => (
                <div key={label} className="border-t-4 border-accent pt-2">
                  <dt className="text-sm font-semibold text-white/75">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-lg font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </Container>
      </div>
      <div className="bg-background">
        <Container className="py-12 md:py-16">
          {/* 4. Vision, mission and goals side by side */}
          <section aria-labelledby="vmg-heading">
            <h2 id="vmg-heading" className="sr-only">
              {`${t("vision")}, ${t("mission")}, ${t("goals")}`}
            </h2>
            <div className="grid gap-5 lg:grid-cols-3">
              {pillars.map(({ id, icon: Icon, title, sub }) => (
                <article
                  key={id}
                  aria-labelledby={`${id}-heading`}
                  className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm"
                >
                  <h3
                    id={`${id}-heading`}
                    className="flex items-center gap-3 text-xl font-extrabold tracking-wide text-primary uppercase"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span>
                      {title}
                      <span className="block text-sm font-medium tracking-normal text-muted-foreground normal-case">
                        {sub}
                      </span>
                    </span>
                  </h3>
                  {id === "vision" ? (
                    <p className="mt-4 text-justify text-lg leading-relaxed hyphens-auto">
                      {vision}
                    </p>
                  ) : (
                    <ol className="mt-4 grid list-decimal gap-2.5 pl-5 marker:font-bold marker:text-primary">
                      {(id === "mission" ? mission : goals).map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ol>
                  )}
                </article>
              ))}
            </div>
          </section>
        </Container>
      </div>
      <div className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
        <Container className="py-12 md:py-16">
          {/* 5. Leadership: board and leaders, then the organization chart */}
          <section aria-labelledby="leadership-heading">
            <h2 id="leadership-heading" className="sr-only">
              {`${t("board")}, ${t("leaders")}`}
            </h2>
            <div className="grid gap-6 text-center sm:grid-cols-2 sm:divide-x-2 sm:divide-white/30">
              <p className="px-4">
                <span className="block font-semibold tracking-wide text-accent uppercase">
                  {t("meetOur")}
                </span>
                <span className="block text-2xl font-extrabold tracking-wide text-white uppercase md:text-3xl">
                  {t("board")}
                </span>
              </p>
              <p className="px-4">
                <span className="block font-semibold tracking-wide text-accent uppercase">
                  {t("our")}
                </span>
                <span className="block text-2xl font-extrabold tracking-wide text-white uppercase md:text-3xl">
                  {t("leaders")}
                </span>
              </p>
            </div>
            <div className="mt-6 flex min-h-80 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-white/40 bg-white/10 p-8 text-center">
              <NetworkIcon
                className="size-12 text-white/70"
                aria-hidden="true"
              />
              <p className="text-xl font-bold text-white uppercase">
                {t("orgChart")}
              </p>
              <p className="max-w-md text-white/85 italic">{t("orgPending")}</p>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
