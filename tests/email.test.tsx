import { describe, expect, it } from "vitest";
import { render } from "@react-email/components";
import { SubmissionEmail } from "@/emails/submission-email";
import type { Submission } from "@/lib/submissions";

const submission: Submission = {
  kind: "report",
  reference: "RPT-20261110-AAAA",
  submittedAt: new Date("2026-11-10T15:30:00+08:00"),
  locale: "fil",
  subject: "[IWMPC][Report] Walang tubig – Purok 3 – RPT-20261110-AAAA",
  rows: [
    { label: "Uri ng problema", value: "Walang tubig" },
    { label: "Paglalarawan", value: "<b>bold?</b> & more" },
    { label: "Account number", value: "" },
  ],
  data: {},
  attachment: {
    filename: "RPT-20261110-AAAA.jpg",
    content: Buffer.from([]),
    contentType: "image/jpeg",
  },
};

describe("SubmissionEmail", () => {
  it("renders the reference, every row and the Manila timestamp", async () => {
    const html = await render(<SubmissionEmail submission={submission} />);
    expect(html).toContain("RPT-20261110-AAAA");
    expect(html).toContain("Uri ng problema");
    expect(html).toContain("Walang tubig");
    expect(html).toContain("November 10, 2026");
    expect(html).toMatch(/3:30/);
    expect(html).toContain("May kalakip na larawan");
  });

  it("escapes whatever the member typed", async () => {
    const html = await render(<SubmissionEmail submission={submission} />);
    expect(html).not.toContain("<b>bold?</b>");
    expect(html).toContain("&lt;b&gt;bold?&lt;/b&gt;");
  });
});
