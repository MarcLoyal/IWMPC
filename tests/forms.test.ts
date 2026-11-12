import { describe, expect, it, vi } from "vitest";
import fil from "@/messages/fil.json";
import en from "@/messages/en.json";
import { forms, FORM_KINDS, OPTIONS, schemas } from "@/lib/forms/definitions";
import {
  HONEYPOT,
  processSubmission,
  TURNSTILE_FIELD,
  type ProcessContext,
} from "@/lib/forms/process";
import { createRateLimiter } from "@/lib/rate-limit";
import { makeReference } from "@/lib/reference";
import {
  createEmailSink,
  createWebhookSink,
  type EmailMessage,
  type Submission,
  type SubmissionSink,
} from "@/lib/submissions";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkImage } from "@/lib/upload";

const NOW = new Date("2026-11-10T15:30:00+08:00");
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);

function formData(values: Record<string, string | File>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

const validReport = {
  issueType: "no_water",
  purok: "Purok 3",
  address: "Malapit sa chapel",
  accountNumber: "",
  name: "Juan Dela Cruz",
  mobile: "0917 123 4567",
  description: "Wala pong tubig simula kaninang umaga.",
  consent: "true",
  locale: "fil",
};

function context(overrides: Partial<ProcessContext> = {}) {
  const delivered: Submission[] = [];
  const sink: SubmissionSink = {
    name: "test",
    required: true,
    deliver: async (s) => void delivered.push(s),
  };
  const ctx: ProcessContext = {
    ip: "203.0.113.5",
    now: NOW,
    sinks: [sink],
    labels: { fields: fil.forms.fields, options: fil.forms.options },
    rateLimit: () => true,
    random: () => 0,
    ...overrides,
  };
  return { ctx, delivered };
}

describe("form definitions", () => {
  it("has a label in both languages for every field and option", () => {
    for (const messages of [fil, en]) {
      for (const kind of FORM_KINDS) {
        for (const field of forms[kind].fields) {
          expect(messages.forms.fields, `${kind}.${field.name}`).toHaveProperty(
            field.name,
          );
        }
      }
      for (const [group, values] of Object.entries(OPTIONS)) {
        for (const value of values) {
          expect(
            (messages.forms.options as Record<string, object>)[group],
            `${group}.${value}`,
          ).toHaveProperty(value);
        }
      }
    }
  });

  it("has a translated message for every validation error a schema can raise", () => {
    const keys = [
      "required",
      "mobile",
      "email",
      "consent",
      "tooLong",
      "amount",
    ];
    for (const messages of [fil, en])
      for (const k of keys) expect(messages.forms.errors).toHaveProperty(k);
  });

  it("accepts PH mobile numbers in both formats and normalises them", () => {
    const mobile = schemas.contact.shape.mobile;
    expect(mobile.parse("09171234567")).toBe("09171234567");
    expect(mobile.parse("+639171234567")).toBe("+639171234567");
    expect(mobile.parse("0917-123-4567")).toBe("09171234567");
    expect(mobile.parse(" 0917 123 4567 ")).toBe("09171234567");
  });

  it("rejects other phone formats", () => {
    const mobile = schemas.contact.shape.mobile;
    for (const bad of [
      "9171234567",
      "639171234567",
      "0917123456",
      "091712345678",
      "08171234567",
      "abc",
    ]) {
      expect(mobile.safeParse(bad).success, bad).toBe(false);
    }
    expect(mobile.safeParse("").error?.issues[0].message).toBe("required");
    expect(mobile.safeParse("12345").error?.issues[0].message).toBe("mobile");
  });

  it("requires consent on every form", () => {
    for (const kind of FORM_KINDS) {
      const result = schemas[kind].safeParse({ consent: false });
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some(
          (i) => i.path[0] === "consent" && i.message === "consent",
        ),
      ).toBe(true);
    }
  });

  it("treats email and amount as optional but validates them when given", () => {
    const base = {
      name: "Ana Reyes",
      mobile: "09171234567",
      subject: "other",
      message: "Hello",
      consent: true,
    };
    expect(schemas.contact.safeParse({ ...base, email: "" }).success).toBe(
      true,
    );
    expect(
      schemas.contact.safeParse({ ...base, email: "ana@example.com" }).success,
    ).toBe(true);
    expect(
      schemas.contact.safeParse({ ...base, email: "not-an-email" }).success,
    ).toBe(false);
    const amount = schemas.loan.shape.amount;
    expect(amount.safeParse("").success).toBe(true);
    expect(amount.safeParse("25,000").success).toBe(true);
    expect(amount.safeParse("0").success).toBe(false);
    expect(amount.safeParse("abc").success).toBe(false);
  });
});

