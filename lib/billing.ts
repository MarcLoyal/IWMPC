/**
 * Water bill arithmetic. Pure functions, no I/O — used by the bill calculator
 * in the browser and validated by tests/billing.test.ts.
 *
 * Model (spec §6.5): a minimum charge covers the first `minimum_cu_m` cubic
 * metres; consumption beyond that is priced per cubic metre by tier. Tier
 * bounds are inclusive whole cubic metres, e.g. 11–20, 21–30, 31 and up.
 */

export type RateTier = { from: number; to: number | null; rate: number };

export type RateClass = {
  id: string;
  minimum_charge: number;
  minimum_cu_m: number;
  tiers: RateTier[];
};

export type BillLine =
  | { kind: "minimum"; cu_m: number; amount: number }
  | {
      kind: "tier";
      from: number;
      to: number | null;
      cu_m: number;
      rate: number;
      amount: number;
    };

export type Bill = { consumption: number; lines: BillLine[]; total: number };

export type ReadingError = "invalid" | "negative" | "rollover";
export type Result<T> =
  { ok: true; value: T } | { ok: false; error: ReadingError };

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Parses what a member typed into a reading / cubic-metre field. Whole numbers only. */
export function parseCubicMeters(input: string): Result<number> {
  const text = input.trim().replace(/,/g, "");
  if (text === "") return { ok: false, error: "invalid" };
  const n = Number(text);
  if (!Number.isFinite(n)) return { ok: false, error: "invalid" };
  if (n < 0) return { ok: false, error: "negative" };
  if (!Number.isInteger(n)) return { ok: false, error: "invalid" };
  return { ok: true, value: n };
}

/**
 * Consumption from two meter readings. A current reading below the previous
 * one would mean the meter rolled over or was replaced; that is not something
 * to guess at, so it is rejected and the member is pointed to the office.
 */
export function consumptionFromReadings(
  previous: number,
  current: number,
): Result<number> {
  for (const n of [previous, current]) {
    if (!Number.isFinite(n) || !Number.isInteger(n))
      return { ok: false, error: "invalid" };
    if (n < 0) return { ok: false, error: "negative" };
  }
  if (current < previous) return { ok: false, error: "rollover" };
  return { ok: true, value: current - previous };
}

/** True while a class still carries the `0` placeholders from the content file. */
export function isPlaceholderRate(cls: RateClass): boolean {
  return (
    !(cls.minimum_charge > 0) ||
    !(cls.minimum_cu_m >= 0) ||
    cls.tiers.length === 0 ||
    cls.tiers.some((t) => !(t.rate > 0))
  );
}

/** Structural problems in a rate class (gaps, overlaps, missing open-ended tier). */
export function rateClassProblems(cls: RateClass): string[] {
  const problems: string[] = [];
  let expectedFrom = cls.minimum_cu_m + 1;
  cls.tiers.forEach((tier, i) => {
    const last = i === cls.tiers.length - 1;
    if (tier.from !== expectedFrom) {
      problems.push(
        `tier ${i + 1} should start at ${expectedFrom}, not ${tier.from}`,
      );
    }
    if (last) {
      if (tier.to !== null)
        problems.push("the last tier must be open-ended (to: null)");
    } else if (tier.to === null) {
      problems.push(`tier ${i + 1} is open-ended but is not the last tier`);
    } else if (tier.to < tier.from) {
      problems.push(
        `tier ${i + 1} ends (${tier.to}) before it starts (${tier.from})`,
      );
    } else {
      expectedFrom = tier.to + 1;
    }
  });
  return problems;
}

/** Itemised bill for `consumption` cubic metres. Throws on bad input or placeholder rates. */
export function computeBill(cls: RateClass, consumption: number): Bill {
  if (!Number.isFinite(consumption) || consumption < 0) {
    throw new RangeError("consumption must be zero or more");
  }
  if (isPlaceholderRate(cls)) {
    throw new Error(`rates for "${cls.id}" are not set yet`);
  }

  // The minimum charge applies in full even when little or no water was used.
  const lines: BillLine[] = [
    {
      kind: "minimum",
      cu_m: Math.min(consumption, cls.minimum_cu_m),
      amount: round2(cls.minimum_charge),
    },
  ];

  for (const tier of cls.tiers) {
    const upper = tier.to ?? Infinity;
    const cu_m = Math.min(consumption, upper) - (tier.from - 1);
    if (cu_m <= 0) break;
    lines.push({
      kind: "tier",
      from: tier.from,
      to: tier.to,
      cu_m,
      rate: tier.rate,
      amount: round2(cu_m * tier.rate),
    });
  }

  return {
    consumption,
    lines,
    total: round2(lines.reduce((sum, line) => sum + line.amount, 0)),
  };
}
