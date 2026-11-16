import Image from "next/image";
import { useTranslations } from "next-intl";
import { MessageCircleIcon } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { primaryNav, secondaryNav, site } from "@/lib/site";
import { OfficeHours } from "./office-hours";
import { Placeholder } from "./placeholder";

// Stamped at build time; every content change triggers a new build.
const BUILT_AT = new Date(process.env.NEXT_PUBLIC_BUILD_TIME!);

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const linkClass =
    "inline-flex min-h-12 items-center underline-offset-4 hover:underline";

  return (
    <footer className="border-t-4 border-accent bg-primary pb-20 text-primary-foreground md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-6 px-4 py-10 md:grid-cols-[2fr_1fr_1fr]">
        {/* Name and logo span the full width so Address, Links and More start on one line */}
        <div className="flex items-center gap-4 md:col-span-3">
          <Image
            src="/logo-v3.png"
            alt=""
            width={80}
            height={80}
            className="size-16 shrink-0 rounded-full bg-white ring-2 ring-white md:size-20"
          />
          <div>
            <h2 id="footer-contact" className="text-lg text-white">
              {site.legalName}
            </h2>
            <p className="mt-1 text-sm text-white/85">
              {t("cdaReg")} {site.cdaRegistrationNo}
            </p>
          </div>
        </div>
        <section aria-labelledby="footer-contact">
          <dl className="grid gap-x-4 gap-y-2 text-base sm:grid-cols-[auto_1fr]">
            <dt className="font-semibold">{t("address")}</dt>
            <dd>{site.address}</dd>
            <dt className="font-semibold">{t("hours")}</dt>
            <dd>
              <OfficeHours />
            </dd>
            <dt className="font-semibold">{t("phone")}</dt>
            <dd>
              {site.phone ? (
                <a href={`tel:${site.phoneTel}`} className="underline">
                  {site.phone}
                </a>
              ) : (
                <Placeholder />
              )}
            </dd>
            {site.hotline && (
              <>
                <dt className="font-semibold">{t("hotline")}</dt>
                <dd>
                  <a href={`tel:${site.hotlineTel}`} className="underline">
                    {site.hotline}
                  </a>
                </dd>
              </>
            )}
            {site.messengerUrl && (
              <>
                <dt className="font-semibold">Messenger</dt>
                <dd>
                  <a
                    href={site.messengerUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 underline"
                  >
                    <MessageCircleIcon className="size-5" aria-hidden="true" />
                    {t("messengerCta")}
                  </a>
                </dd>
              </>
            )}
            <dt className="font-semibold">{t("email")}</dt>
            <dd>
              {site.email ? (
                <a href={`mailto:${site.email}`} className="underline">
                  {site.email}
                </a>
              ) : (
                <Placeholder />
              )}
            </dd>
          </dl>
          <p className="mt-4 text-sm text-white/85">{t("cubMember")}</p>
        </section>

        <nav aria-labelledby="footer-links">
          <h2 id="footer-links" className="text-lg text-white">
            {t("linksHeading")}
          </h2>
          <ul className="mt-2">
            {primaryNav
              .filter((item) => item.key !== "aboutUs")
              .map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={linkClass}>
                    {tn(item.key)}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-more">
          <h2 id="footer-more" className="text-lg text-white">
            {t("moreHeading")}
          </h2>
          <ul className="mt-2">
            {secondaryNav
              .filter((item) => item.key !== "faq")
              .map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={linkClass}>
                    {tn(item.key)}
                  </Link>
                </li>
              ))}
            {site.facebookUrl && (
              <li>
                <a
                  href={site.facebookUrl}
                  target="_blank"
                  rel="noopener"
                  className={`${linkClass} gap-2`}
                >
                  {t("likeUs")}
                  <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#1877f2]">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5 shrink-0 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4v3.2h2.8V22h3.3z" />
                    </svg>
                  </span>
                  <span className="sr-only">Facebook</span>
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/25">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-sm text-white/85 sm:flex-row sm:justify-between">
          <p>
            {t("rights", {
              year: String(BUILT_AT.getFullYear()),
              name: site.shortName,
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
