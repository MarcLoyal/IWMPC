import {
  ArrowRightIcon,
  CalendarDaysIcon,
  DropletIcon,
  GaugeIcon,
  InfoIcon,
  MapPinIcon,
  WrenchIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { AdvisoryType } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import {
  AdvisoryStatusBadge,
  type AdvisoryView,
} from "@/components/site/advisory-card";

// Red for anything that cuts or weakens supply, yellow for planned work,
// blue for notices.
const TONE = {
  red: {
    row: "bg-danger/10",
    icon: "text-brand-red",
    pill: "bg-brand-red text-white",
    button: "bg-brand-red text-white",
  },
  yellow: {
    row: "bg-accent/20",
    icon: "text-harvest-strong",
    pill: "bg-accent text-accent-foreground",
    button: "bg-primary-dark text-white",
  },
  blue: {
    row: "bg-primary/10",
    icon: "text-primary",
    pill: "bg-primary text-white",
    button: "bg-primary-dark text-white",
  },
} as const;

const TYPE: Record<
  AdvisoryType,
  { tone: keyof typeof TONE; icon: React.ElementType }
> = {
  emergency_repair: { tone: "red", icon: WrenchIcon },
  low_pressure: { tone: "red", icon: GaugeIcon },
  scheduled_maintenance: { tone: "yellow", icon: CalendarDaysIcon },
  water_quality: { tone: "blue", icon: DropletIcon },
  other: { tone: "blue", icon: InfoIcon },
};

/** One advisory as a coloured row: big icon, type pill, summary, "Read details". */
export function AdvisoryRow({ advisory }: { advisory: AdvisoryView }) {
  const t = useTranslations();
  const { tone, icon: Icon } = TYPE[advisory.type];
  const c = TONE[tone];

  return (
    <article className={cn("flex gap-4 p-4 sm:gap-5 sm:p-5", c.row)}>
      <Icon
        className={cn("size-12 shrink-0 sm:size-16", c.icon)}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 sm:flex sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-md px-2.5 py-1 text-sm font-extrabold tracking-wide uppercase",
                c.pill,
              )}
            >
              {t(`advisories.types.${advisory.type}`)}
            </span>
            <AdvisoryStatusBadge status={advisory.status} />
          </div>
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
