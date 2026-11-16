export const ADVISORY_TYPES = [
  "service_interruption",
  "scheduled_maintenance",
  "emergency_repair",
  "low_pressure",
  "water_quality",
  "office_closure",
  "other",
] as const;
export const ADVISORY_STATUSES = ["upcoming", "ongoing", "resolved"] as const;

export type AdvisoryType = (typeof ADVISORY_TYPES)[number];
export type AdvisoryStatus = (typeof ADVISORY_STATUSES)[number];
