import { promises as fs } from "node:fs";
import path from "node:path";
import { cacheLife } from "next/cache";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import type { Locale } from "@/lib/i18n/routing";
import type { SupplyStatus } from "@/lib/status";
import { rateClassProblems } from "@/lib/billing";
import { ADVISORY_STATUSES, ADVISORY_TYPES } from "@/lib/content-types";

export type { AdvisoryStatus, AdvisoryType } from "@/lib/content-types";

const CONTENT_DIR = path.join(process.cwd(), "content");

const date = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date")
  .transform((s) => new Date(s));

const optionalText = z
  .string()
  .optional()
  .transform((s) => (s && s.trim() ? s : undefined));

/* ---------- Supply status ---------- */

const statusSchema = z.object({
  level: z.enum(["normal", "scheduled", "outage"]),
  title_fil: z.string().min(1),
  title_en: optionalText,
  details_fil: optionalText,
  details_en: optionalText,
  affected_areas: z.array(z.string()).default([]),
  starts_at: date.optional(),
  ends_at: date.optional(),
  updated_at: date,
  link: optionalText,
});

export async function getSupplyStatus(): Promise<SupplyStatus> {
  "use cache";
  cacheLife("max"); // content only changes with a new deployment
  const raw = await fs.readFile(path.join(CONTENT_DIR, "status.yaml"), "utf8");
  return statusSchema.parse(parseYaml(raw));
}

/**
 * The current time, refreshed about once a minute. Reading the clock through
 * this keeps pages static while still letting time-based rules (an ended
 * interruption, "updated 2 hours ago") catch up without a redeploy.
 */
export async function getNow(): Promise<Date> {
  "use cache";
  cacheLife("minutes");
  return new Date();
}

/* ---------- Advisories ---------- */

const advisorySchema = z.object({
  sample: z.boolean().default(false),
  title_fil: z.string().min(1),
  title_en: optionalText,
  type: z.enum(ADVISORY_TYPES),
  status: z.enum(ADVISORY_STATUSES),
  affected_areas: z.array(z.string()).default([]),
  starts_at: date,
  ends_at: date.optional(),
  facebook_post_url: optionalText,
  body_en: optionalText,
});

export type Advisory = z.infer<typeof advisorySchema> & {
  slug: string;
  /** Filipino body (Markdoc). */
  body_fil: string;
};

function parseFrontmatter(raw: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) throw new Error("Missing frontmatter");
  return { data: parseYaml(match[1]), body: match[2].trim() };
}

export async function getAdvisories(): Promise<Advisory[]> {
  "use cache";
  cacheLife("max");
  const dir = path.join(CONTENT_DIR, "advisories");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".mdoc"));
  const advisories = await Promise.all(
    files.map(async (file) => {
      const { data, body } = parseFrontmatter(
        await fs.readFile(path.join(dir, file), "utf8"),
      );
      const parsed = advisorySchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `content/advisories/${file}: ${z.prettifyError(parsed.error)}`,
        );
      }
      return {
        ...parsed.data,
        slug: file.replace(/\.mdoc$/, ""),
        body_fil: body,
      };
    }),
  );
  // Newest first
  return advisories.sort(
    (a, b) => b.starts_at.getTime() - a.starts_at.getTime(),
  );
}

export async function getAdvisory(slug: string) {
  return (await getAdvisories()).find((a) => a.slug === slug);
}

/** Active first (ongoing, then upcoming soonest-first); resolved are excluded. */
export function activeAdvisories(advisories: Advisory[]) {
  const ongoing = advisories.filter((a) => a.status === "ongoing");
  const upcoming = advisories
    .filter((a) => a.status === "upcoming")
    .sort((a, b) => a.starts_at.getTime() - b.starts_at.getTime());
  return [...ongoing, ...upcoming];
}

/* ---------- Water rates ---------- */

const amount = z.number().min(0);

