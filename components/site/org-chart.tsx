import { ChevronDownIcon, UsersIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";
import { getOrgChart, localized, type OrgBody } from "@/lib/content";
import { cn } from "@/lib/utils";

/** First letters of the given name and surname, e.g. "Marlito M. Gamier" → "MG". */
function initials(name: string) {
  const parts = name.replace(/\./g, "").split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** A short vertical line joining one tier of the chart to the next. */
function Connector({ dashed = false }: { dashed?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mx-auto h-8 w-0 border-l-2",
        dashed ? "border-dashed border-white/60" : "border-white",
      )}
    />
  );
}

async function Body({
  body,
  columns,
}: {
  body: OrgBody;
  /** Grid classes for the member list. */
  columns?: string;
}) {
  const [t, locale] = await Promise.all([
    getTranslations("about"),
    getLocale() as Promise<Locale>,
  ]);
  const title = localized(body, "title", locale);
  const headingId = `org-${body.id}`;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "flex h-full flex-col rounded-2xl bg-card text-foreground shadow-lg",
        body.kind === "appointed"
          ? "outline-2 outline-offset-4 outline-white/60 outline-dashed"
          : "outline-2 outline-offset-4 outline-white outline-solid",
      )}
    >
      <h4
        id={headingId}
        className="rounded-t-2xl bg-accent px-4 py-2.5 text-center text-base font-extrabold tracking-wide text-primary-dark uppercase"
      >
        {title}
      </h4>
      <ul className={cn("grid gap-3 p-4", columns)}>
        {body.members.map((m, i) => (
          <li key={i} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                m.name
                  ? "bg-primary text-white"
                  : "border-2 border-dashed border-border text-muted-foreground",
              )}
            >
              {m.name ? initials(m.name) : "–"}
            </span>
            <span className="min-w-0 leading-tight">
              <span
                className={cn(
                  "block font-semibold",
                  !m.name && "text-muted-foreground italic",
                )}
              >
                {m.name ?? t("orgVacant")}
              </span>
              <span className="block text-sm text-muted-foreground">
                {m.role}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {body.duties_en && (
        <details className="group mt-auto border-t px-4 py-3 text-sm">
          <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between font-semibold text-primary [&::-webkit-details-marker]:hidden">
            {t("orgDuties")}
            <ChevronDownIcon
              className="size-4 transition group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-2 max-w-none leading-relaxed text-muted-foreground">
            {body.duties_en}
          </p>
        </details>
      )}
    </article>
  );
}

/**
 * The cooperative's organizational/functional structure, tier by tier:
 * General Assembly, the elected bodies, appointed officers and committees,
 * the General Manager and the management staff. People are shown by their
 * initials until formal photos are provided.
 */
export async function OrgChart() {
  const [t, locale, chart] = await Promise.all([
    getTranslations("about"),
    getLocale() as Promise<Locale>,
    getOrgChart(),
  ]);
  const [election, board, audit] = chart.top;

  return (
    <div>
      <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl bg-white px-6 py-3 text-primary-dark shadow-lg">
        <UsersIcon className="size-7 text-primary" aria-hidden="true" />
        <span className="text-xl font-extrabold tracking-wide uppercase md:text-2xl">
          {localized(chart.general_assembly, "title", locale)}
        </span>
      </div>
      <Connector />

      {/* Elected: Election Committee, Board of Directors, Audit Committee */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr_1fr]">
        <Body body={election} />
        <Body body={board} columns="sm:grid-cols-2" />
        <Body body={audit} />
      </div>
      <Connector dashed />

      {/* Appointed by the Board: Treasurer and Secretary */}
      <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
        {chart.officers.map((b) => (
          <Body key={b.id} body={b} />
        ))}
      </div>
      <Connector dashed />

      {/* Committees */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {chart.committees.map((b) => (
          <Body key={b.id} body={b} />
        ))}
      </div>
      <Connector dashed />

      <div className="mx-auto max-w-md">
        <Body body={chart.manager} />
      </div>
      <Connector />

      <Body body={chart.staff} columns="sm:grid-cols-2 lg:grid-cols-3" />

      <p className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/90">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block w-10 border-t-4 border-white"
          />
          {t("orgElected")}
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block w-10 border-t-4 border-dashed border-white/70"
          />
          {t("orgAppointed")}
        </span>
      </p>
    </div>
  );
}
