import { ArrowRightIcon, CalendarDaysIcon, MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { AdvisoryType } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import type { AdvisoryView } from "@/components/site/advisory-card";
import {
  CalendarIcon,
  NoWaterIcon,
  NoticeIcon,
} from "@/components/site/advisory-icons";

// Site colours only: blue for anything that affects the water supply,
// yellow for dates to note, navy for general notices.
const TONE = {
  blue: {
    row: "bg-primary/8",
    pill: "bg-primary text-white",
    button: "bg-primary text-white",
  },
  yellow: {
    row: "bg-accent/20",
    pill: "bg-accent text-primary-dark",
    button: "bg-primary-dark text-white",
  },
  navy: {
    row: "bg-surface",
    pill: "bg-primary-dark text-white",
    button: "bg-primary-dark text-white",
  },
} as const;

const TYPE: Record<
  AdvisoryType,
  { tone: keyof typeof TONE; icon: React.ComponentType<{ className?: string }> }
> = {
  service_interruption: { tone: "blue", icon: NoWaterIcon },
  emergency_repair: { tone: "blue", icon: NoWaterIcon },
  low_pressure: { tone: "blue", icon: NoWaterIcon },
  scheduled_maintenance: { tone: "yellow", icon: CalendarIcon },
  office_closure: { tone: "yellow", icon: CalendarIcon },
  water_quality: { tone: "navy", icon: NoticeIcon },
  other: { tone: "navy", icon: NoticeIcon },
};

/** One advisory as a coloured row: illustrated icon, type label, summary, "Read details". */
export function AdvisoryRow({ advisory }: { advisory: AdvisoryView }) {
  const t = useTranslations();
  const { tone, icon: Icon } = TYPE[advisory.type];
  const c = TONE[tone];

  return (
    <article className={cn("flex gap-4 p-4 sm:gap-5 sm:p-5", c.row)}>
      <Icon className="size-14 shrink-0 sm:size-16" />
      <div className="min-w-0 flex-1 sm:flex sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <span
            className={cn(
              "inline-block rounded-md px-2.5 py-1 text-sm font-extrabold tracking-wide uppercase",
              c.pill,
            )}
          >
            {t(`advisories.types.${advisory.type}`)}
          </span>
          {advisory.summary ? (
            <>
              <h3 className="sr-only">{advisory.title}</h3>
              <p className="mt-2 text-lg leading-snug text-foreground">
                {advisory.summary}
              </p>
            </>
          ) : (
            <>
              <h3 className="mt-2 text-lg leading-snug font-semibold text-foreground">
                {advisory.title}
              </h3>
              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDaysIcon className="size-4" aria-hidden="true" />
                  <span className="sr-only">{t("advisories.when")}: </span>
                  {advisory.when}
                </span>
                {advisory.affected_areas.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon className="size-4" aria-hidden="true" />
                    <span className="sr-only">{t("advisories.areas")}: </span>
                    {advisory.affected_areas.join(", ")}
                  </span>
                )}
              </p>
            </>
          )}
        </div>
        <div className="mt-3 flex shrink-0 justify-end sm:mt-0">
          <Link
            href={`/water/advisories/${advisory.slug}`}
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold shadow-sm hover:brightness-110",
              c.button,
            )}
          >
            {t("home.advisories.readDetails")}
            <span className="sr-only">: {advisory.title}</span>
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
