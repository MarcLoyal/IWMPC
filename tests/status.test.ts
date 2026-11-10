import { describe, expect, it } from "vitest";
import { effectiveStatus, type SupplyStatus } from "@/lib/status";

const base: SupplyStatus = {
  level: "scheduled",
  title_fil: "May interruption",
  affected_areas: ["Purok 1"],
  starts_at: new Date("2026-11-15T08:00:00+08:00"),
  ends_at: new Date("2026-11-15T14:00:00+08:00"),
  updated_at: new Date("2026-11-10T09:00:00+08:00"),
};

describe("effectiveStatus", () => {
  it("keeps a scheduled interruption before and during its window", () => {
    expect(effectiveStatus(base, new Date("2026-11-12T00:00:00+08:00"))).toBe(
      base,
    );
    expect(effectiveStatus(base, new Date("2026-11-15T13:59:59+08:00"))).toBe(
      base,
    );
  });

  it("falls back to normal once a scheduled interruption has ended", () => {
    const result = effectiveStatus(base, new Date("2026-11-15T14:00:00+08:00"));
    expect(result.level).toBe("normal");
    expect(result.affected_areas).toEqual([]);
    expect(result.link).toBeUndefined();
    expect(result.updated_at).toEqual(base.ends_at);
  });

  it("keeps a scheduled interruption that has no end time", () => {
    const open = { ...base, ends_at: undefined };
    expect(effectiveStatus(open, new Date("2027-01-01T00:00:00+08:00"))).toBe(
      open,
    );
  });

  it("never clears an outage automatically", () => {
    const outage = { ...base, level: "outage" as const };
    expect(effectiveStatus(outage, new Date("2027-01-01T00:00:00+08:00"))).toBe(
      outage,
    );
  });

  it("leaves a normal status alone", () => {
    const normal = { ...base, level: "normal" as const };
    expect(effectiveStatus(normal, new Date("2027-01-01T00:00:00+08:00"))).toBe(
      normal,
    );
  });
});