const ratesSchema = z.object({
  effective_date: optionalText,
  currency: z.literal("PHP"),
  classes: z
    .array(
      z.object({
        id: z.string().min(1),
        label_fil: z.string().min(1),
        label_en: optionalText,
        minimum_charge: amount,
        minimum_cu_m: z.number().int().min(0),
        tiers: z.array(
          z.object({
            from: z.number().int().min(1),
            to: z.number().int().nullable(),
            rate: amount,
          }),
        ),
      }),
    )
    .min(1),
  other_fees: z.object({
    late_penalty_percent: amount,
    reconnection_fee: amount,
  }),
  billing: z.object({
    reading_schedule_fil: optionalText,
    reading_schedule_en: optionalText,
    due_days_after_billing: z.number().int().min(0),
  }),
  disconnection_policy_fil: optionalText,
  disconnection_policy_en: optionalText,
});

export type Rates = z.infer<typeof ratesSchema>;

export async function getRates(): Promise<Rates> {
  "use cache";
  cacheLife("max");
  const raw = await fs.readFile(path.join(CONTENT_DIR, "rates.yaml"), "utf8");
  const rates = ratesSchema.parse(parseYaml(raw));
  for (const cls of rates.classes) {
    const problems = rateClassProblems(cls);
    if (problems.length > 0) {
      throw new Error(
        `content/rates.yaml, class "${cls.id}": ${problems.join("; ")}`,
      );
    }
  }
  return rates;
}

/* ---------- Loans ---------- */

const loansSchema = z.object({
  products: z
    .array(
      z.object({
        id: z.string().min(1),
        name_fil: z.string().min(1),
        name_en: optionalText,
        purpose_fil: optionalText,
        purpose_en: optionalText,
        max_amount: z.number().positive().optional(),
        max_term_months: z.number().int().positive().optional(),
        monthly_interest_percent: z.number().min(0).optional(),
        requirements_fil: z.array(z.string()).default([]),
        requirements_en: z.array(z.string()).default([]),
        eligibility_fil: optionalText,
        eligibility_en: optionalText,
      }),
    )
    .default([]),
  steps_confirmed: z.boolean().default(false),
  steps: z
    .array(z.object({ title_fil: z.string().min(1), title_en: optionalText }))
    .default([]),
});

export type Loans = z.infer<typeof loansSchema>;

export async function getLoans(): Promise<Loans> {
  "use cache";
  cacheLife("max");
  const raw = await fs.readFile(path.join(CONTENT_DIR, "loans.yaml"), "utf8");
  return loansSchema.parse(parseYaml(raw));
}

/* ---------- About ---------- */

const aboutSchema = z.object({
  vision_fil: z.string().min(1),
  vision_en: optionalText,
  mission_fil: z.array(z.string().min(1)).min(1),
  mission_en: z.array(z.string().min(1)).default([]),
  translation_approved: z.boolean().default(false),
});

export type About = z.infer<typeof aboutSchema>;

export async function getAbout(): Promise<About> {
  "use cache";
  cacheLife("max");
  const raw = await fs.readFile(path.join(CONTENT_DIR, "about.yaml"), "utf8");
  return aboutSchema.parse(parseYaml(raw));
}

/* ---------- Service areas ---------- */

const areasSchema = z.object({
  placeholder: z.boolean().default(false),
  areas: z.array(z.string().min(1)).default([]),
});

export async function getAreas() {
  "use cache";
  cacheLife("max");
  const raw = await fs.readFile(path.join(CONTENT_DIR, "areas.yaml"), "utf8");
  return areasSchema.parse(parseYaml(raw));
}

/* ---------- Home page slideshow ---------- */

const slidesSchema = z.object({
  slides: z
    .array(
      z.object({
        image: z.string().startsWith("/"),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        alt_fil: z.string().min(1),
        alt_en: optionalText,
      }),
    )
    .default([]),
});

export async function getSlides() {
  "use cache";
  cacheLife("max");
  const raw = await fs.readFile(path.join(CONTENT_DIR, "slides.yaml"), "utf8");
  return slidesSchema.parse(parseYaml(raw)).slides;
}

/* ---------- Bilingual fields ---------- */

/** Reads `<field>_en` for English and falls back to `<field>_fil` when it is empty. */
export function localized<K extends string>(
  item: Partial<Record<`${K}_fil` | `${K}_en`, string>>,
  field: K,
  locale: Locale,
): string {
  const record = item as Record<string, string | undefined>;
  const fil = record[`${field}_fil`] ?? "";
  return locale === "en" ? record[`${field}_en`] || fil : fil;
}
