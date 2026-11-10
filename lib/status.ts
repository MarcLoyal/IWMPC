export type StatusLevel = "normal" | "scheduled" | "outage";

export type SupplyStatus = {
  level: StatusLevel;
  title_fil: string;
  title_en?: string;
  details_fil?: string;
  details_en?: string;
  affected_areas: string[];
  starts_at?: Date;
  ends_at?: Date;
  updated_at: Date;
  link?: string;
};

export const NORMAL_TITLE = {
  fil: "Normal ang supply ng tubig",
  en: "Water supply is normal",
} as const;

/**
 * What the banner should actually show at `now`.
 *
 * A scheduled interruption whose `ends_at` has passed falls back to "normal"
 * on its own, so a forgotten banner never claims an interruption that is over.
 * An outage is never cleared automatically: staff must confirm supply is back.
 */
export function effectiveStatus(status: SupplyStatus, now: Date): SupplyStatus {
  if (
    status.level === "scheduled" &&
    status.ends_at &&
    status.ends_at.getTime() <= now.getTime()
  ) {
    return {
      level: "normal",
      title_fil: NORMAL_TITLE.fil,
      title_en: NORMAL_TITLE.en,
      affected_areas: [],
      updated_at: status.ends_at,
    };
  }
  return status;
}
