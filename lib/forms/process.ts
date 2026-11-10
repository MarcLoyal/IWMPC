import { z } from "zod";
import { checkImage } from "@/lib/upload";
import { makeReference } from "@/lib/reference";
import {
  deliverSubmission,
  NotConfiguredError,
  type Submission,
  type SubmissionSink,
} from "@/lib/submissions";
import { forms, OPTIONS, schemas, type FormKind } from "./definitions";

export type SubmitError =
  | "validation"
  | "rate"
  | "spam"
  | "config"
  | "send"
  | "photoTooLarge"
  | "photoType";

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; error: SubmitError; fieldErrors?: Record<string, string> };

/** Labels used in the staff email (always Filipino). */
export type FormLabels = {
  fields: Record<string, string>;
  options: Record<string, Record<string, string>>;
};

export type ProcessContext = {
  ip: string;
  now: Date;
  sinks: SubmissionSink[];
  labels: FormLabels;
  rateLimit: (key: string) => boolean;
  /** Returns true when the visitor passed the Turnstile check; omit to skip the check. */
  verifyHuman?: (token: string | null) => Promise<boolean>;
  random?: () => number;
};

/** Name of the hidden field real visitors never see or fill in. */
export const HONEYPOT = "website";
export const TURNSTILE_FIELD = "cf-turnstile-response";

function optionLabel(labels: FormLabels, group: string, value: string) {
  return labels.options[group]?.[value] ?? value;
}

/**
 * Validates and delivers one form submission. Everything from the browser is
 * re-checked here; nothing is stored.
 */
export async function processSubmission(
  kind: FormKind,
  formData: FormData,
  ctx: ProcessContext,
): Promise<SubmitResult> {
  const def = forms[kind];
  const reference = makeReference(def.prefix, ctx.now, ctx.random);

  // Bots fill every field. Answer as if it worked so they learn nothing.
  if (String(formData.get(HONEYPOT) ?? "").trim() !== "") {
    return { ok: true, reference };
  }

  if (!ctx.rateLimit(ctx.ip)) return { ok: false, error: "rate" };

  if (ctx.verifyHuman) {
    const token = formData.get(TURNSTILE_FIELD);
    if (!(await ctx.verifyHuman(typeof token === "string" ? token : null))) {
      return { ok: false, error: "spam" };
    }
  }

  // Fields
  const raw: Record<string, unknown> = {
    consent: formData.get("consent") === "true",
  };
  for (const field of def.fields) {
    if (field.type !== "photo")
      raw[field.name] = String(formData.get(field.name) ?? "");
  }
  const parsed = (
    schemas[kind] as z.ZodType<Record<string, string | boolean>>
  ).safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "validation", fieldErrors };
  }
  const values = parsed.data;

  // Select values must be ones the form actually offers ("areas" is free: the list is content).
  for (const field of def.fields) {
    if (field.type === "select" && field.options && field.options !== "areas") {
      const allowed: readonly string[] = OPTIONS[field.options];
      if (!allowed.includes(String(values[field.name]))) {
        return {
          ok: false,
          error: "validation",
          fieldErrors: { [field.name]: "required" },
        };
      }
    }
  }

  // Photo (optional, one image)
  let attachment: Submission["attachment"];
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const bytes = new Uint8Array(await photo.arrayBuffer());
    const image = checkImage(bytes);
    if (!image.ok) return { ok: false, error: image.error };
    attachment = {
      filename: `${reference}.${image.extension}`,
      content: Buffer.from(bytes),
      contentType: image.contentType,
    };
  }

  const display = (name: string) => {
    const field = def.fields.find((f) => f.name === name);
    const value = String(values[name] ?? "");
    return field?.type === "select" && field.options
      ? optionLabel(ctx.labels, field.options, value)
      : value;
  };

  const data: Record<string, string> = {};
  const rows: Submission["rows"] = [];
  for (const field of def.fields) {
    if (field.type === "photo") continue;
    data[field.name] = String(values[field.name] ?? "");
    rows.push({
      label: ctx.labels.fields[field.name] ?? field.name,
      value: display(field.name),
    });
  }

  const summary = def.summary.map(display).filter(Boolean);
  const submission: Submission = {
    kind,
    reference,
    submittedAt: ctx.now,
    locale: String(formData.get("locale") ?? "fil").slice(0, 5),
    subject: [
      `[IWMPC][${def.tag}] ${summary.join(" – ")}`.trim(),
      reference,
    ].join(" – "),
    rows,
    data,
    replyTo: data.email || undefined,
    attachment,
  };

  try {
    await deliverSubmission(submission, ctx.sinks);
  } catch (error) {
    if (error instanceof NotConfiguredError) {
      console.error(`[forms] ${error.message}`);
      return { ok: false, error: "config" };
    }
    return { ok: false, error: "send" };
  }
  return { ok: true, reference };
}
