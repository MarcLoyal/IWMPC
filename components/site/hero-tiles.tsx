import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarClockIcon,
  CircleCheckIcon,
  CircleDotIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import {
  activeAdvisories,
  getAdvisories,
  getNow,
  getSupplyStatus,
  localized,
} from "@/lib/content";
import { site, yearsOfService } from "@/lib/site";
import { effectiveStatus, type StatusLevel } from "@/lib/status";
import { cn } from "@/lib/utils";

const LEVEL = {
  normal: { icon: CircleCheckIcon, tone: "text-success-strong" },
  scheduled: { icon: CalendarClockIcon, tone: "text-warning-strong" },
  outage: { icon: TriangleAlertIcon, tone: "text-danger-strong" },
} satisfies Record<StatusLevel, { icon: React.ElementType; tone: string }>;

/**
 * The staggered tiles on the right of the hero: today's water status, active
 * advisories and two facts about the cooperative. Real photos of the
 * facility and staff can sit behind or between these once provided.
 */
export async function HeroTiles() {
  const [raw, now, advisories, t, th, ta, ts, format, locale] =
    await Promise.all([
      getSupplyStatus(),
      getNow(),
      getAdvisories(),
      getTranslations("home.statusCard"),
      getTranslations("home.trust"),
      getTranslations("advisories"),
      getTranslations("status"),
      getFormatter(),
      getLocale() as Promise<Locale>,
    ]);
  const status = effectiveStatus(raw, now);
  const { icon: Icon, tone } = LEVEL[status.level];
  const active = activeAdvisories(advisories);
  const count = (s: "ongoing" | "upcoming") =>
    active.filter((a) => a.status === s).length;

  const tile = "rounded-3xl p-5 shadow-lg";
  const glass = cn(tile, "bg-white/12 text-white ring-1 ring-white/25");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Column 1 */}
      <div className="grid content-start gap-4">
        <section
          aria-labelledby="hero-status"
          className={cn(tile, "bg-card text-foreground")}
        >
          <h2
            id="hero-status"
            className="text-sm font-semibold tracking-wide text-muted-foreground uppercase"
          >
            {t("title")}
          </h2>
          <p
            className={cn(
              "mt-3 flex items-center gap-2 text-2xl leading-tight font-bold",
              tone,
            )}
          >
            <Icon className="size-8 shrink-0" aria-hidden="true" />
            {ts(`levels.${status.level}`)}
          </p>
          <p className="mt-2 font-medium">
            {localized(status, "title", locale)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {ts("updated", {
              time: format.relativeTime(status.updated_at, now),
            })}
          </p>
          <Link
            href={status.link ?? "/water/advisories"}
            className="mt-2 inline-flex min-h-12 items-center gap-1 font-semibold text-primary underline underline-offset-4"
          >
            {ts("details")}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </section>

        <div className={cn(tile, "bg-accent text-accent-foreground")}>
          <p className="text-5xl font-extrabold tracking-tight">
            {yearsOfService(now)}
          </p>
          <p className="mt-1 text-lg font-semibold">{th("years")}</p>
        </div>
      </div>

      {/* Column 2, nudged down for the staggered look */}
      <div className="grid content-start gap-4 sm:mt-10">
        <section aria-labelledby="hero-advisories" className={glass}>
          <h2
            id="hero-advisories"
            className="text-sm font-semibold tracking-wide text-white/85 uppercase"
          >
            {ta("listHeading")}
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <dd className="text-4xl font-extrabold">{count("ongoing")}</dd>
              <dt className="flex items-center gap-1.5 text-sm font-medium text-white/90">
                <CircleDotIcon className="size-4" aria-hidden="true" />
                {ta("statuses.ongoing")}
              </dt>
            </div>
            <div>
              <dd className="text-4xl font-extrabold">{count("upcoming")}</dd>
              <dt className="flex items-center gap-1.5 text-sm font-medium text-white/90">
                <CalendarClockIcon className="size-4" aria-hidden="true" />
                {ta("statuses.upcoming")}
              </dt>
            </div>
          </dl>
          {active.length === 0 ? (
            <p className="mt-3 text-white/90">{t("none")}</p>
          ) : (
            <ul className="mt-3 divide-y divide-white/20 border-t border-white/20">
              {active.slice(0, 2).map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/water/advisories/${a.slug}`}
                    className="flex min-h-12 items-center py-2 leading-snug font-medium underline-offset-4 hover:underline"
                  >
                    {localized(a, "title", locale)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/water/advisories"
            className="mt-1 inline-flex min-h-12 items-center gap-1 font-semibold text-accent underline underline-offset-4"
          >
            {t("all")}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </section>

        <div className={cn(glass, "flex items-center gap-3")}>
          <BadgeCheckIcon
            className="size-10 shrink-0 text-accent"
            aria-hidden="true"
          />
          <p>
            <span className="block text-lg font-bold">{th("cda")}</span>
            <span className="text-sm text-white/90">
              Reg. No. {site.cdaRegistrationNo}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
