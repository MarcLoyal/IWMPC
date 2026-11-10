import { getAreas } from "@/lib/content";
import { site } from "@/lib/site";
import { FormShell } from "./form-shell";

// Server-side wrappers: they read configuration and content, then hand plain
// props to the client FormShell. The Turnstile site key is public by design.
const shared = () => ({
  turnstileSiteKey: process.env.TURNSTILE_SECRET_KEY
    ? process.env.TURNSTILE_SITE_KEY
    : undefined,
  phone: site.phone,
  phoneTel: site.phoneTel,
});

export async function ReportForm() {
  const { areas } = await getAreas();
  return <FormShell kind="report" areas={areas} {...shared()} />;
}
export function ConnectionForm() {
  return <FormShell kind="connection" {...shared()} />;
}
export function MembershipForm() {
  return <FormShell kind="membership" {...shared()} />;
}
export function LoanInquiryForm() {
  return <FormShell kind="loan" {...shared()} />;
}
export function ContactForm() {
  return <FormShell kind="contact" {...shared()} />;
}
