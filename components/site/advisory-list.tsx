"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ADVISORY_STATUSES, type AdvisoryStatus } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { AdvisoryCard, type AdvisoryView } from "./advisory-card";

/**
 * All advisories are rendered on the server, so the list reads fine without
 * JavaScript; the filters only narrow it down in the browser.
 */
export function AdvisoryList({ advisories }: { advisories: AdvisoryView[] }) {
  const t = useTranslations("advisories");
  const [status, setStatus] = useState<AdvisoryStatus | "all">("all");
  const [area, setArea] = useState("all");

  const areas = [...new Set(advisories.flatMap((a) => a.affected_areas))].sort(
    (a, b) => a.localeCompare(b, undefined, { numeric: true }),
  );
  const shown = advisories.filter(
    (a) =>
      (status === "all" || a.status === status) &&
      (area === "all" || a.affected_areas.includes(area)),
  );

  if (advisories.length === 0) {
    return <p className="rounded-xl border bg-surface p-6">{t("empty")}</p>;
  }

  return (
    <div>
      <div className="no-print flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <fieldset>
          <legend className="mb-1 text-sm font-semibold">
            {t("filters.status")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {(["all", ...ADVISORY_STATUSES] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={status === value}
                onClick={() => setStatus(value)}
                className={cn(
                  "min-h-12 rounded-full border px-4 font-semibold",
                  status === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background text-primary hover:bg-surface",
                )}
              >
                {value === "all" ? t("filters.all") : t(`statuses.${value}`)}
              </button>
            ))}
          </div>
        </fieldset>

        {areas.length > 0 && (
          <label className="flex flex-col text-sm font-semibold">
            <span className="mb-1">{t("filters.area")}</span>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="min-h-12 rounded-lg border bg-background px-3 text-base font-normal"
            >
              <option value="all">{t("filters.allAreas")}</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <p role="status" className="mt-4 text-sm text-muted-foreground">
        {t("filters.results", { count: shown.length })}
      </p>

      {shown.length === 0 ? (
        <p className="mt-3 rounded-xl border bg-surface p-6">
          {t("emptyFiltered")}
        </p>
      ) : (
        <ul className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <li key={a.slug}>
              <AdvisoryCard advisory={a} headingLevel="h3" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
