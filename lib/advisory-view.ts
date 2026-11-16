import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import type { DateTimeFormatOptions } from "next-intl";
import { localized, type Advisory } from "@/lib/content";
import type { Locale } from "@/lib/i18n/routing";
import type { AdvisoryView } from "@/components/site/advisory-card";

/** Returns a function that turns advisories into display-ready card data. */
export async function getAdvisoryViewer(
  dateOptions: DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
) {
  const [t, format, locale] = await Promise.all([
    getTranslations("advisories"),
    getFormatter(),
    getLocale() as Promise<Locale>,
  ]);

  return (a: Advisory): AdvisoryView => ({
    slug: a.slug,
    sample: a.sample,
    title: localized(a, "title", locale),
    summary: a.summary_fil ? localized(a, "summary", locale) : undefined,
    type: a.type,
    status: a.status,
    affected_areas: a.affected_areas,
    when: a.ends_at
      ? format.dateTimeRange(a.starts_at, a.ends_at, dateOptions)
      : t("since", { date: format.dateTime(a.starts_at, dateOptions) }),
  });
}