describe("makeReference", () => {
  it("uses the prefix, the Manila date and four unambiguous characters", () => {
    expect(makeReference("RPT", NOW, () => 0)).toBe("RPT-20261110-AAAA");
    expect(makeReference("RPT", NOW)).toMatch(
      /^RPT-20261110-[A-HJKMNP-Z2-9]{4}$/,
    );
  });
  it("uses the Manila calendar day, not UTC", () => {
    // 23:30 UTC on the 10th is already the 11th in Manila
    expect(
      makeReference("MSG", new Date("2026-11-10T23:30:00Z"), () => 0),
    ).toBe("MSG-20261111-AAAA");
  });
});

describe("processSubmission", () => {
  it("delivers a valid report with reference, subject and readable rows", async () => {
    const { ctx, delivered } = context();
    const result = await processSubmission(
      "report",
      formData(validReport),
      ctx,
    );
    expect(result).toEqual({ ok: true, reference: "RPT-20261110-AAAA" });
    expect(delivered).toHaveLength(1);
    const s = delivered[0];
    expect(s.subject).toBe(
      "[IWMPC][Report] Walang tubig – Purok 3 – RPT-20261110-AAAA",
    );
    expect(s.rows).toContainEqual({
      label: "Uri ng problema",
      value: "Walang tubig",
    });
    expect(s.rows).toContainEqual({
      label: "Mobile number",
      value: "09171234567",
    });
    expect(s.data.issueType).toBe("no_water");
    expect(s.data).not.toHaveProperty("consent");
    expect(s.attachment).toBeUndefined();
  });

  it("returns field errors and delivers nothing when validation fails", async () => {
    const { ctx, delivered } = context();
    const result = await processSubmission(
      "report",
      formData({
        ...validReport,
        mobile: "12345",
        address: "",
        consent: "false",
      }),
      ctx,
    );
    expect(result).toEqual({
      ok: false,
      error: "validation",
      fieldErrors: {
        mobile: "mobile",
        address: "required",
        consent: "consent",
      },
    });
    expect(delivered).toHaveLength(0);
  });

  it("rejects a select value the form does not offer", async () => {
    const { ctx, delivered } = context();
    const result = await processSubmission(
      "report",
      formData({ ...validReport, issueType: "hacked" }),
      ctx,
    );
    expect(result).toMatchObject({ ok: false, error: "validation" });
    expect(delivered).toHaveLength(0);
  });

  it("silently drops submissions that fill the honeypot", async () => {
    const { ctx, delivered } = context();
    const result = await processSubmission(
      "report",
      formData({ ...validReport, [HONEYPOT]: "http://spam" }),
      ctx,
    );
    expect(result.ok).toBe(true);
    expect(delivered).toHaveLength(0);
  });

  it("stops at the rate limit", async () => {
    const { ctx, delivered } = context({ rateLimit: () => false });
    expect(
      await processSubmission("report", formData(validReport), ctx),
    ).toEqual({ ok: false, error: "rate" });
    expect(delivered).toHaveLength(0);
  });

  it("requires a valid Turnstile token when verification is on", async () => {
    const verifyHuman = vi.fn(async (token: string | null) => token === "good");
    const { ctx, delivered } = context({ verifyHuman });
    expect(
      await processSubmission("report", formData(validReport), ctx),
    ).toEqual({ ok: false, error: "spam" });
    expect(verifyHuman).toHaveBeenCalledWith(null);
    const ok = await processSubmission(
      "report",
      formData({ ...validReport, [TURNSTILE_FIELD]: "good" }),
      ctx,
    );
    expect(ok.ok).toBe(true);
    expect(delivered).toHaveLength(1);
  });

  it("attaches a valid photo under the reference number", async () => {
    const { ctx, delivered } = context();
    const photo = new File([JPEG], "IMG_0001.heic.exe", {
      type: "application/octet-stream",
    });
    const result = await processSubmission(
      "report",
      formData({ ...validReport, photo }),
      ctx,
    );
    expect(result.ok).toBe(true);
    expect(delivered[0].attachment).toMatchObject({
      filename: "RPT-20261110-AAAA.jpg",
      contentType: "image/jpeg",
    });
  });

  it("rejects a file that is not an image, whatever it claims to be", async () => {
    const { ctx, delivered } = context();
    const fake = new File(
      [new TextEncoder().encode("<script>alert(1)</script>")],
      "photo.jpg",
      { type: "image/jpeg" },
    );
    expect(
      await processSubmission(
        "report",
        formData({ ...validReport, photo: fake }),
        ctx,
      ),
    ).toEqual({
      ok: false,
      error: "photoType",
    });
    expect(delivered).toHaveLength(0);
  });

  it("reports a configuration error when nothing can receive the submission", async () => {
    const { ctx } = context({ sinks: [] });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      await processSubmission(
        "contact",
        formData({
          name: "Ana Reyes",
          mobile: "09171234567",
          email: "",
          subject: "billing",
          message: "Tanong po",
          consent: "true",
        }),
        ctx,
      ),
    ).toEqual({ ok: false, error: "config" });
    spy.mockRestore();
  });

  it("reports a send error when the email sink fails", async () => {
    const failing: SubmissionSink = {
      name: "email",
      required: true,
      deliver: async () => {
        throw new Error("boom");
      },
    };
    const { ctx } = context({ sinks: [failing] });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      await processSubmission("report", formData(validReport), ctx),
    ).toEqual({ ok: false, error: "send" });
    spy.mockRestore();
  });

  it("still succeeds when only the optional webhook copy fails", async () => {
    const sent: EmailMessage[] = [];
    const email = createEmailSink(
      { from: "no-reply@example.com", to: "coop@example.com" },
      async (m) => void sent.push(m),
    );
    const webhook = createWebhookSink("https://hooks.example.com/x", {
      required: false,
      fetch: (async () => new Response("no", { status: 500 })) as typeof fetch,
    });
    const { ctx } = context({ sinks: [email, webhook] });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await processSubmission(
      "contact",
      formData({
        name: "Ana Reyes",
        mobile: "09171234567",
        email: "ana@example.com",
        subject: "billing",
        message: "Tanong po",
        consent: "true",
      }),
      ctx,
    );
    spy.mockRestore();
    expect(result.ok).toBe(true);
    expect(sent[0]).toMatchObject({
      from: "no-reply@example.com",
      to: "coop@example.com",
      replyTo: "ana@example.com",
      subject:
        "[IWMPC][Contact] Bill at bayarin – Ana Reyes – MSG-20261110-AAAA",
    });
  });
});

