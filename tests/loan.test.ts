import { describe, expect, it } from "vitest";
import { estimateLoan, loanInputErrors } from "@/lib/loan";

describe("estimateLoan (flat interest, equal monthly amortization)", () => {
  it("computes interest on the full principal for the whole term", () => {
    // 10,000 at 1.5% a month for 12 months
    expect(
      estimateLoan({
        principal: 10_000,
        monthlyRatePercent: 1.5,
        termMonths: 12,
      }),
    ).toEqual({
      principal: 10_000,
      totalInterest: 1_800,
      totalPayable: 11_800,
      monthlyAmortization: 983.33,
    });
  });

  it("handles a zero-interest loan", () => {
    const e = estimateLoan({
      principal: 6_000,
      monthlyRatePercent: 0,
      termMonths: 6,
    });
    expect(e.totalInterest).toBe(0);
    expect(e.monthlyAmortization).toBe(1_000);
  });

  it("handles a one-month term", () => {
    const e = estimateLoan({
      principal: 5_000,
      monthlyRatePercent: 2,
      termMonths: 1,
    });
    expect(e.totalPayable).toBe(5_100);
    expect(e.monthlyAmortization).toBe(5_100);
  });

  it("rounds to centavos", () => {
    const e = estimateLoan({
      principal: 12_345.67,
      monthlyRatePercent: 1.25,
      termMonths: 7,
    });
    expect(e.totalInterest).toBe(1_080.25); // 12345.67 × 0.0125 × 7 = 1080.246…
    expect(e.totalPayable).toBe(13_425.92);
    expect(e.monthlyAmortization).toBe(1_917.99);
  });

  it("rejects invalid input", () => {
    expect(
      loanInputErrors({ principal: 0, monthlyRatePercent: -1, termMonths: 0 }),
    ).toEqual(["principal", "rate", "term"]);
    expect(
      loanInputErrors({
        principal: 1000,
        monthlyRatePercent: 1,
        termMonths: 2.5,
      }),
    ).toEqual(["term"]);
    expect(() =>
      estimateLoan({ principal: -5, monthlyRatePercent: 1, termMonths: 12 }),
    ).toThrow(RangeError);
  });
});
