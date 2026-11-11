import { Suspense } from "react";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { REPORT_HREF, site } from "@/lib/site";
import { LanguageToggle } from "./language-toggle";

/**
 * Utility strip above the header (tablet and up): social links and a welcome
 * on the left; email, office hours, report link and language on the right.
 * Email, hours and social links appear by themselves once they are filled in
 * in lib/site.ts — until then the address stands in.
 */
export function InfoStrip() {
  const t = useTranslations("infoStrip");
  const tn = useTranslations("nav");
  const item = "flex items-center gap-2";
  const icon = "size-4 shrink-0 text-primary";
  const social =
    "inline-flex size-9 items-center justify-center rounded-full text-foreground/70 hover:bg-background hover:text-primary";

  return (
    <div className="no-print hidden border-b bg-surface text-sm text-foreground md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-x-6 px-4 py-1">
        {(site.facebookUrl || site.messengerUrl) && (
          <ul className="flex items-center">
            {site.facebookUrl && (
              <li>
                <a href={site.facebookUrl} rel="noopener" className={social}>
                  {/* lucide ships no brand icons */}
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4v3.2h2.8V22h3.3z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </a>
              </li>
            )}
            {site.messengerUrl && (
              <li>
                <a href={site.messengerUrl} rel="noopener" className={social}>
                  <MessageCircleIcon className="size-4" aria-hidden="true" />
                  <span className="sr-only">Messenger</span>
                </a>
              </li>
            )}
          </ul>
        )}
        <p className="max-w-none font-medium">{t("welcome")}</p>

        <ul className="ml-auto flex items-center gap-x-6">
          {site.email && (
            <li>
              <a
                href={`mailto:${site.email}`}
                className={`${item} min-h-9 underline-offset-4 hover:underline`}
              >
                <MailIcon className={icon} aria-hidden="true" />
                {site.email}
              </a>
            </li>
          )}
          {site.officeHours ? (
            <li className={item}>
              <ClockIcon className={icon} aria-hidden="true" />
              <span className="sr-only">{t("hours")}: </span>
              {site.officeHours}
            </li>
          ) : (
            <li className={`${item} hidden lg:flex`}>
              <MapPinIcon className={icon} aria-hidden="true" />
              {site.address}
            </li>
          )}
          <li>
            <Link
              href={REPORT_HREF}
              className={`${item} min-h-9 font-semibold text-danger-strong underline-offset-4 hover:underline`}
            >
              <TriangleAlertIcon
                className="size-4 shrink-0"
                aria-hidden="true"
              />
              {tn("report")}
            </Link>
          </li>
          <li>
            <Suspense fallback={null}>
              <LanguageToggle compact />
            </Suspense>
          </li>
        </ul>
      </div>
    </div>
  );
}