describe("webhook sink", () => {
  it("posts the submission as JSON without the photo bytes", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const sink = createWebhookSink("https://hooks.example.com/x", {
      required: true,
      fetch: (async (url: string, init: RequestInit) => {
        calls.push({ url, init });
        return new Response("ok");
      }) as unknown as typeof fetch,
    });
    const { ctx } = context({ sinks: [sink] });
    const photo = new File([JPEG], "a.jpg");
    await processSubmission("report", formData({ ...validReport, photo }), ctx);
    expect(calls[0].url).toBe("https://hooks.example.com/x");
    expect(JSON.parse(String(calls[0].init.body))).toEqual({
      kind: "report",
      reference: "RPT-20261110-AAAA",
      submitted_at: NOW.toISOString(),
      locale: "fil",
      subject: "[IWMPC][Report] Walang tubig – Purok 3 – RPT-20261110-AAAA",
      data: expect.objectContaining({
        issueType: "no_water",
        mobile: "09171234567",
      }),
      has_photo: true,
    });
  });
});

describe("rate limiter", () => {
  it("allows the limit, blocks the next, and resets after the window", () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: 600_000 });
    for (let i = 0; i < 5; i++)
      expect(limiter.check("ip", 1000 + i)).toBe(true);
    expect(limiter.check("ip", 2000)).toBe(false);
    expect(limiter.check("other-ip", 2000)).toBe(true);
    expect(limiter.check("ip", 1000 + 600_000)).toBe(true);
  });
});

describe("verifyTurnstile", () => {
  const respond = (body: unknown, status = 200) =>
    (async () =>
      new Response(JSON.stringify(body), {
        status,
      })) as unknown as typeof fetch;

  it("passes only when Cloudflare says success", async () => {
    expect(
      await verifyTurnstile("t", {
        secret: "s",
        fetch: respond({ success: true }),
      }),
    ).toBe(true);
    expect(
      await verifyTurnstile("t", {
        secret: "s",
        fetch: respond({ success: false }),
      }),
    ).toBe(false);
    expect(
      await verifyTurnstile("t", { secret: "s", fetch: respond({}, 500) }),
    ).toBe(false);
  });
  it("fails closed on a missing token or a network error", async () => {
    expect(
      await verifyTurnstile("", {
        secret: "s",
        fetch: respond({ success: true }),
      }),
    ).toBe(false);
    const broken = (async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    expect(await verifyTurnstile("t", { secret: "s", fetch: broken })).toBe(
      false,
    );
  });
});

describe("checkImage", () => {
  it("recognises JPEG, PNG and WebP by their first bytes", () => {
    expect(checkImage(JPEG)).toMatchObject({
      ok: true,
      contentType: "image/jpeg",
    });
    expect(
      checkImage(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]),
      ),
    ).toMatchObject({ ok: true, extension: "png" });
    const webp = new Uint8Array([
      ...new TextEncoder().encode("RIFF"),
      0,
      0,
      0,
      0,
      ...new TextEncoder().encode("WEBP"),
    ]);
    expect(checkImage(webp)).toMatchObject({
      ok: true,
      contentType: "image/webp",
    });
  });
  it("rejects other files and anything over 3 MB", () => {
    expect(checkImage(new TextEncoder().encode("%PDF-1.7"))).toEqual({
      ok: false,
      error: "photoType",
    });
    const big = new Uint8Array(3 * 1024 * 1024 + 1);
    big.set(JPEG);
    expect(checkImage(big)).toEqual({ ok: false, error: "photoTooLarge" });
  });
});
