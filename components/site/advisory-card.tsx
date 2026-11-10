import {
  CalendarClockIcon,
  CircleCheckIcon,
  CircleDotIcon,
  MapPinIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { AdvisoryStatus, AdvisoryType } from "@/lib/content-types";
import { Badge } from "@/components/ui/badge";

/**
 * Plain, display-ready advisory data — safe to pass to client components.
 * Title and time window are resolved on the server (see lib/advisory-view.ts)
 * so server and browser never format a date differently.
 */
export type AdvisoryView = {
  slug: string;
  sample: boolean;
  title: string;
  type: AdvisoryType;
  status: AdvisoryStatus;
  affected_areas: string[];
  when: string;
};

const STATUS = {
  upcoming: { tone: "warning", icon: CalendarClockIcon },
  ongoing: { tone: "danger", icon: CircleDotIcon },
  resolved: { tone: "success", icon: CircleCheckIcon },
} as const;

export function AdvisoryStatusBadge({ status }: { status: AdvisoryStatus }) {
  const t = useTranslations("advisories.statuses");
  const { tone, icon: Icon } = STATUS[status];
  return (
    <Badge tone={tone}>
      <Icon aria-hidden="true" />
      {t(status)}
    </Badge>
  );
}

export function AdvisoryCard({
  advisory,
  headingLevel: Heading = "h3",
}: {
  advisory: AdvisoryView;
  headingLevel?: "h2" | "h3";
}) {
  const t = useTranslations();

  return (
    <article className="relative flex h-full flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm focus-within:ring-2 focus-within:ring-primary hover:border-primary">
      <div className="flex flex-wrap gap-2">
        <AdvisoryStatusBadge status={advisory.status} />
        <Badge>{t(`advisories.types.${advisory.type}`)}</Badge>
        {advisory.sample && <Badge tone="harvest">{t("common.sample")}</Badge>}
      </div>
      <Heading className="text-xl">
        <Link
          href={`/water/advisories/${advisory.slug}`}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {advisory.title}
        </Link>
      </Heading>
      <dl className="mt-auto grid gap-1.5 text-base">
        <div className="flex gap-2">
          <dt>
            <CalendarClockIcon
              className="mt-1 size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="sr-only">{t("advisories.when")}</span>
          </dt>
          <dd>{advisory.when}</dd>
        </div>
        {advisory.affected_areas.length > 0 && (
          <div className="flex gap-2">
            <dt>
              <MapPinIcon
                className="mt-1 size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="sr-only">{t("advisories.areas")}</span>
            </dt>
            <dd>{advisory.affected_areas.join(", ")}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
