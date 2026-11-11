import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { primaryNav, secondaryNav, site } from "@/lib/site";
import { Placeholder } from "./placeholder";

// Stamped at build time; every content change triggers a new build.
const BUILT_AT = new Date(process.env.NEXT_PUBLIC_BUILD_TIME!);

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const format = useFormatter();
  const linkClass =
    "inline-flex min-h-12 items-center underline-offset-4 hover:underline";

  return (
    <footer className="border-t-4 border-accent bg-primary pb-20 text-primary-foreground md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[2fr_1fr_1fr]">
        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="text-lg text-white">
            {site.legalName}
          </h2>
          <p className="mt-1 text-sm text-white/85">
            {t("cdaReg")} {site.cdaRegistrationNo}
          </p>
          <dl className="mt-4 grid gap-x-4 gap-y-2 text-base sm:grid-cols-[auto_1fr]">
            <dt className="font-semibold">{t("address")}</dt>
            <dd>{site.address}</dd>
            <dt className="font-semibold">{t("hours")}</dt>
            <dd>{site.officeHours ?? <Placeholder />}</dd>
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
              .filter((item) => item.key !== "aboutShort")
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
            {secondaryNav.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClass}>
                  {tn(item.key)}
                </Link>
              </li>
            ))}
            {site.facebookUrl && (
              <li>
                <a href={site.facebookUrl} rel="noopener" className={linkClass}>
                  Facebook
                </a>
              </li>
            )}
            {/* /portal is reserved for the Phase 2 member portal */}
            <li className="flex min-h-12 items-center text-white/75">
              {t("memberLogin")}
            </li>
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
          <p>
            {t("lastUpdated", {
              date: format.dateTime(BUILT_AT, { dateStyle: "long" }),
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
