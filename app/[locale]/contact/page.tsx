import type { Metadata } from "next";
import {
  ArrowLeftIcon,
  ClipboardListIcon,
  ClockIcon,
  FileSignatureIcon,
  HeadsetIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  MessagesSquareIcon,
  PhoneIcon,
  SmartphoneIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { REPORT_HREF, site } from "@/lib/site";
import { ContactForm } from "@/components/forms";
import { Container } from "@/components/site/container";
import { MapEmbed } from "@/components/site/map-embed";
import { OfficeHours } from "@/components/site/office-hours";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return { title: t("title"), description: t("intro") };
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4v3.2h2.8V22h3.3z"
      />
    </svg>
  );
}

export default async function ContactPage() {
  const [t, ta] = await Promise.all([
    getTranslations("contact"),
    getTranslations("about"),
  ]);

  // The four ways to reach the cooperative, as big tiles.
  const tiles = [
    {
      key: "inquiry",
      href: "#message",
      icon: MessagesSquareIcon,
      external: false,
      tone: "blue",
    },
    {
      key: "apply",
      href: "/water/new-connection",
      icon: FileSignatureIcon,
      external: false,
      tone: "yellow",
    },
    {
      key: "complaint",
      href: REPORT_HREF,
      icon: TriangleAlertIcon,
      external: false,
      tone: "red",
    },
    {
      key: "other",
      href: site.messengerUrl ?? "#message",
      icon: ClipboardListIcon,
      external: Boolean(site.messengerUrl),
      tone: "blue",
    },
  ] as const;

  // Logo colours, checkerboard-style, with red kept for complaints.
  const TONES = {
    blue: "bg-gradient-to-br from-primary to-primary-dark text-white",
    yellow: "bg-accent text-primary-dark",
    red: "bg-gradient-to-br from-brand-red to-[#a50e13] text-white",
  } as const;
  const tileClass = (tone: keyof typeof TONES) =>
    `group flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${TONES[tone]}`;

  const row = "flex items-center gap-4 border-b border-border py-4";
  const iconWrap =
    "flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-primary-dark";
  const link =
    "font-semibold text-primary underline-offset-4 hover:underline break-all";

  return (
    <>
      <Container className="pt-6 md:pt-8">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-5 font-bold text-accent-foreground shadow-sm hover:brightness-95"
        >
          <ArrowLeftIcon className="size-5" aria-hidden="true" />
          {ta("backHome")}
        </Link>
      </Container>

      <Container className="grid gap-10 py-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* Left: four ways to reach us */}
        <nav aria-label={t("tilesLabel")}>
          <ul className="grid grid-cols-2 gap-4 md:gap-5">
            {tiles.map(({ key, href, icon: Icon, external, tone }) => (
              <li key={key}>
                {external || href.startsWith("#") ? (
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener" } : {})}
                    className={tileClass(tone)}
                  >
                    <Icon
                      className="size-14 transition group-hover:scale-110 md:size-16"
                      aria-hidden="true"
                    />
                    <span className="text-lg font-bold md:text-xl">
                      {t(`tiles.${key}`)}
                    </span>
                  </a>
                ) : (
                  <Link href={href} className={tileClass(tone)}>
                    <Icon
                      className="size-14 transition group-hover:scale-110 md:size-16"
                      aria-hidden="true"
                    />
                    <span className="text-lg font-bold md:text-xl">
                      {t(`tiles.${key}`)}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: contact details */}
        <section aria-labelledby="contact-heading">
          <div className="flex items-center gap-4 border-b-4 border-accent pb-4">
            <HeadsetIcon
              className="size-14 shrink-0 text-brand-red"
              aria-hidden="true"
            />
            <h1
              id="contact-heading"
              className="text-3xl font-extrabold tracking-wide text-primary uppercase md:text-5xl"
            >
              {t("heading")}
            </h1>
          </div>
          <ul>
            {site.hotline && (
              <li className={row}>
                <span className={iconWrap}>
                  <PhoneIcon className="size-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-muted-foreground">
                    {t("hotline")}
                  </span>
                  <a href={`tel:${site.hotlineTel}`} className={link}>
                    {site.hotline}
                  </a>
                </span>
              </li>
            )}
            {site.phone && (
              <li className={row}>
                <span className={iconWrap}>
                  <SmartphoneIcon className="size-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-muted-foreground">
                    {t("mobile")}
                  </span>
                  <a href={`tel:${site.phoneTel}`} className={link}>
                    {site.phone}
                  </a>
                </span>
              </li>
            )}
            {site.email && (
              <li className={row}>
                <span className={iconWrap}>
                  <MailIcon className="size-6" aria-hidden="true" />
                </span>
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </li>
            )}
            {site.facebookUrl && (
              <li className={row}>
                <span className={`${iconWrap} !bg-[#1877f2] !text-white`}>
                  <FacebookIcon className="size-6" />
                </span>
                <span>
                  <span className="block text-sm text-muted-foreground">
                    Facebook
                  </span>
                  <a
                    href={site.facebookUrl}
                    target="_blank"
                    rel="noopener"
                    className={link}
                  >
                    {t("facebookPage")}
                  </a>
                </span>
              </li>
            )}
            {site.messengerUrl && (
              <li className={row}>
                <span className={iconWrap}>
                  <MessageCircleIcon className="size-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-muted-foreground">
                    Messenger
                  </span>
                  <a
                    href={site.messengerUrl}
                    target="_blank"
                    rel="noopener"
                    className={link}
                  >
                    {t("messengerCta")}
                  </a>
                </span>
              </li>
            )}
            <li className={row}>
              <span className={iconWrap}>
                <MapPinIcon className="size-6" aria-hidden="true" />
              </span>
              <span className="font-semibold">{site.address}</span>
            </li>
            <li className={`${row} items-start border-b-0`}>
              <span className={iconWrap}>
                <ClockIcon className="size-6" aria-hidden="true" />
              </span>
              <span className="pt-2.5 font-semibold">
                <OfficeHours />
              </span>
            </li>
          </ul>
        </section>
      </Container>

      {/* Message form and map */}
      <div className="bg-surface">
        <Container className="grid gap-10 py-12 lg:grid-cols-2">
          <section
            id="message"
            aria-labelledby="form-heading"
            className="scroll-mt-28"
          >
            <h2
              id="form-heading"
              className="text-2xl font-extrabold tracking-wide text-primary uppercase"
            >
              {t("formHeading")}
            </h2>
            <div className="mt-4">
              <ContactForm />
            </div>
          </section>
          <section aria-labelledby="map-heading">
            <h2
              id="map-heading"
              className="text-2xl font-extrabold tracking-wide text-primary uppercase"
            >
              {t("mapHeading")}
            </h2>
            <div className="mt-4">
              <MapEmbed title={t("mapTitle")} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("mapNote")}</p>
          </section>
        </Container>
      </div>
    </>
  );
}
