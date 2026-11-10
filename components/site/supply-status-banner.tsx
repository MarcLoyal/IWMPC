import {
  ArrowRightIcon,
  CalendarClockIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import { getNow, getSupplyStatus, localized } from "@/lib/content";
import { effectiveStatus, type StatusLevel } from "@/lib/status";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { DismissibleStatus } from "./status-dismiss";

// Colour is never the only signal: every level has its own icon and text label.
const LEVEL = {
  normal: {
    icon: CircleCheckIcon,
    bar: "border-success/40 bg-[#e8f6ed] text-success-strong",
  },
  scheduled: {
    icon: CalendarClockIcon,
    bar: "border-warning/60 bg-[#fef3d6] text-warning-strong",
  },
  outage: {
    icon: TriangleAlertIcon,
    bar: "border-danger/40 bg-[#fde8e8] text-danger-strong",
  },
} satisfies Record<StatusLevel, { icon: React.ElementType; bar: string }>;

/**
 * Site-wide supply status. `bar` is the slim strip under the header;
 * `large` is the detailed card used on the Water pages.
 */
export async function SupplyStatusBanner({
  variant = "bar",
}: {
  variant?: "bar" | "large";
}) {
  const [raw, now, t, format, locale] = await Promise.all([
    getSupplyStatus(),
    getNow(),
    getTranslations("status"),
    getFormatter(),
    getLocale() as Promise<Locale>,
  ]);
  const status = effectiveStatus(raw, now);
  const { icon: Icon, bar } = LEVEL[status.level];
  const title = localized(status, "title", locale);
  const details = localized(status, "details", locale);
  const updated = t("updated", {
    time: format.relativeTime(status.updated_at, now),
  });

  if (variant === "large") {
    return (
      <section
        aria-label={t("label")}
        className={cn("rounded-2xl border-2 p-5 md:p-6", bar)}
      >
        <p className="flex max-w-none items-center gap-2 text-sm font-bold tracking-wide uppercase">
          <Icon className="size-6 shrink-0" aria-hidden="true" />
          {t(`levels.${status.level}`)}
        </p>
        <p className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
          {title}
        </p>
        {details && <p className="mt-2 text-foreground">{details}</p>}
        <dl className="mt-4 grid gap-x-6 gap-y-2 text-foreground sm:grid-cols-[auto_1fr]">
          {status.starts_at && (
            <>
              <dt className="font-semibold">{t("when")}</dt>
              <dd>
                {status.ends_at
                  ? format.dateTimeRange(status.starts_at, status.ends_at, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : format.dateTime(status.starts_at, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
              </dd>
            </>
          )}
          {status.affected_areas.length > 0 && (
            <>
              <dt className="font-semibold">{t("affected")}</dt>
              <dd>{status.affected_areas.join(", ")}</dd>
            </>
          )}
        </dl>
        <p className="mt-4 flex max-w-none flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground">
          <span>{updated}</span>
          {status.link && (
            <Link
              href={status.link}
              className="inline-flex min-h-12 items-center gap-1 font-semibold underline underline-offset-4"
            >
              {t("details")}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          )}
        </p>
      </section>
    );
  }

  const content = (
    <section aria-label={t("label")} className={cn("border-b", bar)}>
      <Container
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-0.5 py-2",
          status.level === "normal" && "pr-14",
        )}
      >
        <Icon className="size-6 shrink-0" aria-hidden="true" />
        <p className="font-semibold">
          <span className="sr-only">{t(`levels.${status.level}`)}: </span>
          {title}
        </p>
        <p className="flex items-center gap-3 text-sm text-foreground">
          <span>{updated}</span>
          {status.link && (
            <Link
              href={status.link}
              className="inline-flex min-h-12 items-center gap-1 font-semibold underline underline-offset-4"
            >
              {t("details")}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          )}
        </p>
      </Container>
    </section>
  );

  // Only the reassuring "normal" state may be hidden, and only for this session.
  return status.level === "normal" ? (
    <DismissibleStatus
      stamp={status.updated_at.toISOString()}
      label={t("dismiss")}
    >
      {content}
    </DismissibleStatus>
  ) : (
    content
  );
}
