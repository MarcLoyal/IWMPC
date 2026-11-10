import { describe, expect, it } from "vitest";
import {
  computeBill,
  consumptionFromReadings,
  isPlaceholderRate,
  parseCubicMeters,
  rateClassProblems,
  type RateClass,
} from "@/lib/billing";

// Made-up numbers for testing the arithmetic only — NOT the cooperative's rates.
const fixture: RateClass = {
  id: "test",
  minimum_charge: 150,
  minimum_cu_m: 10,
  tiers: [
    { from: 11, to: 20, rate: 18 },
    { from: 21, to: 30, rate: 20.5 },
    { from: 31, to: null, rate: 25 },
  ],
};

describe("computeBill", () => {
  it("charges the full minimum at zero consumption", () => {
    const bill = computeBill(fixture, 0);
    expect(bill.total).toBe(150);
    expect(bill.lines).toEqual([{ kind: "minimum", cu_m: 0, amount: 150 }]);
  });

  it("charges only the minimum at exactly the minimum volume", () => {
    const bill = computeBill(fixture, 10);
    expect(bill.total).toBe(150);
    expect(bill.lines).toHaveLength(1);
    expect(bill.lines[0]).toMatchObject({ kind: "minimum", cu_m: 10 });
  });

  it("starts the first tier one cubic metre past the minimum", () => {
    const bill = computeBill(fixture, 11);
    expect(bill.lines[1]).toMatchObject({
      kind: "tier",
      from: 11,
      cu_m: 1,
      amount: 18,
    });
    expect(bill.total).toBe(168);
  });

  it("fills a tier exactly at its upper boundary", () => {
    const bill = computeBill(fixture, 20);
    expect(bill.lines).toHaveLength(2);
    expect(bill.lines[1]).toMatchObject({ cu_m: 10, amount: 180 });
    expect(bill.total).toBe(330);
  });

  it("moves into the next tier one cubic metre past a boundary", () => {
    const bill = computeBill(fixture, 21);
    expect(bill.lines).toHaveLength(3);
    expect(bill.lines[2]).toMatchObject({ from: 21, cu_m: 1, amount: 20.5 });
    expect(bill.total).toBe(350.5);
  });

  it("prices everything above the last boundary in the open-ended tier", () => {
    const bill = computeBill(fixture, 45);
    // 150 + 10×18 + 10×20.5 + 15×25
    expect(bill.lines.map((l) => l.amount)).toEqual([150, 180, 205, 375]);
    expect(bill.total).toBe(910);
  });

  it("itemised amounts always add up to the total", () => {
    for (const c of [0, 1, 10, 11, 20, 21, 30, 31, 100]) {
      const bill = computeBill(fixture, c);
      const sum = bill.lines.reduce((s, l) => s + l.amount, 0);
      expect(bill.total).toBeCloseTo(sum, 2);
      const tierVolume = bill.lines.reduce((s, l) => s + l.cu_m, 0);
      expect(tierVolume).toBe(c);
    }
  });

  it("rounds to centavos", () => {
    const odd = { ...fixture, tiers: [{ from: 11, to: null, rate: 17.335 }] };
    expect(computeBill(odd, 13).total).toBe(202.01); // 150 + 3 × 17.335 = 202.005
  });

  it("rejects negative consumption", () => {
    expect(() => computeBill(fixture, -1)).toThrow(RangeError);
    expect(() => computeBill(fixture, Number.NaN)).toThrow(RangeError);
  });

  it("refuses to compute with placeholder rates", () => {
    const placeholder = {
      ...fixture,
      tiers: fixture.tiers.map((t) => ({ ...t, rate: 0 })),
    };
    expect(() => computeBill(placeholder, 15)).toThrow(/not set/);
  });
});

describe("isPlaceholderRate", () => {
  it("is false for a fully priced class", () => {
    expect(isPlaceholderRate(fixture)).toBe(false);
  });
  it("is true when any rate or the minimum charge is still 0", () => {
    expect(isPlaceholderRate({ ...fixture, minimum_charge: 0 })).toBe(true);
    expect(
      isPlaceholderRate({
        ...fixture,
        tiers: [fixture.tiers[0], { from: 21, to: null, rate: 0 }],
      }),
    ).toBe(true);
    expect(isPlaceholderRate({ ...fixture, tiers: [] })).toBe(true);
  });
});

describe("consumptionFromReadings", () => {
  it("subtracts previous from current", () => {
    expect(consumptionFromReadings(1200, 1217)).toEqual({
      ok: true,
      value: 17,
    });
    expect(consumptionFromReadings(500, 500)).toEqual({ ok: true, value: 0 });
  });
  it("rejects negative readings", () => {
    expect(consumptionFromReadings(-1, 10)).toEqual({
      ok: false,
      error: "negative",
    });
  });
  it("does not support meter rollover", () => {
    expect(consumptionFromReadings(9990, 12)).toEqual({
      ok: false,
      error: "rollover",
    });
  });
  it("rejects fractions and non-numbers", () => {
    expect(consumptionFromReadings(10.5, 20)).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(consumptionFromReadings(10, Number.NaN)).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("parseCubicMeters", () => {
  it("accepts whole numbers, with spaces or thousands commas", () => {
    expect(parseCubicMeters(" 17 ")).toEqual({ ok: true, value: 17 });
    expect(parseCubicMeters("1,234")).toEqual({ ok: true, value: 1234 });
    expect(parseCubicMeters("0")).toEqual({ ok: true, value: 0 });
  });
  it("rejects empty, text, fractions and negatives", () => {
    expect(parseCubicMeters("")).toEqual({ ok: false, error: "invalid" });
    expect(parseCubicMeters("abc")).toEqual({ ok: false, error: "invalid" });
    expect(parseCubicMeters("12.5")).toEqual({ ok: false, error: "invalid" });
    expect(parseCubicMeters("-3")).toEqual({ ok: false, error: "negative" });
  });
});

describe("rateClassProblems", () => {
  it("accepts contiguous tiers ending open-ended", () => {
    expect(rateClassProblems(fixture)).toEqual([]);
  });
  it("flags gaps, overlaps and a closed last tier", () => {
    expect(
      rateClassProblems({
        ...fixture,
        tiers: [
          { from: 12, to: 20, rate: 1 },
          { from: 21, to: null, rate: 1 },
        ],
      }),
    ).toHaveLength(1);
    expect(
      rateClassProblems({
        ...fixture,
        tiers: [
          { from: 11, to: 20, rate: 1 },
          { from: 20, to: null, rate: 1 },
        ],
      }),
    ).toHaveLength(1);
    expect(
      rateClassProblems({ ...fixture, tiers: [{ from: 11, to: 20, rate: 1 }] }),
    ).toHaveLength(1);
  });
});
