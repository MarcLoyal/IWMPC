"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { SubmissionEmail } from "@/emails/submission-email";
import fil from "@/messages/fil.json";
import { FORM_KINDS, type FormKind } from "@/lib/forms/definitions";
import { processSubmission, type SubmitResult } from "@/lib/forms/process";
import { formRateLimiter } from "@/lib/rate-limit";
import {
  createEmailSink,
  createWebhookSink,
  type SubmissionSink,
} from "@/lib/submissions";
import { verifyTurnstile } from "@/lib/turnstile";

function configuredSinks(): SubmissionSink[] {
  const sinks: SubmissionSink[] = [];
  const { RESEND_API_KEY, FORM_TO_EMAIL, FORM_FROM_EMAIL, FORM_WEBHOOK_URL } =
    process.env;

  if (RESEND_API_KEY && FORM_TO_EMAIL && FORM_FROM_EMAIL) {
    const resend = new Resend(RESEND_API_KEY);
    sinks.push(
      createEmailSink(
        { from: FORM_FROM_EMAIL, to: FORM_TO_EMAIL },
        async (message) => {
          const { error } = await resend.emails.send({
            from: message.from,
            to: message.to,
            subject: message.subject,
            replyTo: message.replyTo,
            react: <SubmissionEmail submission={message.submission} />,
            attachments: message.submission.attachment
              ? [
                  {
                    filename: message.submission.attachment.filename,
                    content: message.submission.attachment.content,
                    contentType: message.submission.attachment.contentType,
                  },
                ]
              : undefined,
          });
          if (error) throw new Error(`Resend: ${error.message}`);
        },
      ),
    );
  }

  if (FORM_WEBHOOK_URL) {
    // The webhook is a copy when email is set up, and the only route when it is not.
    sinks.push(
      createWebhookSink(FORM_WEBHOOK_URL, { required: sinks.length === 0 }),
    );
  }

  // Local development without any keys: print the submission instead of failing.
  if (sinks.length === 0 && process.env.NODE_ENV !== "production") {
    sinks.push({
      name: "console",
      required: true,
      async deliver(submission) {
        console.info(
          "[forms] (dev) submission:",
          submission.subject,
          submission.data,
        );
      },
    });
  }
  return sinks;
}

/** Server action behind every form on the site. */
export async function submitForm(
  kind: FormKind,
  formData: FormData,
): Promise<SubmitResult> {
  if (!FORM_KINDS.includes(kind)) return { ok: false, error: "validation" };

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const secret = process.env.TURNSTILE_SECRET_KEY;

  return processSubmission(kind, formData, {
    ip,
    now: new Date(),
    sinks: configuredSinks(),
    labels: { fields: fil.forms.fields, options: fil.forms.options },
    rateLimit: (key) => formRateLimiter.check(key),
    // Turnstile is enforced once both keys are set; the honeypot and rate limit always apply.
    verifyHuman:
      secret && process.env.TURNSTILE_SITE_KEY
        ? (token) =>
            verifyTurnstile(token, {
              secret,
              ip: ip === "unknown" ? undefined : ip,
            })
        : undefined,
  });
}
