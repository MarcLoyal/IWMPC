import type { FormKind } from "@/lib/forms/definitions";

/**
 * Where a validated form submission goes.
 *
 * v1 stores nothing: a submission is emailed to the cooperative (and
 * optionally forwarded to a webhook). Phase 2 can add a Supabase sink here
 * without touching any form — implement `SubmissionSink` and add it to
 * `configuredSinks`.
 */

export type Submission = {
  kind: FormKind;
  reference: string;
  submittedAt: Date;
  locale: string;
  /** Email subject, e.g. "[IWMPC][Report] Walang tubig – Purok 3 – RPT-…". */
  subject: string;
  /** Human-readable rows for the email, in form order. */
  rows: { label: string; value: string }[];
  /** Raw validated values, for machines (webhook, future database). */
  data: Record<string, string>;
  replyTo?: string;
  attachment?: { filename: string; content: Buffer; contentType: string };
};

export interface SubmissionSink {
  name: string;
  /** If true, a failure here fails the whole submission. */
  required: boolean;
  deliver(submission: Submission): Promise<void>;
}

export class NotConfiguredError extends Error {
  constructor() {
    super(
      "No submission sink is configured (set RESEND_API_KEY, FORM_TO_EMAIL and FORM_FROM_EMAIL).",
    );
  }
}

/** Sends to every sink. Throws if no sink exists or a required one fails. */
export async function deliverSubmission(
  submission: Submission,
  sinks: SubmissionSink[],
): Promise<void> {
  if (sinks.length === 0) throw new NotConfiguredError();

  const results = await Promise.allSettled(
    sinks.map((sink) => sink.deliver(submission)),
  );
  const failures = results.flatMap((result, i) =>
    result.status === "rejected"
      ? [{ sink: sinks[i], reason: result.reason }]
      : [],
  );
  for (const { sink, reason } of failures) {
    console.error(
      `[forms] ${sink.name} failed for ${submission.reference}:`,
      reason,
    );
  }
  // With email as the record of truth, a webhook hiccup must not lose the member's report.
  const fatal =
    failures.find((f) => f.sink.required) ??
    (failures.length === sinks.length ? failures[0] : undefined);
  if (fatal)
    throw new Error(
      `Submission ${submission.reference} could not be delivered via ${fatal.sink.name}`,
    );
}

/* ---------- Webhook ---------- */

export function webhookPayload(submission: Submission) {
  return {
    kind: submission.kind,
    reference: submission.reference,
    submitted_at: submission.submittedAt.toISOString(),
    locale: submission.locale,
    subject: submission.subject,
    data: submission.data,
    has_photo: Boolean(submission.attachment),
  };
}

export function createWebhookSink(
  url: string,
  options: { required: boolean; fetch?: typeof fetch },
): SubmissionSink {
  return {
    name: "webhook",
    required: options.required,
    async deliver(submission) {
      const res = await (options.fetch ?? fetch)(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(webhookPayload(submission)),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    },
  };
}

/* ---------- Email ---------- */

export type EmailMessage = {
  from: string;
  to: string;
  subject: string;
  replyTo?: string;
  submission: Submission;
};

export function createEmailSink(
  config: { from: string; to: string },
  send: (message: EmailMessage) => Promise<void>,
): SubmissionSink {
  return {
    name: "email",
    required: true,
    deliver: (submission) =>
      send({
        from: config.from,
        to: config.to,
        subject: submission.subject,
        replyTo: submission.replyTo,
        submission,
      }),
  };
}
