import { describe, expect, it } from "vitest";
import { site, yearsOfService } from "@/lib/site";

describe("yearsOfService", () => {
  it("counts whole years since the founding date", () => {
    expect(site.founded).toBe("2003-07-01");
    expect(yearsOfService(new Date("2026-11-10T12:00:00+08:00"))).toBe(23);
    expect(yearsOfService(new Date("2026-06-30T12:00:00+08:00"))).toBe(22);
    expect(yearsOfService(new Date("2026-07-01T12:00:00+08:00"))).toBe(23);
  });
});

describe("phone number", () => {
  it("has a dialable form that matches the displayed number", () => {
    expect(site.phoneTel).toBe(`+63${site.phone!.replace(/\D/g, "").slice(1)}`);
  });
});
