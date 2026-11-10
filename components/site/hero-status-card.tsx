import {
  ArrowRightIcon,
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
import { effectiveStatus, type StatusLevel } from "@/lib/status";
import { cn } from "@/lib/utils";

const LEVEL = {
  normal: { icon: CircleCheckIcon, tone: "text-success-strong" },
  scheduled: { icon: CalendarClockIcon, tone: "text-warning-strong" },
  outage: { icon: TriangleAlertIcon, tone: "text-danger-strong" },
} satisfies Record<StatusLevel, { icon: React.ElementType; tone: string }>;

const ADVISORY_TONE = {
  ongoing: "text-danger-strong",
  upcoming: "text-warning-strong",
  resolved: "text-success-strong",
} as const;

/** The hero's "dashboard" card: today's water status at a glance. */
export async function HeroStatusCard() {
  const [raw, now, advisories, t, ta, ts, format, locale] = await Promise.all([
    getSupplyStatus(),
    getNow(),
    getAdvisories(),
    getTranslations("home.statusCard"),
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

  const tile = "rounded-xl border bg-surface p-4";
  const tileLabel =
    "flex items-center gap-1.5 text-sm font-medium text-muted-foreground";
  const tileValue = "mt-1 text-2xl font-bold text-foreground";

  return (
    <section
      aria-labelledby="hero-status"
      className="rounded-2xl border bg-card p-5 shadow-[0_10px_40px_-12px_rgb(15_23_42/0.18)] md:p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="hero-status" className="text-lg">
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {ts("updated", { time: format.relativeTime(status.updated_at, now) })}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className={cn(tile, "col-span-2 sm:col-span-1")}>
          <dt className={tileLabel}>
            <Icon className={cn("size-4", tone)} aria-hidden="true" />
            {t("now")}
          </dt>
          <dd className={cn("mt-1 text-lg leading-tight font-bold", tone)}>
            {ts(`levels.${status.level}`)}
          </dd>
        </div>
        <div className={tile}>
          <dt className={tileLabel}>
            <CircleDotIcon
              className="size-4 text-danger-strong"
              aria-hidden="true"
            />
            {ta("statuses.ongoing")}
          </dt>
          <dd className={tileValue}>{count("ongoing")}</dd>
        </div>
        <div className={tile}>
          <dt className={tileLabel}>
            <CalendarClockIcon
              className="size-4 text-warning-strong"
              aria-hidden="true"
            />
            {ta("statuses.upcoming")}
          </dt>
          <dd className={tileValue}>{count("upcoming")}</dd>
        </div>
      </dl>

      {active.length === 0 ? (
        <p className="mt-4 rounded-xl border p-4">{t("none")}</p>
      ) : (
        <ul className="mt-4 divide-y rounded-xl border">
          {active.slice(0, 3).map((a) => (
            <li key={a.slug}>
              <Link
                href={`/water/advisories/${a.slug}`}
                className="flex min-h-14 items-center justify-between gap-3 px-4 py-2 hover:bg-surface"
              >
                <span className="font-medium">
                  {localized(a, "title", locale)}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-sm font-semibold",
                    ADVISORY_TONE[a.status],
                  )}
                >
                  {ta(`statuses.${a.status}`)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/water/advisories"
        className="mt-3 inline-flex min-h-12 items-center gap-1 font-semibold text-primary underline underline-offset-4"
      >
        {t("all")}
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
